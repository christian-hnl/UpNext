import {Component, inject, OnDestroy, OnInit} from "@angular/core";

import {debounceTime, distinctUntilChanged, Subscription} from "rxjs";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Spotify} from "../../../services/spotify";
import {SpotifyTrack} from "../../../services/spotify-response";

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
  searchControl = new FormControl('');
  private searchSubscription!: Subscription;
  searchTracks: SpotifyTrack[] = [];

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
    if (!term) return;

    console.log('Suche jetzt nach:', term);

    try {

      const result: any = await this.spotifyAPI.search(term);
      this.searchTracks = result.tracks.items;

      console.log(this.searchTracks);

    } catch (error) {
      console.error('Fehler bei der Spotify-Suche:', error);
    }
  }

  ngOnDestroy() {

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
