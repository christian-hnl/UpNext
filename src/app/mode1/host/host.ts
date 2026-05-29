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
  qrCode = new Qrcode;
  sessionId = signal<number>(0);

  title = signal<string>("");


  ngOnInit() {
    this.handleAuthentication().then();
  }

  async handleAuthentication() {
    if (this.router.url.startsWith('/callback')) {
      try {

        await this.spotifyService.login();

        this.userProfile.set(await this.spotifyService.getMyProfile());

        await this.router.navigate(['/mode1/sessionHost']);
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
    await this.spotifyService.login();
    await this.supabaseService.addUser(this.userProfile.name, this.sessionId(), true);
  }

  async onLogout() {
    await this.spotifyService.logout();
    this.userProfile.set(null);
  }


  async addSession() {
    console.log(this.userProfile)
    const data = await this.supabaseService.addPrivateSession(this.title());
    if (data && data[0] && data[0].qrCodeData) {
      this.qrCode.generateQR(data[0].qrCodeData)
    }
  }
}