import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {UserProfile} from '@spotify/web-api-ts-sdk';
import { Spotify } from '../../../services/spotify';
import {SupabaseService} from '../../../services/supabase-service';
import {FormsModule} from '@angular/forms';
import {Router} from "@angular/router";

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
  sessionId = signal<number>(0);

  title = signal<string>("");


  ngOnInit() {
    this.handleAuthentication().then();
  }

  async handleAuthentication() {
    console.log('[Host] handleAuthentication called. URL:', this.router.url);
    if (this.router.url.startsWith('/callback')) {
      try {
        console.log('[Host] Handling OAuth callback');
        await this.spotifyService.login();

        const profile = await this.spotifyService.getMyProfile();
        console.log('[Host] Profile retrieved after callback:', profile);
        this.userProfile.set(profile);

        await this.router.navigate(['/mode1/configureSession']);
      } catch (e) {
        console.error('[Host] Error during Spotify authentication callback:', e);

        await this.router.navigate(['/welcome']);
      }
    } else {

      try {
        const token = await this.spotifyService.getAccessToken();
        if (token) {
          const profile = await this.spotifyService.getMyProfile();
          console.log('[Host] User already logged in, profile:', profile);
          this.userProfile.set(profile);
        }
      } catch (e) {

        console.log('[Host] User is not logged in.');
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
    }
  }

  async onLogout() {
    await this.spotifyService.logout();
    this.userProfile.set(null);
  }


  async addSession() {
    console.log('[Host] addSession called. Title:', this.title());
    console.log('[Host] Current user profile:', this.userProfile());
    const data = await this.supabaseService.addPrivateSession(this.title());
    if (data && data[0] && data[0].qrCodeData) {
      console.log('[Host] Session created successfully. Data:', data[0]);
      const sessionId = data[0].session_id;
      this.sessionId.set(sessionId);

      const profile = this.userProfile();
      if (profile) {
        console.log('[Host] Registering host user in database:', profile.display_name);
        const hostUser = await this.supabaseService.addUser(profile.display_name, this.sessionId(), true);

        localStorage.setItem('userId', hostUser.id);
      }

      await this.router.navigate(['/mode1/session-host', this.sessionId()]);
    } else {
      await this.router.navigate(['/404']);
    }
  }



}