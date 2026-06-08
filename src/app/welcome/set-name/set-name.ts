import {Component, inject, input, signal} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SupabaseService} from "../../../services/supabase-service";
import {NotificationService} from "../../shared/notification.service";
import {Router} from "@angular/router";

@Component({
  selector: "app-set-name",
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: "./set-name.html",
  styleUrl: "./set-name.scss",
})
export class SetName {
  userName = signal("");

  sessionId = input.required<number>();
  private supabaseS = inject(SupabaseService);
  private notifications = inject(NotificationService);
  private router = inject(Router);


  async createUserAndJoinSession() {
    if (!this.userName().trim()) {
      this.notifications.error('Bitte gib deinen Namen ein.');
      return;
    }

    const { data: userData, error: userError } = await this.supabaseS.addUser(
        this.userName(),
        this.sessionId(),
        false
    );

    if (userError || !userData) {
      this.notifications.error('Konnte dich der Session nicht hinzufügen.');
      await this.router.navigate(["/404"]);
      return;
    }

    const userId = userData.id;
    localStorage.setItem('userId', userId);

    // Session-Typ anhand der ersten Ziffer bestimmen (1 = privat, 2 = öffentlich)
    const sessionIdStr = this.sessionId().toString();
    const isPrivateSession = sessionIdStr.charAt(0) === '1';
    const isPublicSession = sessionIdStr.charAt(0) === '2';

    let joinError = null;

    if (isPrivateSession) {
      const { error } = await this.supabaseS.joinPrivateSession(this.sessionId());
      joinError = error;
    } else if (isPublicSession) {
      const { error } = await this.supabaseS.joinPublicSession(this.sessionId());
      joinError = error;
    } else {
      this.notifications.error('Ungültige Session-ID.');
      await this.router.navigate(["/404"]);
      return;
    }

    if (joinError) {
      this.notifications.error('Beitritt fehlgeschlagen. Bitte versuche es erneut.');
      await this.router.navigate(["/404"]);
      return;
    }

    if (isPrivateSession) {
      await this.router.navigate(['/mode1/session-member', this.sessionId()]);
    } else if (isPublicSession) {
      await this.router.navigate(['/mode2/session-member', this.sessionId()]);
    }
  }
}
