import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Host} from "./host/host";
import {JoinSession} from "../join-session/join-session";

@Component({
  selector: 'app-mode1',
  imports: [
    FormsModule,
    Host,
    JoinSession
  ],
  templateUrl: './mode1.html',
  styleUrl: './mode1.scss',
})
export class Mode1 {}
