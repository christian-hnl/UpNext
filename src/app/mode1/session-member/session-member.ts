import {Component, inject, input, OnInit, signal} from '@angular/core';
import {SupabaseService} from "../../../services/supabase-service";
import {Search} from "../search/search";
import {Queuevoting} from "../queuevoting/queuevoting";

@Component({
  selector: 'app-session-member',
    imports: [
        Search,
        Queuevoting
    ],
  templateUrl: './sessionMember.html',
  styleUrl: './sessionMember.scss',
})
export class SessionMember implements OnInit {
  private supabaseS = inject(SupabaseService);

  sessionId = input.required<number>();
  title = signal<string | null | undefined>("");
  userName = signal<string | null | undefined>("");
  otherMembers = signal<string[]>([]);
  hostName = signal<string | null>(null);

  async ngOnInit() {
    await this.loadSessionInfos();
    await this.loadMyUserInfos();
    await this.loadOtherMembers();
    await this.loadHostName();
  }



  async loadSessionInfos() {
    if (this.sessionId() === null) {
      return;
    }

    const { data, error } = await this.supabaseS.getPrivateSessionInfos(this.sessionId());

    if (error) {
      console.error('Error: ', error.message);
      return;
    }

    this.title.set(data?.title);
  }

  async loadMyUserInfos() {
    const userId = localStorage.getItem('userId');
    if (userId === null) return;

    const { data, error } = await this.supabaseS.getUserInfos(userId);
    this.userName.set(data?.name);
  }

  async loadOtherMembers() {
    const {data, error} = await this.supabaseS.getMemberNamesBySessionId(this.sessionId());

    if (error) {
      console.error('Error: ', error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.warn('no other members in this session');
      this.otherMembers.set([]);
      return;
    }
    const names = data.map(member => member.name || 'Unbekannt');

    this.otherMembers.set(names);
  }

  async loadHostName() {
    const {data, error} = await this.supabaseS.getHostNameBySessionId(this.sessionId());

    if (error) {
      console.error('Error: ', error.message);
      return;
    }

    if (!data) {
      console.warn('cannot find the host');
      return;
    }

    this.hostName.set(data.name);
  }


}
