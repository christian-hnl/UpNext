import {Component, inject, input, OnInit, signal} from '@angular/core';
import {SupabaseService} from "../../../services/supabase-service";
import {Search} from "../search/search";
import {Queuevoting} from "../queuevoting/queuevoting";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-session-member',
    imports: [
        Search,
        Queuevoting,
        FormsModule
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

  inputName = "";
  isJoined = signal<boolean>(false);

  async ngOnInit() {
    await this.loadSessionInfos();
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.isJoined.set(true);
      await this.loadMyUserInfos();
      await this.loadOtherMembers();
      await this.loadHostName();
    }
  }

  async joinSession() {
    if (!this.inputName) return;
    
    const result = await this.supabaseS.addUser(this.inputName, this.sessionId(), false);
    if (result.data) {
      localStorage.setItem('userId', result.data.id);
      this.isJoined.set(true);
      this.userName.set(this.inputName);
      await this.loadOtherMembers();
      await this.loadHostName();
    }
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
