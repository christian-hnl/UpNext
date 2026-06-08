import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {environment} from '../environments/environment';
import {Database} from "../app/database.types";

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
    supabase: SupabaseClient<Database>;


  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  private formatSessionId(id: number): string {
    return `00000000-0000-0000-0000-${id.toString().padStart(12, "0")}`;
  }

  async addPrivateSession(titleEingabe: string) {
    // Konvention: erste Ziffer = Modus. Modus-1-Sessions (privat) beginnen mit 1 → 100000-199999
    const randSessionId = 100000 + Math.floor(Math.random() * 100000);
    const qrUrl = window.location.origin + '/mode1/session-member/' + randSessionId;


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
    let role: string = 'member';
    if (host) role = 'host';

    return this.supabase
      .from('participants')
        .insert({
          name: username,
          role: role,
          session_id: sessionId
        }).select('id')
        .single();
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

    async checkHost(userId: string, sessionId: number) {
        return this.supabase
            .from('participants')
            .select('id')
            .eq('id', userId)
            .eq('session_id', sessionId)
            .eq('role', 'host')
            .maybeSingle();
    }

    async getAllParticipantsBySessionId(sessionId: number) {
        return this.supabase
            .from('participants')
            .select('*')
            .eq('session_id', sessionId)
            .order('joined_at', { ascending: true });
    }

    async setParticipantStatus(participantId: string, status: string) {
        return this.supabase
            .from('participants')
            .update({ status })
            .eq('id', participantId);
    }

    async endSession(sessionId: number) {
        return this.supabase
            .from('private_sessions')
            .update({ status: 'finished' })
            .eq('session_id', sessionId);
    }



    //queue logic
    async addSongToQueue(sessionId: number, song: { spotify_id: string, title: string, artist: string, album_image?: string, duration_ms: number }, userId: string) {
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
                score: 1, // Start mit 1 Vote vom Hinzufüger
                status: 'queued'
            })
            .select()
            .single();

        if (error) {
            console.error('[SupabaseService] Fehler beim Hinzufügen zur Queue:', error.message);
            return null;
        }


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

    async removeSongFromQueue(queueId: number) {
        // Votes zuerst loeschen (Fremdschluessel-Constraint), dann den Queue-Eintrag
        await this.supabase.from('votes').delete().eq('queue_id', queueId);
        return this.supabase.from('session_queue').delete().eq('id', queueId);
    }

    async vote(queueId: number, participantId: string, value: number) {
        // Vote einfügen oder aktualisieren (Upsert)
        
        const { data: existingVote } = await this.supabase
            .from('votes')
            .select('*')
            .eq('queue_id', queueId)
            .eq('participant_id', participantId)
            .maybeSingle();

        let error;
        if (existingVote) {
            const { error: updateError } = await this.supabase
                .from('votes')
                .update({ vote: value })
                .eq('id', existingVote.id);
            error = updateError;
        } else {
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

        // Score in session_queue aktualisieren
        return this.updateQueueScore(queueId);
    }

    private async updateQueueScore(queueId: number) {
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

        const { data, error } = await this.supabase
            .from('session_queue')
            .update({ score: totalScore })
            .eq('id', queueId)
            .select()
            .single();

        if (error) {
            console.error('[SupabaseService] Error updating session_queue score:', error.message);
        } else {
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
        // Eindeutiger Channel-Name pro Abo: mehrere Komponenten (queuevoting + search)
        // abonnieren dieselbe Session, duerfen sich aber keinen Channel teilen, sonst
        // schlaegt .on() nach .subscribe() fehl.
        const channelId = `queue-${sessionId}-${Math.random().toString(36).slice(2)}`;
        return this.supabase
            .channel(channelId)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'session_queue',
                    filter: `session_id=eq.${this.formatSessionId(sessionId)}`
                },
                (payload) => {
                    callback(payload);
                }
            )
            .subscribe((status) => {
            });

    }
}