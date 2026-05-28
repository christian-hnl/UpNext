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

  sessionId = signal<number>(0);
  userName = signal("");

  async checkSession(id: number) {
    try {
      const { data, error } = await this.supabaseService.joinSession(id);

      if (error) {
        console.error('Error: ', error.message);
        return;
      }

      if (!data) {
        console.warn('Keine Session mit dieser ID gefunden.');
      } else {
        const {
          data: userData,
          error: userError
        } = await this.supabaseService.addUser(this.userName(), this.sessionId());

        if (userError) {
          console.error('Fehler beim Erstellen des Users: ', userError.message);
          return;
        }

        if (userData) {
          console.log('erfolgreich beigetreten. User ID:', userData.id);

          localStorage.setItem('userId', userData.id.toString());

          await this.router.navigate(['/mode1/session', id]);
        }
      }

    } catch (err) {
      console.error('Error: ', err);
    }
  }



}
