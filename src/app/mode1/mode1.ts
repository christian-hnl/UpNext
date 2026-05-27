import {Component, inject, signal} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {Search} from "./search/search";
import {FormsModule} from "@angular/forms";
import {SupabaseService} from "../../services/supabase-service";

@Component({
  selector: 'app-mode1',
  imports: [
    RouterLink,
    RouterLinkActive,
    Search,
    FormsModule
  ],
  templateUrl: './mode1.html',
  styleUrl: './mode1.scss',
})
export class Mode1 {
  sessionId = signal("");
  private supabaseService = inject(SupabaseService);

  private router = inject(Router);


  async checkSession(id: string) {
    if (!id || id.trim() === '') {
      console.warn('Bitte gib eine gültige Session-ID ein.');
      return;
    }

    try {
      const { data, error } = await this.supabaseService.joinSession(id);

      if (error) {
        console.error('Error: ', error.message);
        return;
      }

      if (!data || data.length === 0) {
        console.warn('Keine Session mit dieser ID gefunden.');
        this.sessionId.set("");
      } else {
        console.log('erfolgreich beigetreten');
        await this.router.navigate(['/mode1/session', id]);
      }

    } catch (err) {
      console.error('Error: ', err);
    }
  }

}
