import {Component, inject, input, OnInit, signal} from "@angular/core";
import {SupabaseService} from "../../../services/supabase-service";
import {Qrcode} from "../qrcode/qrcode";
import {Queuevoting} from "../queuevoting/queuevoting";
import {Router} from "@angular/router";

@Component({
  selector: "app-session-member-host",
  imports: [
    Qrcode,
    Queuevoting
  ],
  templateUrl: "./session-host.html",
  styleUrl: "./session-host.scss",
})
export class SessionHost implements OnInit {

  private supabaseS = inject(SupabaseService);
  private router = inject(Router);

  sessionId = input.required<number>();
  title = signal<string | undefined>(undefined);
  userName = signal<string | null | undefined>(undefined);
  members = signal<string[]>([]);
  qrcodedata = signal("")


  async ngOnInit() {
    const isAuthorized = await this.checkSession();
    if (!isAuthorized) {
      return;
    }

    await this.loadSessionInfos();
    await this.loadMyUserInfos();
    await this.loadMembers();
  }


  /*
  loadSessionInfos()
  laedt den namen und qrCodeLink der session
  */
  async loadSessionInfos() {
    if (this.sessionId() === null) {
      await this.router.navigate(['/404']);
      return;
    }

    const { data, error } = await this.supabaseS.getPrivateSessionInfos(this.sessionId());

    if (error) {
      console.error('Error: ', error.message);
      await this.router.navigate(['/404']);
      return;
    }

    this.title.set(data?.title);
    this.qrcodedata.set(<string>data?.qrCodeData)
  }


  /*
  checkSession()
  checkt ob der user auch wirklich host ist
  verhindert brocken access control
   */
  async checkSession(): Promise<boolean> {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      await this.router.navigate(['/welcome']);
      return false;
    }

    const { data: hostData, error: hostError } = await this.supabaseS.checkHost(userId, this.sessionId());

    if (hostError) {
      console.error("Datenbank-Fehler beim Host-Check:", hostError);
      await this.router.navigate(['/404']);
      return false;
    }

    const isHost = hostData !== null;
    if (!isHost) {
      await this.router.navigate(['/404']);
      return false;
    }

    return true;
  }


  /*
  loadMyUserInfos()
  laedt den namen vom host
   */
  async loadMyUserInfos() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      await this.router.navigate(['/404']);
      return;
    }

    const { data, error } = await this.supabaseS.getUserInfos(userId);
    if (error) {
      await this.router.navigate(['/404']);
    }

    this.userName.set(data?.name);
  }


  /*
  loadMembers()
  laedt die mitglieder der aktiven, eigenen session
   */
  async loadMembers() {
    const {data, error} = await this.supabaseS.getMemberNamesBySessionId(this.sessionId());

    if (error) {
      console.error('Error: ', error.message);
      await this.router.navigate(['/404']);
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
