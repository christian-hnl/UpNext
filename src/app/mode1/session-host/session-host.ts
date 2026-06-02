import {Component, inject, input, OnInit, signal} from "@angular/core";
import {SupabaseService} from "../../../services/supabase-service";
import {QRCodeComponent} from "angularx-qrcode";
import {Qrcode} from "../qrcode/qrcode";

@Component({
  selector: "app-session-member-host",
  imports: [
    QRCodeComponent,
    Qrcode
  ],
  templateUrl: "./session-host.html",
  styleUrl: "./session-host.scss",
})
export class SessionHost implements OnInit {

  sessionId = input.required<number>();
  private supabaseS = inject(SupabaseService);

  title = signal<string | undefined>(undefined);
  userName = signal<string | null | undefined>(undefined);
  members = signal<string[]>([]);
  qrcodedata = signal("")


  ngOnInit() {
    this.loadSessionInfos().then();
    this.loadMyUserInfos().then();
    this.loadMembers().then();
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
    this.qrcodedata.set(<string>data?.qrCodeData)
  }

  async loadMyUserInfos() {
    const userId = localStorage.getItem('userId');
    if (userId === null) return;

    const { data, error } = await this.supabaseS.getUserInfos(userId);
    this.userName.set(data?.name);
  }

  async loadMembers() {
    const {data, error} = await this.supabaseS.getMemberNamesBySessionId(this.sessionId());

    if (error) {
      console.error('Error: ', error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.warn('no other members in this session');
      this.members.set([]);
      return;
    }
    const names = data.map(member => member.name || 'Unbekannt');

    this.members.set(names);
  }



}
