import {Component, inject, input, OnDestroy, OnInit, signal} from "@angular/core";
import {SupabaseService} from "../../../services/supabase-service";
import {Spotify} from "../../../services/spotify";
import {DurationPipe} from "../../shared/duration.pipe";

@Component({
  selector: "app-queuevoting",
  imports: [DurationPipe],
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

    // Live-Sync: Spotify sendet keine Webhooks, daher pollen wir regelmaessig.
    // Das haelt die Queue fuer ALLE aktuell (nicht nur beim Reload) und entfernt
    // beim Host automatisch bereits gespielte Songs.
    this.playbackInterval = setInterval(() => this.refresh(), 4000);
  }

  private async refresh() {
    await this.loadCurrentlyPlaying();
    await this.loadQueue();
  }

  async loadCurrentlyPlaying() {
    try {
      const result = await this.spotifyAPI.getCurrentlyPlaying();
      const track = result && result.item ? result.item : null;
      this.currentlyPlaying.set(track);

      // Sobald ein Song aus der Queue laeuft, gilt er als gespielt -> entfernen (nur Host).
      if (track) {
        await this.removePlayedSong(track.uri);
      }
    } catch (e) {
      console.error('[Queuevoting] Fehler beim Laden des aktuellen Tracks:', e);
    }
  }

  /** Host-only: entfernt den gerade laufenden Song aus der Warteschlange. */
  private async removePlayedSong(currentUri: string) {
    if (!this.isHost() || !currentUri) return;

    const playing = this.queue().find(item => item.spotify_id === currentUri);
    if (!playing) return;

    const { error } = await this.supabaseS.removeSongFromQueue(playing.id);
    if (error) {
      console.error('[Queuevoting] Fehler beim Entfernen des gespielten Songs:', error.message);
      return;
    }
    await this.loadQueue();
  }

  async loadQueue() {
    const { data, error } = await this.supabaseS.getQueue(this.sessionId());
    if (error) {
      console.error('[Queuevoting] Error loading queue:', error.message);
      return;
    }
    this.queue.set(data || []);
  }

  setupQueueSubscription() {
    this.queueChannel = this.supabaseS.subscribeToQueue(this.sessionId(), (payload) => {
      
      // Bei JEDEM Event die Queue neu laden, um die UI aktuell zu halten
      this.loadQueue();
    });
  }

  async upvote(queueId: number) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('[Queuevoting] No userId found for upvote');
      return;
    }
    await this.supabaseS.vote(queueId, userId, 1);
    await this.loadQueue();
  }

  async downvote(queueId: number) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('[Queuevoting] No userId found for downvote');
      return;
    }
    await this.supabaseS.vote(queueId, userId, -1);
    await this.loadQueue();
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
