import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;


  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  private formatSessionId(id: number): string {
    return `00000000-0000-0000-0000-${id.toString().padStart(12, "0")}`;
  }

  async addPrivateSession(titleEingabe: string) {
    console.log('[SupabaseService] addPrivateSession called with title:', titleEingabe);
    const randSessionId = Math.floor(100000 + Math.random() * 900000);
    const qrUrl = window.location.origin + '/mode1/session-member/' + randSessionId;
    console.log('[SupabaseService] Generated QR URL:', qrUrl);


    const { data, error } = await this.supabase
      .from('private_sessions').insert({
        session_id: randSessionId,
        title: titleEingabe,
        qrCodeData: qrUrl,
        status: "running",
        spotify_token: JSON.stringify(await this.getSpotifyToken()),
        active_device_id: null
      }).select();

    if (error) {
      console.error('[SupabaseService] Error adding private session:', error.message);
      return null;
    }

    console.log('[SupabaseService] Private session added successfully:', data);
    return data;
  }

  async updateSessionToken(sessionId: number, tokenStr: string) {
    return this.supabase
      .from('private_sessions')
      .update({ spotify_token: tokenStr })
      .eq('session_id', sessionId);
  }

  async updateActiveDevice(sessionId: number, deviceId: string | null) {
    return this.supabase
      .from('private_sessions')
      .update({ active_device_id: deviceId })
      .eq('session_id', sessionId);
  }

  async updateSessionStatus(sessionId: number, status: string) {
    return this.supabase
      .from('private_sessions')
      .update({ status: status })
      .eq('session_id', sessionId);
  }

  private async getSpotifyToken() {
    // Versuchen das Token aus dem localStorage zu lesen (wo das Spotify SDK es speichert)
    const tokenStr = localStorage.getItem('spotify-sdk:AuthorizationCodeWithPKCEStrategy:token');
    if (tokenStr) {
      return JSON.parse(tokenStr);
    }
    return null;
  }


  //joining
  async joinPrivateSession(id: number) {
    return this.supabase
        .from('private_sessions')
        .select('session_id')
        .eq('session_id', id)
        .maybeSingle();
  }

  async joinPublicSession(id: number) {
      return this.supabase
          .from('public_sessions')
          .select('session_id')
          .eq('session_id', id)
          .maybeSingle();
  }

  async getPrivateSessionInfos(id: number) {
    return this.supabase
      .from('private_sessions')
        .select('*')
        .eq('session_id', id)
        .maybeSingle();
  }

  async addUser(username: string, sessionId: number, host: boolean) {
    console.log(`[SupabaseService] addUser called: username=${username}, sessionId=${sessionId}, host=${host}`);
    let role: string = 'member';
    if (host) role = 'host';

    const result = await this.supabase
      .from('participants')
        .insert({
          name: username,
          role: role,
          session_id: sessionId
        }).select('id')
        .single();

    if (result.error) {
      console.error('[SupabaseService] Error adding user:', result.error.message);
    } else {
      console.log('[SupabaseService] User added successfully:', result.data);
    }

    return result;
  }

  async getUserInfos(id: string) {
      return this.supabase
          .from('participants')
          .select('*')
          .eq('id', id)
        .single();
  }


  async getMemberNamesBySessionId(sessionId: number) {
      return this.supabase
          .from('participants')
          .select('name')
          .eq('session_id', sessionId)
          .eq('role', 'member');
  }

    async getHostNameBySessionId(sessionId: number) {
        return this.supabase
            .from('participants')
            .select('name')
            .eq('session_id', sessionId)
            .eq('role', 'host')
            .single();
    }

    async addSongToQueue(sessionId: number, song: { spotify_id: string, title: string, artist: string, album_image?: string, duration_ms?: number }, userId: string) {
        console.log(`[SupabaseService] addSongToQueue called: sessionId=${sessionId}, song=${song.title}, userId=${userId}`);
        
        // Host-Device abrufen, falls vorhanden
        let deviceId = null;
        const { data: sessionInfo } = await this.getPrivateSessionInfos(sessionId);
        if (sessionInfo && (sessionInfo as any).active_device_id) {
            deviceId = (sessionInfo as any).active_device_id;
        }

        // Zuerst den Song in der globalen Songs-Tabelle registrieren/updaten
        const { error: songError } = await this.supabase
            .from('songs')
            .upsert({
                spotify_id: song.spotify_id,
                title: song.title,
                artist: song.artist,
                album_image: song.album_image,
                duration_ms: song.duration_ms,
                sessionId: sessionId
            });

        if (songError) {
            console.error('[SupabaseService] Fehler beim Speichern des Songs:', songError.message);
            return null;
        }

        // Dann in die session_queue einfügen
        const { data, error } = await this.supabase
            .from('session_queue')
            .insert({
                session_id: this.formatSessionId(sessionId),
                spotify_id: song.spotify_id,
                suggested_by: userId,
                score: 0, // Start mit 0, Vote wird unten hinzugefügt
                status: 'queued'
            })
            .select()
            .single();

        if (error) {
            console.error('[SupabaseService] Fehler beim Hinzufügen zur Queue:', error.message);
            
            // Falls der User nicht existiert (Foreign Key Error), versuchen wir ihn hinzuzufügen
            if (error.message.includes('session_queue_suggested_by_fkey')) {
                console.log('[SupabaseService] User seems to be missing in participants, attempting recovery...');
                // Da wir hier nur die userId haben, aber keinen Namen, ist es schwierig.
                // Aber normalerweise sollte der User existieren.
            }
            return null;
        }

        console.log('[SupabaseService] Song added to queue successfully:', data);

        // Automatisch den ersten Vote erstellen
        await this.vote(data.id, userId, 1);

        return { ...data, deviceId };
    }

    async getQueue(sessionId: number) {
        return this.supabase
            .from('session_queue')
            .select(`
                *,
                songs (*)
            `)
            .eq('session_id', this.formatSessionId(sessionId))
            .eq('status', 'queued')
            .order('score', { ascending: false })
            .limit(10);
    }

    async vote(queueId: number, participantId: string, value: number) {
        console.log(`[SupabaseService] vote called: queueId=${queueId}, participantId=${participantId}, value=${value}`);
        
        const { data: existingVote } = await this.supabase
            .from('votes')
            .select('*')
            .eq('queue_id', queueId)
            .eq('participant_id', participantId)
            .maybeSingle();

        let error;
        if (existingVote) {
            if (existingVote.vote === value) {
                console.log('[SupabaseService] Removing vote (toggle)');
                const { error: deleteError } = await this.supabase
                    .from('votes')
                    .delete()
                    .eq('id', existingVote.id);
                error = deleteError;
            } else {
                console.log('[SupabaseService] Updating existing vote:', existingVote.id);
                const { error: updateError } = await this.supabase
                    .from('votes')
                    .update({ vote: value })
                    .eq('id', existingVote.id);
                error = updateError;
            }
        } else {
            console.log('[SupabaseService] Inserting new vote');
            const { error: insertError } = await this.supabase
                .from('votes')
                .insert({
                    queue_id: queueId,
                    participant_id: participantId,
                    vote: value
                });
            error = insertError;
        }

        if (error) {
            console.error('[SupabaseService] Fehler beim Voten:', error.message);
            return null;
        }

        console.log('[SupabaseService] Vote registered successfully, updating queue score');
        // Score in session_queue aktualisieren
        const updatedItem = await this.updateQueueScore(queueId);
        
        if (updatedItem) {
            await this.checkAutoDelete(updatedItem);
        }
        
        return updatedItem;
    }

    private async checkAutoDelete(queueItem: any) {
        // Wir brauchen die Anzahl der Teilnehmer in dieser Session
        // session_id im queueItem ist ein UUID-String. Wir müssen sie in eine Zahl umwandeln für getMemberNamesBySessionId
        // Oder wir machen eine neue Methode.
        const numericSessionId = parseInt(queueItem.session_id.split('-').pop() || "0", 10);
        
        const { count, error } = await this.supabase
            .from('participants')
            .select('*', { count: 'exact', head: true })
            .eq('session_id', numericSessionId);
            
        if (error || count === null) return;
        
        // Downvotes zählen (Stimmen mit Wert -1)
        const { count: downvoteCount, error: dvError } = await this.supabase
            .from('votes')
            .select('*', { count: 'exact', head: true })
            .eq('queue_id', queueItem.id)
            .eq('vote', -1);
            
        if (dvError || downvoteCount === null) return;
        
        console.log(`[SupabaseService] Auto-delete check: ${downvoteCount} downvotes for ${count} participants`);
        
        if (downvoteCount >= count * 0.5) {
            console.log(`[SupabaseService] Auto-deleting song ${queueItem.id} due to 50% downvotes`);
            await this.supabase
                .from('session_queue')
                .update({ status: 'deleted' })
                .eq('id', queueItem.id);
        }
    }

    private async updateQueueScore(queueId: number) {
        console.log('[SupabaseService] updateQueueScore called for queueId:', queueId);
        const { data: votes, error: votesError } = await this.supabase
            .from('votes')
            .select('vote')
            .eq('queue_id', queueId);

        if (votesError) {
            console.error('[SupabaseService] Error fetching votes for score update:', votesError.message);
            return null;
        }

        if (!votes) {
            console.warn('[SupabaseService] No votes found for queueId:', queueId);
            return null;
        }

        const totalScore = votes.reduce((acc, vote) => acc + (vote.vote || 0), 0);
        console.log(`[SupabaseService] Calculated total score for queueId ${queueId}: ${totalScore}`);

        const { data, error } = await this.supabase
            .from('session_queue')
            .update({ score: totalScore })
            .eq('id', queueId)
            .select()
            .single();

        if (error) {
            console.error('[SupabaseService] Error updating session_queue score:', error.message);
        } else {
            console.log('[SupabaseService] session_queue score updated successfully:', data);
        }
        
        return data;
    }

    async getSongVotes(sessionId: number, spotifyId: string) {
        const { data, error } = await this.supabase
            .from('session_queue')
            .select('score')
            .eq('session_id', this.formatSessionId(sessionId))
            .eq('spotify_id', spotifyId)
            .maybeSingle();
            
        if (error) return 0;
        return data?.score || 0;
    }

    subscribeToQueue(sessionId: number, callback: (payload: any) => void) {
        console.log(`[SupabaseService] Subscribing to queue for sessionId=${sessionId}`);
        
        // WICHTIG: In Supabase muss "Replication" für die Tabelle "session_queue" aktiviert sein!
        const channel = this.supabase
            .channel(`queue-${sessionId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'session_queue',
                    filter: `session_id=eq.${this.formatSessionId(sessionId)}`
                },
                (payload) => {
                    console.log('[SupabaseService] Realtime update received for session_queue:', payload);
                    callback(payload);
                }
            );
            
        channel.subscribe((status) => {
            console.log(`[SupabaseService] Subscription status for queue-${sessionId}:`, status);
            if (status === 'CHANNEL_ERROR') {
                console.error('[SupabaseService] Realtime subscription failed. Check if replication is enabled in Supabase dashboard.');
            }
        });

        return channel;
    }
}