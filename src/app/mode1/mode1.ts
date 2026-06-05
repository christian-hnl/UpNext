import {Component, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {SupabaseService} from "../../services/supabase-service";
import {Host} from "./host/host";

@Component({
  selector: 'app-mode1',
  imports: [
    FormsModule,
    Host
  ],
  templateUrl: './mode1.html',
  styleUrl: './mode1.scss',
})
export class Mode1 {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  sessionId = signal<number | null>(null);
  userName = signal("");

  async checkSession() {
    const sId = this.sessionId();

    if (sId === null) {
      console.warn('Enter session-id.');
      return;
    }

    if (!this.userName().trim()) {
      console.warn('Enter your name.');
      return;
    }

    try {
      const { data, error } = await this.supabaseService.joinPrivateSession(sId);

      if (error) {
        console.error('Error: ', error.message);
        return;
      }

      if (!data) {
        console.warn('Keine session mit dieser ID gefunden.');
      } else {
        const {
          data: userData,
          error: userError
        } = await this.supabaseService.addUser(this.userName(), <number>this.sessionId(), false);

        if (userError) {
          console.error('Fehler beim Erstellen des Users: ', userError.message);
          return;
        }

        if (userData) {
          console.log('erfolgreich beigetreten. User ID:', userData.id);

          localStorage.setItem('userId', userData.id.toString());

          await this.router.navigate(['/mode1/session-member', this.sessionId()]);
        }
      }

    } catch (err) {
      console.error('Error: ', err);
    }
  }



}
