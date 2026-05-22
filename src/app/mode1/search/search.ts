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
    // 2. Auf Änderungen des Inputs "lauschen"
    this.searchSubscription = this.searchControl.valueChanges
        .pipe(
            debounceTime(300),        // Wartet 300ms nach dem letzten Tastendruck
            distinctUntilChanged()    // Sucht nur, wenn sich der Text wirklich geändert hat
        )
        .subscribe((searchTerm) => {
          // Diese Funktion wird erst gefeuert, wenn 300ms nicht getippt wurde
          this.performSearch(searchTerm);
        });
  }

  performSearch(term: string | null) {
    if (!term) return;

    console.log('Suche jetzt nach:', term);
    console.log(this.spotifyAPI.search(term))
  }

  ngOnDestroy() {
    // Wichtig: Subscription beenden, um Memory Leaks zu vermeiden
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
