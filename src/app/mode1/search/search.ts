import {Component, inject, OnDestroy, OnInit, signal} from "@angular/core";
import {debounceTime, distinctUntilChanged, Subscription} from "rxjs";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Spotify} from "../../../services/spotify";
import {Track} from "@spotify/web-api-ts-sdk";
import {CommonModule} from "@angular/common";

@Component({
  selector: "app-search",
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: "./search.html",
  styleUrl: "./search.scss",
})
export class Search implements OnInit, OnDestroy{
  spotifyAPI = inject(Spotify)
  searchControl = new FormControl('');
  private searchSubscription!: Subscription;
  searchResults = signal<Track[]>([]);


  ngOnInit() {
    this.searchSubscription = this.searchControl.valueChanges
        .pipe(
            debounceTime(300),
            distinctUntilChanged()
        )
        .subscribe((searchTerm) => {
          this.performSearch(searchTerm);
        });
  }

  async performSearch(term: string | null) {
    if (!term) {
      this.searchResults.set([]);
      return
    }
    const result = await this.spotifyAPI.search(term);
    this.searchResults.set(result.tracks.items);
  }

  ngOnDestroy() {

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}