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
  isHost = input<boolean>(false);
  sessionId = input.required<number>();
  private supabaseS = inject(SupabaseService);
  private spotifyAPI = inject(Spotify);

  queue = signal<any[]>([]);
  nowPlaying = signal<any>(null);
  private refreshInterval: any;
  private queueChannel: any;
  private votesChannel: any;

  async ngOnInit() {
    await this.loadQueue();
    await this.loadNowPlaying();
    this.setupQueueSubscription();
    
    // Alle 5 Sekunden den aktuellen Song prüfen
    this.refreshInterval = setInterval(() => this.loadNowPlaying(), 5000);
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    if (this.queueChannel) {
      this.supabaseS.supabase.removeChannel(this.queueChannel);
    }
    if (this.votesChannel) {
      this.supabaseS.supabase.removeChannel(this.votesChannel);
    }
  }

  async loadNowPlaying() {
    const track = await this.spotifyAPI.getCurrentlyPlaying();
    if (track && track.item) {
      this.nowPlaying.set(track.item);
    } else {
      this.nowPlaying.set(null);
    }
  }

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  async loadQueue() {
    console.log('[Queuevoting] loadQueue called for sessionId:', this.sessionId());
    const { data, error } = await this.supabaseS.getQueue(this.sessionId());
    if (error) {
      console.error('[Queuevoting] Error loading queue:', error.message);
      return;
    }
    console.log('[Queuevoting] Queue loaded:', data);
    
    // Nur Songs anzeigen, die noch nicht gespielt wurden
    const activeQueue = (data || []).filter((item: any) => item.status !== 'played' && item.status !== 'deleted');
    this.queue.set(activeQueue);
  }

  setupQueueSubscription() {
    if (this.queueChannel) return; // Verhindert doppelte Subscriptions

    console.log('[Queuevoting] Setting up queue subscription');
    this.queueChannel = this.supabaseS.subscribeToQueue(this.sessionId(), (payload) => {
      console.log('[Queuevoting] Realtime update triggered refresh');
      this.loadQueue();
    });

    // ZUSÄTZLICH: Subscription für Votes
    this.votesChannel = this.supabaseS.supabase
      .channel(`votes-${this.sessionId()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, () => {
        console.log('[Queuevoting] Vote change detected, refreshing queue...');
        this.loadQueue();
      })
      .subscribe();
  }

  async upvote(queueId: number) {
    console.log('[Queuevoting] upvote called for queueId:', queueId);
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('[Queuevoting] No userId found for upvote');
      return;
    }
    await this.supabaseS.vote(queueId, userId, 1);
    // Wir laden die Queue hier auch manuell, falls Realtime mal hakt, 
    // aber eigentlich sollte subscribeToQueue das erledigen.
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

  async removeSong(queueId: number) {
    if (confirm('Soll dieser Song wirklich aus der Warteschlange entfernt werden?')) {
      const { error } = await this.supabaseS.supabase
        .from('session_queue')
        .update({ status: 'deleted' })
        .eq('id', queueId);
      
      if (error) {
        console.error('[Queuevoting] Error removing song:', error);
      } else {
        await this.loadQueue();
      }
    }
  }
}
