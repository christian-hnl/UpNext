import {Component, inject, signal} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {SupabaseService} from "../../services/supabase-service";

@Component({
  selector: 'app-mode1',
  imports: [
    RouterLink,
    RouterLinkActive,
    FormsModule
  ],
  templateUrl: './mode1.html',
  styleUrl: './mode1.scss',
})
export class Mode1 {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  sessionId = signal("");


  async checkSession(id: string) {
    try {
      const { data, error } = await this.supabaseService.joinSession(id);

      if (error) {
        console.error('Error: ', error.message);
        return;
      }

      if (!data) {
        console.warn('Keine Session mit dieser ID gefunden.');
      } else {
        console.log('erfolgreich beigetreten');
        await this.router.navigate(['/mode1/session', id]);
      }

    } catch (err) {
      console.error('Error: ', err);
    }
  }



}
