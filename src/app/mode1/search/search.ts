import {Component, inject, OnDestroy, OnInit} from "@angular/core";

import {debounceTime, distinctUntilChanged, Subscription} from "rxjs";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Spotify} from "../../../services/spotify";

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

  performSearch(term: string | null) {
    if (!term) return;

    console.log('Suche jetzt nach:', term);
    console.log(this.spotifyAPI.search(term))
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
