import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {Search} from "./search/search";

@Component({
  selector: 'app-mode1',
  imports: [
    RouterLink,
    RouterLinkActive,
    Search
  ],
  templateUrl: './mode1.html',
  styleUrl: './mode1.scss',
})
export class Mode1 {

}
