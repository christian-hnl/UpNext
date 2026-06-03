import {Component, inject, signal} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {SupabaseService} from "../../services/supabase-service";
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
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  sessionId = signal<number | null>(null);
  userName = signal("");



  async checkSession() {
    try {
      const sId = this.sessionId();
      if (sId === null) {
        console.warn('enter session-id');
        return;
      }

      let data;
      let error;
      let privatSession = true;
      if (sId.toString().charAt(0) === '1') {
        ({ data, error } = await this.supabaseService.joinPrivateSession(sId));

      } else if (sId.toString().charAt(0) === '2') {
        ({ data, error } = await this.supabaseService.joinPublicSession(sId));

      } else {
        console.warn('no valid session-id.');
      }


      if (error) {
        console.error('Error: ', error.message);
        return;
      }

      if (!data) {
        console.warn('Keine session mit dieser ID gefunden.');
      } else {
        const { data: userData, error: userError } = await this.supabaseService.addUser(this.userName(), <number>this.sessionId(), false);

        if (userError) {
          console.error('Fehler beim Erstellen des Users: ', userError.message);
          return;
        }

        if (userData) {
          console.log('erfolgreich beigetreten. User ID:', userData.id);

          localStorage.setItem('userId', userData.id.toString());

          if (privatSession) {
            await this.router.navigate(['/mode1/session-member', sId]);
          } else {
            await this.router.navigate(['/mode2/session-member', sId]);
          }
        }
      }

    } catch (err) {
      console.error('Error: ', err);
    }
  }


}