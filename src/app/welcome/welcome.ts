import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-welcome',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss',
})
export class Welcome {

}