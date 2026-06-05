import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {JoinSession} from "../join-session/join-session";

@Component({
  selector: 'app-welcome',
  imports: [
    RouterLink,
    RouterLinkActive,
    FormsModule,
    JoinSession
  ],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss',
})
export class Welcome {}

