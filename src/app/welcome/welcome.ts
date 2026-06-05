import {Component, inject, signal} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {SupabaseService} from "../../services/supabase-service";

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
  private supabaseS = inject(SupabaseService);

  sessionId = signal<number | null>(null);


  async checkSessionAndNavigateToSetName() {
    const sId = this.sessionId();
    if (!sId) {
      console.warn('Bitte eine Session-ID eingeben.');
      return;
    }

    if (await this.supabaseS.checkIfSessionIsValid(sId)) {
      await this.router.navigate(['/set-name', sId]);
    }
  }


}