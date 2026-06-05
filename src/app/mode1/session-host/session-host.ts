import {Component, inject, input, OnInit, signal} from "@angular/core";
import {SupabaseService} from "../../../services/supabase-service";
import {Qrcode} from "../qrcode/qrcode";
import {Queuevoting} from "../queuevoting/queuevoting";
import {Spotify} from "../../../services/spotify";

@Component({
  selector: "app-session-member-host",
  imports: [
    Qrcode,
    Queuevoting
  ],
  templateUrl: "./session-host.html",
  styleUrl: "./session-host.scss",
})
export class SessionHost implements OnInit {

  sessionId = input.required<number>();
  private supabaseS = inject(SupabaseService);

  title = signal<string | undefined>(undefined);
  userName = signal<string | null | undefined>(undefined);
  members = signal<any[]>([]);
  qrcodedata = signal<string>("");
  devices = signal<any[]>([]);
  selectedDeviceId = signal<string | null>(null);
  private participantsChannel: any;

  ngOnInit() {
    this.loadSessionInfos().then();
    this.loadMyUserInfos().then();
    this.loadMembers().then();
    this.refreshHostToken().then();
    this.loadDevices().then();
    this.startQueueSync();
    this.setupParticipantsSubscription();
  }

  ngOnDestroy() {
    if (this.participantsChannel) {
      this.supabaseS.supabase.removeChannel(this.participantsChannel);
    }
  }

  setupParticipantsSubscription() {
    this.participantsChannel = this.supabaseS.supabase
      .channel(`participants-${this.sessionId()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'participants', filter: `session_id=eq.${this.sessionId()}` }, () => {
        console.log('[SessionHost] Participant change detected, refreshing...');
        this.loadMembers().then();
      })
      .subscribe();
  }

  private spotifyAPI = inject(Spotify);

  async setupSpotifyToken() {
    const { data, error } = await this.supabaseS.getPrivateSessionInfos(this.sessionId());
    if (data && (data as any).spotify_token) {
      try {
        const token = JSON.parse((data as any).spotify_token);
        if (token) {
          this.spotifyAPI.setAccessToken(token);
          console.log('[SessionMember] Spotify token set from session');
        }
      } catch (e) {
        console.error('[SessionMember] Error parsing spotify token:', e);
      }
    }
  }

  /**
   * Der Host aktualisiert regelmäßig sein Token in der DB, 
   * damit Mitglieder immer ein gültiges Token haben.
   */
  async refreshHostToken() {
    const tokenStr = localStorage.getItem('spotify-sdk:AuthorizationCodeWithPKCEStrategy:token');
    if (tokenStr) {
      console.log('[SessionHost] Updating spotify token in DB');
      await this.supabaseS.updateSessionToken(this.sessionId(), tokenStr);
    }
    // Alle 30 Minuten aktualisieren (Spotify Tokens halten ca 1h)
    setTimeout(() => this.refreshHostToken(), 30 * 60 * 1000);
  }

  async loadSessionInfos() {
    if (this.sessionId() === null) {
      return;
    }

    const { data, error } = await this.supabaseS.getPrivateSessionInfos(this.sessionId());

    if (error) {
      console.error('Error: ', error.message);
      return;
    }

    this.title.set(data?.title);
    this.qrcodedata.set(<string>data?.qrCodeData)
  }

  async loadMyUserInfos() {
    const userId = localStorage.getItem('userId');
    if (userId === null) return;

    const { data, error } = await this.supabaseS.getUserInfos(userId);
    this.userName.set(data?.name);
  }

  async loadMembers() {
    const {data, error} = await this.supabaseS.getParticipants(this.sessionId());

    if (error) {
      console.error('Error: ', error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.warn('no other members in this session');
      this.members.set([]);
      return;
    }

    this.members.set(data);
  }

  async blockParticipant(participantId: string) {
    if (confirm('Möchtest du diesen Teilnehmer wirklich sperren?')) {
      await this.supabaseS.updateParticipantStatus(participantId, 'blocked');
    }
  }

  async unblockParticipant(participantId: string) {
    await this.supabaseS.updateParticipantStatus(participantId, 'active');
  }

  async loadDevices() {
    const devices = await this.spotifyAPI.getAvailableDevices();
    this.devices.set(devices);
    const active = devices.find(d => d.is_active);
    if (active) {
      this.selectedDeviceId.set(active.id);
    }
  }

  async onDeviceChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const deviceId = target.value;
    if (deviceId) {
      try {
        await this.spotifyAPI.transferPlayback(deviceId);
        this.selectedDeviceId.set(deviceId);
        await this.supabaseS.updateActiveDevice(this.sessionId(), deviceId);
      } catch (e) {
        alert('Fehler beim Wechseln des Geräts.');
      }
    }
  }

  async endSession() {
    if (confirm('Möchtest du die Session wirklich beenden und löschen? Alle Teilnehmer werden entfernt.')) {
      await this.supabaseS.deleteSession(this.sessionId());
      alert('Session beendet.');
      window.location.href = '/';
    }
  }

  // DEBUG FUNKTIONEN
  async debugAddVote(queueId: number, value: number) {
    console.log(`[Host Debug] Adding ${value} votes to queueId ${queueId}`);
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    
    // Wir nutzen die normale Vote-Funktion, aber wir könnten auch eine "Super-Vote" Funktion bauen
    // Hier simulieren wir einfach einen Vote
    await this.supabaseS.vote(queueId, userId, value);
  }

  async debugRemoveSong(queueId: number) {
    if (!confirm('Song wirklich entfernen?')) return;
    console.log(`[Host Debug] Removing song ${queueId}`);
    await this.supabaseS.updateSessionStatus(this.sessionId(), 'queued'); // Dummy call to ensure types work
    
    // Wir setzen den Status direkt auf deleted
    const { error } = await (this.supabaseS as any).supabase
      .from('session_queue')
      .update({ status: 'deleted' })
      .eq('id', queueId);
      
    if (error) console.error('Fehler beim Löschen:', error);
  }

  /**
   * Synchronisiert die Spotify-Queue mit der App-Queue.
   * Spotify erlaubt kein direktes Sortieren der Queue, 
   * daher fügen wir Songs hinzu, wenn sie oben in der App-Queue stehen 
   * und noch nicht in der Spotify-Queue sind.
   */
  async syncQueues() {
    console.log('[SessionHost] Syncing queues...');
    try {
      const { data: appQueue } = await this.supabaseS.getQueue(this.sessionId());
      if (!appQueue) return;

      const playbackState = await this.spotifyAPI.getPlaybackState();
      const spotifyQueueData = await this.spotifyAPI.getQueue();
      
      if (!spotifyQueueData) return;

      const spotifyQueueUris = spotifyQueueData.queue.map((t: any) => t.uri);
      const currentlyPlayingUri = playbackState?.item?.uri;
      
      // 1. Automatisch gespielte Lieder löschen/markieren
      if (currentlyPlayingUri) {
        await this.supabaseS.markSongAsPlayed(this.sessionId(), currentlyPlayingUri);
      }

      const activeAppQueue = appQueue.filter(item => item.status === 'queued' || !item.status);
      if (activeAppQueue.length === 0) return;

      const deviceId = this.selectedDeviceId();

      // 2. Wir schauen uns die Top 5 der App-Queue an und fügen sie Spotify hinzu, falls sie fehlen
      for (const item of activeAppQueue.slice(0, 5)) {
        if (item.spotify_id && item.spotify_id !== currentlyPlayingUri && !spotifyQueueUris.includes(item.spotify_id)) {
          console.log('[SessionHost] Adding missing song to Spotify queue:', item.songs?.title);
          try {
            await this.spotifyAPI.addToQueue(item.spotify_id, deviceId);
          } catch (e) {
            console.error('[SessionHost] Error adding to Spotify queue during sync:', e);
          }
        }
      }
    } catch (e) {
      console.error('[SessionHost] Sync failed:', e);
    }
  }

  startQueueSync() {
    // Alle 10 Sekunden synchronisieren
    const syncInterval = setInterval(() => this.syncQueues(), 10000);
    
    // Aufräumen, wenn die Komponente zerstört wird (könnte man noch hinzufügen)
  }



}
