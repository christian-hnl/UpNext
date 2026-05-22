import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-error',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './error.html',
  styleUrl: './error.scss',
})
export class Error {}
