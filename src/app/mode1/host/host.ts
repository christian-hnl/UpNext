import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {UserProfile} from '@spotify/web-api-ts-sdk';
import { Spotify } from '../../../services/spotify';
import {SupabaseService} from '../../../services/supabase-service';
import {FormsModule} from '@angular/forms';
import {Router} from "@angular/router";
import {NotificationService} from "../../shared/notification.service";

@Component({
  selector: 'app-host',
  imports: [
    FormsModule
  ],
  templateUrl: './host.html',
  styleUrl: './host.scss',
  standalone: true
})
export class Host implements OnInit{

  userProfile: WritableSignal<UserProfile | null> = signal<UserProfile | null>(null);
  spotifyService = inject(Spotify);
  supabaseService = inject(SupabaseService);
  router = inject(Router);
  private notifications = inject(NotificationService);
  sessionId = signal<number>(0);

  title = signal<string>("");
  loading = signal(true);


  ngOnInit() {
    // erst nach dem Auth-Check rendern -> kein kurzes Aufblitzen des Login-Bereichs
    this.handleAuthentication().finally(() => this.loading.set(false));
  }

  async handleAuthentication() {
    if (this.router.url.startsWith('/callback')) {
      try {
        await this.spotifyService.login();

        const profile = await this.spotifyService.getMyProfile();
        this.userProfile.set(profile);

        await this.router.navigate(['/mode1']);
      } catch (e) {
        console.error('[Host] Error during Spotify authentication callback:', e);

        await this.router.navigate(['/welcome']);
      }
    } else {

      try {
        const token = await this.spotifyService.getAccessToken();
        if (token) {
          const profile = await this.spotifyService.getMyProfile();
          this.userProfile.set(profile);
        }
      } catch (e) {

      }
    }
  }

  async onLogin() {
    try {
      const profile = await this.spotifyService.login();
      if (profile) {
        this.userProfile.set(profile);
      }
    } catch (e) {
      console.error("Login failed", e);
      this.notifications.error('Spotify-Login fehlgeschlagen.');
    }
  }

  async onLogout() {
    await this.spotifyService.logout();
    this.userProfile.set(null);
  }


  async addSession() {
    const data = await this.supabaseService.addPrivateSession(this.title());
    if (data && data[0] && data[0].qrCodeData) {
      const sessionId = data[0].session_id;
      this.sessionId.set(sessionId);

      const profile = this.userProfile();
      if (profile) {
        const { data: hostUser, error: hostUserError } = await this.supabaseService.addUser(profile.display_name, this.sessionId(), true);
        if (hostUserError || !hostUser) {
          console.error('[Host] Failed to register host user:', hostUserError?.message);
          this.notifications.error('Konnte dich nicht als Host registrieren.');
          return;
        }
        // WICHTIG: Host-userId speichern – sonst scheitert der Host-Check in session-host (→ 404)
        localStorage.setItem('userId', hostUser.id);
      }

      await this.router.navigate(['/mode1/session-host', this.sessionId()]);
    } else {
      console.error('[Host] Failed to create session');
      this.notifications.error('Session konnte nicht erstellt werden.');
    }
  }



}