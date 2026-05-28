import {Component, inject, input, OnInit, signal} from '@angular/core';
import {SupabaseService} from "../../../services/supabase-service";

@Component({
  selector: 'app-session',
  imports: [
  ],
  templateUrl: './session.html',
  styleUrl: './session.scss',
})
export class Session implements OnInit {
  private supabaseS = inject(SupabaseService);

  sessionId = input.required<number>();
  title = signal<string | null | undefined>("");
  userName = signal<string | null | undefined>("");

  async ngOnInit() {
    await this.loadSessionInfos();
    await this.loadUserInfos();
  }



  async loadSessionInfos() {
    if (this.sessionId() === null) {
      return;
    }

    const { data, error } = await this.supabaseS.getSessionInfos(this.sessionId());

    if (error) {
      console.error('Error: ', error.message);
      return;
    }

    this.title.set(data?.title);
  }

  async loadUserInfos() {
    const userId = localStorage.getItem('userId');
    if (userId === null) return;

    const { data, error } = await this.supabaseS.getUserInfos(userId);
    this.userName.set(data?.name);
  }


}
