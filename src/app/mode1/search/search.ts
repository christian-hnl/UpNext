import {Component, inject, input, OnDestroy, OnInit} from "@angular/core";
import {debounceTime, distinctUntilChanged, Subscription} from "rxjs";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Spotify} from "../../../services/spotify";
import {SupabaseService} from "../../../services/supabase-service";

@Component({
  selector: "app-search",
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: "./search.html",
  styleUrl: "./search.scss",
})
export class Search implements OnInit, OnDestroy{
  spotifyAPI = inject(Spotify)
  supabaseService = inject(SupabaseService);

  sessionId = input.required<number>();

  searchControl = new FormControl('');
  private searchSubscription!: Subscription;
  searchTracks: any[] = [];

  ngOnInit() {
    this.searchSubscription = this.searchControl.valueChanges
        .pipe(
            debounceTime(500),
            distinctUntilChanged()
        )
        .subscribe((searchTerm) => {
          this.performSearch(searchTerm);
        });
  }

  async performSearch(term: string | null) {
    if (!term) {
      this.searchTracks = [];
      return;
    }

    console.log('[Search] performSearch called with term:', term);

    try {
      const result: any = await this.spotifyAPI.search(term);
      const tracks = result.tracks.items;

      console.log('[Search] Spotify search results:', tracks);

      const { data: currentQueue } = await this.supabaseService.getQueue(this.sessionId());
      const queuedIds = new Set(currentQueue?.map(item => item.spotify_id) || []);

      const tracksWithVotes = await Promise.all(tracks.map(async (track: any) => {
        const votes = await this.supabaseService.getSongVotes(this.sessionId(), track.uri);
        const isQueued = queuedIds.has(track.uri);
        
        const queueItem = currentQueue?.find(item => item.spotify_id === track.uri);
        
        return { ...track, votes, isQueued, queueId: queueItem?.id };
      }));
      
      this.searchTracks = tracksWithVotes;

      console.log('[Search] Final search tracks with votes:', this.searchTracks);

    } catch (error) {
      console.error('Fehler bei der Spotify-Suche:', error);
    }
  }

  async upvote(track: any) {
    if (!track.queueId) return;
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const updatedQueueItem = await this.supabaseService.vote(track.queueId, userId, 1);
      if (updatedQueueItem) {
        track.votes = updatedQueueItem.score;
      } else {
        track.votes = await this.supabaseService.getSongVotes(this.sessionId(), track.uri);
      }
    } catch (error) {
      console.error('Fehler beim Upvoten:', error);
    }
  }

  async downvote(track: any) {
    if (!track.queueId) return;
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const updatedQueueItem = await this.supabaseService.vote(track.queueId, userId, -1);
      if (updatedQueueItem) {
        track.votes = updatedQueueItem.score;
      } else {
        track.votes = await this.supabaseService.getSongVotes(this.sessionId(), track.uri);
      }
    } catch (error) {
      console.error('Fehler beim Downvoten:', error);
    }
  }

  async addToQueue(track: any) {
    console.log('[Search] addToQueue called for track:', track.name);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('[Search] No userId found in localStorage');
        return;
      }

      await this.spotifyAPI.addToQueue(track.uri);

      const newQueueItem = await this.supabaseService.addSongToQueue(
          this.sessionId(),
          {
            spotify_id: track.uri,
            title: track.name,
            artist: track.artists?.[0]?.name || 'Unbekannter Künstler'
          },
          userId
      );

      if (newQueueItem) {
        track.isQueued = true;
        track.queueId = newQueueItem.id;
        // Den Score direkt aus dem neu erstellten (und gevoteten) Item nehmen
        track.votes = newQueueItem.score;
      }

      console.log('Song zur Warteschlange hinzugefügt:', track.name);
    } catch (error) {
      console.error('Fehler beim Hinzufügen zur Warteschlange:', error);
    }
  }

  formatDuration(ms: number | undefined): string {
    if (!ms) return '0:00';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  ngOnDestroy() {

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}