import {Component, inject, input, OnDestroy, OnInit, signal} from "@angular/core";
import {SupabaseService} from "../../../services/supabase-service";
import {Spotify} from "../../../services/spotify";

@Component({
  selector: "app-queuevoting",
  imports: [],
  templateUrl: "./queuevoting.html",
  styleUrl: "./queuevoting.scss",
})
export class Queuevoting implements OnInit, OnDestroy {
  sessionId = input.required<number>();
  isHost = input<boolean>(false);
  private supabaseS = inject(SupabaseService);
  private spotifyAPI = inject(Spotify);

  queue = signal<any[]>([]);
  currentlyPlaying = signal<any>(null);
  private playbackInterval: any;
  private queueChannel: any;

  async ngOnInit() {
    await this.loadQueue();
    await this.loadCurrentlyPlaying();
    this.setupQueueSubscription();
    
    // Playback alle 5 Sekunden prüfen (da Spotify keine Webhooks für Playback-Events sendet)
    this.playbackInterval = setInterval(() => this.loadCurrentlyPlaying(), 5000);
  }

  async loadCurrentlyPlaying() {
    try {
      const result = await this.spotifyAPI.getCurrentlyPlaying();
      if (result && result.item) {
        this.currentlyPlaying.set(result.item);
        
        // Host-Logik: Prüfen, ob der spielende Song aus der Queue kommt und ihn "abhaken"
        if (this.isHost()) {
            const currentQ = this.queue();
            const playingId = result.item.uri;
            
            const itemInQueue = currentQ.find(item => item.spotify_id === playingId);
            if (itemInQueue) {
                console.log('[Queuevoting] Host: Currently playing song ist in der Queue. Markiere als gespielt.', itemInQueue.id);
                await this.supabaseS.markSongAsPlayed(itemInQueue.id);
            }
        }
      } else {
        this.currentlyPlaying.set(null);
      }
    } catch (e) {
      console.error('[Queuevoting] Fehler beim Laden des aktuellen Tracks:', e);
    }
  }

  async loadQueue() {
    console.log('[Queuevoting] loadQueue called for sessionId:', this.sessionId());
    const { data, error } = await this.supabaseS.getQueue(this.sessionId());
    if (error) {
      console.error('[Queuevoting] Error loading queue:', error.message);
      return;
    }
    console.log('[Queuevoting] Queue loaded:', data);
    this.queue.set(data || []);
  }

  setupQueueSubscription() {
    console.log('[Queuevoting] Setting up queue subscription');
    this.queueChannel = this.supabaseS.subscribeToQueue(this.sessionId(), (payload) => {
      console.log('[Queuevoting] Queue change detected via realtime subscription. Payload:', payload);
      
      // Bei JEDEM Event die Queue neu laden, um die UI aktuell zu halten
      this.loadQueue();
    });
  }

  async upvote(queueId: number) {
    console.log('[Queuevoting] upvote called for queueId:', queueId);
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('[Queuevoting] No userId found for upvote');
      return;
    }
    await this.supabaseS.vote(queueId, userId, 1);
    await this.loadQueue();
  }

  async downvote(queueId: number) {
    console.log('[Queuevoting] downvote called for queueId:', queueId);
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('[Queuevoting] No userId found for downvote');
      return;
    }
    await this.supabaseS.vote(queueId, userId, -1);
    await this.loadQueue();
  }

  formatDuration(ms: number | undefined): string {
    if (!ms) return '0:00';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  ngOnDestroy() {
    if (this.playbackInterval) {
      clearInterval(this.playbackInterval);
    }
    if (this.queueChannel) {
      this.supabaseS.supabase.removeChannel(this.queueChannel);
    }
  }
}
