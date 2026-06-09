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

    try {
      const userId = await this.supabaseS.addUser(
          this.userName(),
          this.sessionId(),
          false
      );

      localStorage.setItem('userId', userId.id);

      const sessionIdStr = this.sessionId().toString();
      const isPrivateSession = sessionIdStr.charAt(0) === '1';
      const isPublicSession = sessionIdStr.charAt(0) === '2';

      if (isPrivateSession) {
        await this.router.navigate(['/mode1/session-member', this.sessionId()]);

      } else if (isPublicSession) {
        await this.router.navigate(['/mode2/session-member', this.sessionId()]);
      }

    } catch (error) {
      await this.router.navigate(["/404"]);
      return;
    }

    await this.router.navigate(["/404"]);
  }


}
