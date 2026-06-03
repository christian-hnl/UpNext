import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {environment} from '../environments/environment';
import { Database} from '../app/database.types';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient<Database>;


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
        status: "running"
      }).select();

    if (error) {
      console.error('[SupabaseService] Error adding private session:', error.message);
      return null;
    }

    console.log('[SupabaseService] Private session added successfully:', data);
    return data;
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

    async addSongToQueue(sessionId: number, song: { spotify_id: string, title: string, artist: string, album_image?: string }, userId: string) {
        console.log(`[SupabaseService] addSongToQueue called: sessionId=${sessionId}, song=${song.title}, userId=${userId}`);
        // Zuerst den Song in der globalen Songs-Tabelle registrieren/updaten
        const { error: songError } = await this.supabase
            .from('songs')
            .upsert({
                spotify_id: song.spotify_id,
                title: song.title,
                artist: song.artist,
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
                score: 1, // Start mit 1 Vote vom Hinzufüger
                status: 'queued'
            })
            .select()
            .single();

        if (error) {
            console.error('[SupabaseService] Fehler beim Hinzufügen zur Queue:', error.message);
            return null;
        }

        console.log('[SupabaseService] Song added to queue successfully:', data);

        // Automatisch den ersten Vote erstellen
        await this.vote(data.id, userId, 1);

        return data;
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
        // Vote einfügen oder aktualisieren (Upsert)
        
        const { data: existingVote } = await this.supabase
            .from('votes')
            .select('*')
            .eq('queue_id', queueId)
            .eq('participant_id', participantId)
            .maybeSingle();

        let error;
        if (existingVote) {
            console.log('[SupabaseService] Updating existing vote:', existingVote.id);
            const { error: updateError } = await this.supabase
                .from('votes')
                .update({ vote: value })
                .eq('id', existingVote.id);
            error = updateError;
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
        return this.updateQueueScore(queueId);
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
        return this.supabase
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
            )
            .subscribe((status) => {
                console.log(`[SupabaseService] Subscription status for queue-${sessionId}:`, status);
            });

    }
}