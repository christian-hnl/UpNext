import {Component, inject, input, signal} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SupabaseService} from "../../../services/supabase-service";
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
  private router = inject(Router);

  errorMess = signal<string | null>(null);


  async createUserAndJoinSession() {
    this.errorMess.set(null);

    if (!this.userName() || this.userName().trim().length === 0) {
      this.errorMess.set("Gib einen Namen ein.")
      this.userName.set("");
      return;
    }

    const { data: userData, error: userError } = await this.supabaseS.addUser(
        this.userName(),
        this.sessionId(),
        false
    );

    if (userError || !userData) {
      console.error("Fehler beim Erstellen des Users:", userError);
      await this.router.navigate(["/404"]);
      return;
    }

    const userId = userData.id;
    localStorage.setItem('userId', userId);

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
      console.warn('Keine gültige Session-ID. Weder 1 noch 2 am Anfang.');
      await this.router.navigate(["/404"]);
      return;
    }

    if (joinError) {
      console.error("Fehler beim Beitreten der Session:", joinError);
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
