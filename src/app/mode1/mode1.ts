import {Component, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {SupabaseService} from "../../services/supabase-service";
import {NotificationService} from "../shared/notification.service";
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
  private notifications = inject(NotificationService);
  private router = inject(Router);

  sessionId = signal<number | null>(null);
  userName = signal("");

  async checkSession() {
    const sId = this.sessionId();

    if (sId === null) {
      this.notifications.error('Bitte gib eine Session-ID ein.');
      return;
    }

    if (!this.userName().trim()) {
      this.notifications.error('Bitte gib deinen Namen ein.');
      return;
    }

    try {
      const { data, error } = await this.supabaseService.joinPrivateSession(sId);

      if (error) {
        this.notifications.error('Beitritt fehlgeschlagen. Bitte versuche es erneut.');
        return;
      }

      if (!data) {
        this.notifications.error('Keine Session mit dieser ID gefunden.');
        return;
      }

      const { data: userData, error: userError } =
        await this.supabaseService.addUser(this.userName(), sId, false);

      if (userError || !userData) {
        this.notifications.error('Beitritt fehlgeschlagen. Bitte versuche es erneut.');
        return;
      }

      localStorage.setItem('userId', userData.id.toString());
      await this.router.navigate(['/mode1/session-member', sId]);
    } catch (err) {
      console.error('[Mode1] join failed:', err);
      this.notifications.error('Beitritt fehlgeschlagen. Bitte versuche es erneut.');
    }
  }
}
