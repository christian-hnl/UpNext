import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { Database } from "../app/database.types";

@Injectable({
    providedIn: 'root',
})
export class SupabaseService {
    supabase: SupabaseClient<Database>;


    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }


    /**
     * erstellt eine neue privateSession mit uebergebenen title
     * @param titleEingabe
     * @param spotifyToken
     * @returns den erstellten eintrag
     */
    async addPrivateSession(titleEingabe: string, spotifyToken?: string | null) {
        const randSessionId = Math.floor(100000 + Math.random() * 900000);

        const qrUrl = window.location.origin + '/mode1/session-member/' + randSessionId;

        console.log("QR-Code Data: " + qrUrl)
        const { data, error } = await this.supabase
            .from('private_sessions').insert({
                session_id: randSessionId,
                title: titleEingabe,
                qrCodeData: qrUrl,
                status: "running",
                spotify_token: spotifyToken || null
            }).select();

        if (error) throw error;
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


    //getInfos
    async getPrivateSessionInfos(id: number) {
        const { data, error } = await this.supabase
            .from('private_sessions')
            .select('*')
            .eq('session_id', id)
            .maybeSingle();

        if (error) {
            throw error;
        }
        return data;
    }

    /**
     * erstellt einen neuen user, mit den uebergebenen parametern
     * @param username
     * @param sessionId
     * @param host
     * @returns die id des erstellten users
     */
    async addUser(username: string, sessionId: number, host: boolean) {
        let role: string = 'member';
        if (host) role = 'host';

        const { data, error } = await this.supabase
            .from('participants')
            .insert({
                name: username,
                role: role,
                session_id: sessionId
            }).select('id')
            .single();

        if (error) throw error;
        return data;
    }


    /**
     * sucht in der db nach dem user mit der uebergebenen id
     * @param id
     * @returns alle in der db gespeicherten infos des users
     */
    async getUserInfos(id: string) {
        const { data, error } = await this.supabase
            .from('participants')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            throw error;
        }
        return data;
    }

    /**
     * sucht nach allen namen der session mit der uebergebenen id
     * @param sessionId
     * @returns gibt alle namen der members dieser session zurueck
     */
    async getMemberNamesBySessionId(sessionId: number) {
        return this.supabase
            .from('participants')
            .select('name')
            .eq('session_id', sessionId)
            .eq('role', 'member');
    }

    /**
     * gibt den namen des hosts, dieser session zurueck
     * @param sessionId
     * @returns ein promise, in dem der name des hosts dieser session ist
     */
    async getHostNameBySessionId(sessionId: number) {
        const { data, error } = await this.supabase
            .from('participants')
            .select('name')
            .eq('session_id', sessionId)
            .eq('role', 'host')
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * prueft, ob wirklich dieser user der host der session ist, um brocken access control zu verhindern
     * @param userId
     * @param sessionId
     * @returns Ein Promise, das true zurückgibt, wenn der user host dieser Session ist, sonst false
     */
    async checkHost(userId: string, sessionId: number) {
        const { data, error } = await this.supabase
            .from('participants')
            .select('id')
            .eq('id', userId)
            .eq('session_id', sessionId)
            .eq('role', 'host')
            .maybeSingle();

        if (data) return true;
        if (error) throw error;
        return false;
    }

    /**
     * Prüft, ob die angegebene sessionId in der Datenbank existiert.
     * * @param sessionId - 6-stellige ID der Session
     * @returns Ein Promise, das true zurückgibt, wenn die Session existiert, sonst false
     */
    async checkIfSessionIsValid(sessionId: number): Promise<boolean> {
        const idString = sessionId.toString();
        if (idString.length !== 6 || (idString.charAt(0) !== '1' && idString.charAt(0) !== '2')) {
            return false;
        }

        const privateSession = await this.joinPrivateSession(sessionId);
        if (privateSession.data) return true;

        const publicSession = await this.joinPublicSession(sessionId);
        if (publicSession.data) return true;

        return false;
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
                session_id: sessionId,
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

        // Update session activity
        this.updateActivity(sessionId);

        // Automatisch den ersten Vote erstellen
        await this.vote(data.id, userId, 1, sessionId);

        return data;
    }

    async getQueue(sessionId: number) {
        return this.supabase
            .from('session_queue')
            .select(`
                *,
                songs (*)
            `)
            .eq('session_id', sessionId)
            .eq('status', 'queued')
            .order('score', { ascending: false })
            .limit(10);
    }

    async vote(queueId: number, participantId: string, value: number, sessionId?: number) {
        console.log(`[SupabaseService] vote called: queueId=${queueId}, participantId=${participantId}, value=${value}`);
        // Vote einfügen oder aktualisieren (Upsert)

        if (sessionId) {
            this.updateActivity(sessionId);
        }

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
            .eq('session_id', sessionId)
            .eq('spotify_id', spotifyId)
            .maybeSingle();

        if (error) return 0;
        return data?.score || 0;
    }

    subscribeToQueue(sessionId: number, callback: (payload: any) => void) {
        console.log(`[SupabaseService] Subscribing to queue for sessionId=${sessionId}`);
        const channelName = `queue-${sessionId}`;

        const existingChannel = this.supabase.getChannels().find(ch => ch.topic === `realtime:${channelName}`);
        if (existingChannel) {
            this.supabase.removeChannel(existingChannel);
        }

        return this.supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'session_queue',
                    filter: `session_id=eq.${sessionId}`
                },
                (payload) => {
                    console.log('[SupabaseService] Realtime update received for session_queue:', payload);
                    callback(payload);
                }
            )
            .subscribe((status) => {
                console.log(`[SupabaseService] Subscription status for ${channelName}:`, status);
            });
    }

    /**
     * Aktualisiert den last_active_at Timestamp einer Session
     */
    async updateActivity(sessionId: number) {
        const { error } = await this.supabase
            .from('private_sessions')
            .update({ last_active_at: new Date().toISOString() })
            .eq('session_id', sessionId);
            
        if (error) {
            console.warn('[SupabaseService] Error updating activity for private session:', error.message);
        }
        
        const { error: publicError } = await this.supabase
            .from('public_sessions')
            .update({ last_active_at: new Date().toISOString() })
            .eq('session_id', sessionId);
            
        if (publicError) {
            console.warn('[SupabaseService] Error updating activity for public session:', publicError.message);
        }
    }
}