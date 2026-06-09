import {Component, inject, input, OnDestroy, OnInit, ChangeDetectorRef} from "@angular/core";
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
  cdr = inject(ChangeDetectorRef);

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
      console.log('[Search] Queue change detected via realtime subscription:', payload);
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
      this.cdr.detectChanges();
    } catch (error) {
      console.error('[Search] Fehler beim Aktualisieren der Suchergebnisse:', error);
    }
  }

  async performSearch(term: string | null) {
    if (!term) {
      this.searchTracks = [];
      this.cdr.detectChanges();
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
      this.cdr.detectChanges();

      console.log('[Search] Final search tracks with votes:', this.searchTracks);

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
    console.log('[Search] addToQueue called for track:', track.name);
    if (track.isQueued) return;
    
    // UI sofort aktualisieren für besseres Feedback
    track.isQueued = true;
    
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        track.isQueued = false;
        console.error('[Search] No userId found in localStorage');
        alert('Fehler: Du scheinst nicht richtig angemeldet zu sein. Bitte trete der Session neu bei.');
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
        track.queueId = newQueueItem.id;
        // Den Score direkt aus dem neu erstellten (und gevoteten) Item nehmen
        track.votes = newQueueItem.score;
        
        try {
          // Song zur echten Spotify-Wiedergabeschlange hinzufuegen (aktives Geraet des Hosts)
          await this.spotifyAPI.addToQueue(track.uri);
          console.log('Song zur Spotify-Warteschlange hinzugefügt:', track.name);
        } catch (spotifyError: any) {
          console.warn('[Search] Konnte Song nicht zur Spotify-Warteschlange hinzufügen (aber er ist in der Datenbank):', spotifyError);
          // Zeige Hinweis für den Fehler
          if (spotifyError.message && spotifyError.message.includes('Kein aktives Spotify-Gerät')) {
              alert('Song wurde zur Liste hinzugefügt! Hinweis: Spotify spielt momentan nicht (Kein aktives Gerät beim Host).');
          } else {
              alert(`Song in der Liste, aber Spotify Fehler: ${spotifyError.message || 'Unbekannter Spotify Fehler'}`);
          }
        }
      }

    } catch (error: any) {
      track.isQueued = false; // Nur Rückgängig machen, wenn Datenbank-Fehler auftritt
      console.error('Fehler beim Speichern in der Datenbank:', error);
      alert(error.message || 'Ein Datenbankfehler ist aufgetreten.');
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
    if (this.queueChannel) {
      this.supabaseService.supabase.removeChannel(this.queueChannel);
    }
  }
}