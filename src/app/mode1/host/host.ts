import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {UserProfile} from '@spotify/web-api-ts-sdk';
import { Spotify } from '../../../services/spotify';
import {SupabaseService} from '../../../services/supabase-service';
import {FormsModule} from '@angular/forms';
import {Router} from "@angular/router";
import {Qrcode} from "../qrcode/qrcode";

@Component({
  selector: 'app-host',
  imports: [
    FormsModule,
    Qrcode
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
    if (this.router.url.startsWith('/callback')) {
      try {

        await this.spotifyService.login();

        const profile = await this.spotifyService.getMyProfile();
        this.userProfile.set(profile);

        await this.router.navigate(['/mode1/configureSession']);
      } catch (e) {
        console.error('Error during Spotify authentication callback:', e);

        await this.router.navigate(['/welcome']);
      }
    } else {

      try {
        const token = await this.spotifyService.getAccessToken();
        if (token) {
          this.userProfile.set(await this.spotifyService.getMyProfile());
        }
      } catch (e) {

        console.log('User is not logged in.');
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
    console.log(this.userProfile())
    const data = await this.supabaseService.addPrivateSession(this.title());
    if (data && data[0] && data[0].qrCodeData) {
      this.sessionId.set(data[0].session_id);

      const profile = this.userProfile();
      if (profile) {
        await this.supabaseService.addUser(profile.display_name, this.sessionId(), true);
      }

      await this.router.navigate(['/mode1/session-host', this.sessionId()]);
    }
  }



}