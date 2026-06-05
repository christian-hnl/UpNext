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
  isBlocked = signal<boolean>(false);

  async ngOnInit() {
    await this.loadSessionInfos();
    await this.setupSpotifyToken();
    this.setupSessionSubscription();
    const userId = localStorage.getItem('userId');
    if (userId) {
      // Prüfen, ob der User wirklich noch existiert
      const { data: userExists } = await this.supabaseS.getUserInfos(userId);
      if (userExists) {
        if (userExists.status === 'blocked') {
          this.isBlocked.set(true);
          this.isJoined.set(false);
          return;
        }
        this.isJoined.set(true);
        this.userName.set(userExists.name);
        await this.loadOtherMembers();
        await this.loadHostName();
        this.setupStatusSubscription(userId);
      } else {
        console.warn('[SessionMember] Saved userId not found in database, clearing localStorage');
        localStorage.removeItem('userId');
        this.isJoined.set(false);
      }
    }
  }

  private statusChannel: any;
  private sessionChannel: any;

  setupSessionSubscription() {
    this.sessionChannel = this.supabaseS.supabase
      .channel(`session-status-${this.sessionId()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'private_sessions', filter: `session_id=eq.${this.sessionId()}` }, (payload: any) => {
        console.log('[SessionMember] Session event detected:', payload.eventType);
        if (payload.eventType === 'DELETE' || (payload.new && payload.new.status === 'finished')) {
          alert('Die Session wurde vom Host beendet.');
          localStorage.removeItem('userId');
          window.location.href = '/';
        }
      })
      .subscribe();
  }

  setupStatusSubscription(userId: string) {
    this.statusChannel = this.supabaseS.supabase
      .channel(`user-status-${userId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'participants', filter: `id=eq.${userId}` }, (payload: any) => {
        if (payload.new && payload.new.status === 'blocked') {
          console.warn('[SessionMember] User was blocked!');
          this.isBlocked.set(true);
          this.isJoined.set(false);
        } else if (payload.new && payload.new.status === 'active') {
          this.isBlocked.set(false);
          this.isJoined.set(true);
        }
      })
      .subscribe();
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
        const userData = result.data as any;
        if (userData.status === 'blocked') {
          alert('Du wurdest von dieser Session gesperrt.');
          return;
        }
        localStorage.setItem('userId', userData.id);
        this.isJoined.set(true);
        this.userName.set(this.inputName.trim());
        await this.loadOtherMembers();
        await this.loadHostName();
        this.setupStatusSubscription(userData.id);
        
        console.log('[SessionMember] Successfully joined session, userId:', userData.id);
      }
    } catch (error) {
      console.error('[SessionMember] Error joining session:', error);
      alert('Fehler beim Beitreten der Session.');
    }
  }

  ngOnDestroy() {
    if (this.statusChannel) {
      this.supabaseS.supabase.removeChannel(this.statusChannel);
    }
    if (this.sessionChannel) {
      this.supabaseS.supabase.removeChannel(this.sessionChannel);
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
