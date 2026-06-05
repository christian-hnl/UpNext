import {Component, inject, input, OnInit, signal} from '@angular/core';
import {SupabaseService} from "../../../services/supabase-service";
import {Search} from "../search/search";
import {Queuevoting} from "../queuevoting/queuevoting";
import {FormsModule} from "@angular/forms";
import {Spotify} from "../../../services/spotify";

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
  userName = signal<string | null | undefined>(undefined);
  otherMembers = signal<string[]>([]);
  hostName = signal<string | null>(null);

  inputName = "";
  isJoined = signal<boolean>(false);

  async ngOnInit() {
    await this.loadSessionInfos();
    await this.setupSpotifyToken();
    const userId = localStorage.getItem('userId');
    if (userId) {
      // Prüfen, ob der User wirklich noch existiert
      const { data: userExists } = await this.supabaseS.getUserInfos(userId);
      if (userExists) {
        this.isJoined.set(true);
        this.userName.set(userExists.name);
        await this.loadOtherMembers();
        await this.loadHostName();
      } else {
        console.warn('[SessionMember] Saved userId not found in database, clearing localStorage');
        localStorage.removeItem('userId');
        this.isJoined.set(false);
      }
    }
  }

  private spotifyAPI = inject(Spotify);

  async setupSpotifyToken() {
    const { data, error } = await this.supabaseS.getPrivateSessionInfos(this.sessionId());
    if (data && (data as any).spotify_token) {
      try {
        const token = JSON.parse((data as any).spotify_token);
        if (token) {
          this.spotifyAPI.setAccessToken(token);
          console.log('[SessionMember] Spotify token set from session');
        }
      } catch (e) {
        console.error('[SessionMember] Error parsing spotify token:', e);
      }
    }
  }

  async joinSession() {
    if (!this.inputName || this.inputName.trim().length < 2) {
      alert('Bitte gib einen gültigen Namen ein (mind. 2 Zeichen).');
      return;
    }
    
    try {
      const result = await this.supabaseS.addUser(this.inputName.trim(), this.sessionId(), false);
      if (result.data) {
        localStorage.setItem('userId', result.data.id);
        this.isJoined.set(true);
        this.userName.set(this.inputName.trim());
        await this.loadOtherMembers();
        await this.loadHostName();
        
        console.log('[SessionMember] Successfully joined session, userId:', result.data.id);
      }
    } catch (error) {
      console.error('[SessionMember] Error joining session:', error);
      alert('Fehler beim Beitreten der Session.');
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
