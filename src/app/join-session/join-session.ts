import {Component, inject, signal} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {SupabaseService} from "../../services/supabase-service";

@Component({
  selector: "app-join-session",
    imports: [
        FormsModule
    ],
  templateUrl: "./join-session.html",
  styleUrl: "./join-session.scss",
})
export class JoinSession {
  private router = inject(Router);
  private supabaseS = inject(SupabaseService);

  sessionId = signal<number | null>(null);

  errorMess = signal<string | null>(null);


  async checkSessionAndNavigateToSetName() {
    //check ob session-id is valid
    this.errorMess.set(null);

    const sId = this.sessionId();
    if (!sId) {
      this.errorMess.set("Gib eine Session-ID ein.")
      return;
    }

    if (await this.supabaseS.checkIfSessionIsValid(sId)) {
      await this.router.navigate(['/set-name', sId]);
    } else {
      this.errorMess.set("Keine gültige Session-ID.")
    }
  }


}
