import {Component, inject, signal} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-welcome',
  imports: [
    RouterLink,
    RouterLinkActive,
    FormsModule
  ],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss',
})
export class Welcome {
  private router = inject(Router);
  sessionId = signal<number | null>(null);


  async checkSession() {
    const sId = this.sessionId();

    if (!sId) {
      console.warn('Bitte eine Session-ID eingeben.');
      return;
    }

    await this.router.navigate(['/set-name', sId]);
  }
}