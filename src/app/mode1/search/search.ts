import {Component, inject, input, OnDestroy, OnInit} from "@angular/core";
import {debounceTime, distinctUntilChanged, Subscription} from "rxjs";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Spotify} from "../../../services/spotify";
import {SupabaseService} from "../../../services/supabase-service";
import {DurationPipe} from "../../shared/duration.pipe";
import {NotificationService} from "../../shared/notification.service";

@Component({
  selector: "app-search",
  imports: [
    ReactiveFormsModule,
    DurationPipe
  ],
  templateUrl: "./search.html",
  styleUrl: "./search.scss",
})
export class Search implements OnInit, OnDestroy{
  spotifyAPI = inject(Spotify)
  supabaseService = inject(SupabaseService);
  private notifications = inject(NotificationService);

  sessionId = input.required<number>();

  searchControl = new FormControl('');
  private searchSubscription!: Subscription;
  private queueChannel: any;
  searchTracks: any[] = [];

  ngOnInit() {
    this.searchSubscription = this.searchControl.valueChanges
        .pipe(
            debounceTime(300),
            distinctUntilChanged()
        )
        .subscribe((searchTerm) => {
          this.performSearch(searchTerm);
        });

    this.setupQueueSubscription();
  }

  setupQueueSubscription() {
    this.queueChannel = this.supabaseService.subscribeToQueue(this.sessionId(), (payload) => {
      this.updateSearchTracksFromQueue();
    });
  }

  async updateSearchTracksFromQueue() {
    if (this.searchTracks.length === 0) return;

    try {
      const { data: currentQueue } = await this.supabaseService.getQueue(this.sessionId());
      const queuedIdsMap = new Map(currentQueue?.map(item => [item.spotify_id, item]) || []);

      this.searchTracks = this.searchTracks.map(track => {
        const queueItem = queuedIdsMap.get(track.uri);
        return {
          ...track,
          votes: queueItem?.score || 0,
          isQueued: !!queueItem,
          queueId: queueItem?.id
        };
      });
    } catch (error) {
      console.error('[Search] Fehler beim Aktualisieren der Suchergebnisse:', error);
    }
  }

  async performSearch(term: string | null) {
    if (!term) {
      this.searchTracks = [];
      return;
    }


    try {
      const result: any = await this.spotifyAPI.search(term);
      const tracks = result.tracks.items;


      const { data: currentQueue } = await this.supabaseService.getQueue(this.sessionId());
      const queuedIds = new Set(currentQueue?.map(item => item.spotify_id) || []);

      const tracksWithVotes = await Promise.all(tracks.map(async (track: any) => {
        const votes = await this.supabaseService.getSongVotes(this.sessionId(), track.uri);
        const isQueued = queuedIds.has(track.uri);
        
        const queueItem = currentQueue?.find(item => item.spotify_id === track.uri);
        
        return { ...track, votes, isQueued, queueId: queueItem?.id };
      }));
      
      this.searchTracks = tracksWithVotes;


    } catch (error) {
      console.error('Fehler bei der Spotify-Suche:', error);
    }
  }

  async upvote(track: any) {
    const queueId = track.queueId;
    if (!queueId) return;
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const updatedQueueItem = await this.supabaseService.vote(queueId, userId, 1);
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
    const queueId = track.queueId;
    if (!queueId) return;
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const updatedQueueItem = await this.supabaseService.vote(queueId, userId, -1);
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
    if (track.isQueued) return;
    
    // UI sofort aktualisieren für besseres Feedback
    track.isQueued = true;
    
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        track.isQueued = false;
        console.error('[Search] No userId found in localStorage');
        return;
      }

      const newQueueItem: any = await this.supabaseService.addSongToQueue(
          this.sessionId(),
          {
            spotify_id: track.uri,
            title: track.name,
            artist: track.artists?.[0]?.name || 'Unbekannter Künstler',
            album_image: track.album?.images?.[2]?.url,
            duration_ms: track.duration_ms
          },
          userId
      );

      if (newQueueItem) {
        // Song zur echten Spotify-Wiedergabeschlange hinzufuegen (aktives Geraet des Hosts)
        await this.spotifyAPI.addToQueue(track.uri);

        track.queueId = newQueueItem.id;
        // Den Score direkt aus dem neu erstellten (und gevoteten) Item nehmen
        track.votes = newQueueItem.score;
      }

    } catch (error: any) {
      track.isQueued = false; // Rückgängig machen bei Fehler
      console.error('Fehler beim Hinzufügen zur Warteschlange:', error);
      this.notifications.error(error.message || 'Fehler beim Hinzufügen zur Warteschlange');
    }
  }

  ngOnDestroy() {

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.queueChannel) {
      this.supabaseService.supabase.removeChannel(this.queueChannel);
    }
  }
}