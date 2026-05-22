import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {UserProfile} from '@spotify/web-api-ts-sdk';
import { Spotify } from '../../../services/spotify';
import {SupabaseService} from '../../../services/supabase-service';
import {FormsModule} from '@angular/forms';
import {QRCodeComponent} from 'angularx-qrcode';
import {Router} from "@angular/router";

@Component({
  selector: 'app-host',
  imports: [
    FormsModule,
    QRCodeComponent
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

  title = signal("");


  ngOnInit() {
    this.handleAuthentication();
  }

  async handleAuthentication() {
    // Check if the current URL is the Spotify callback
    if (this.router.url.startsWith('/callback')) {
      try {
        // The login method will complete the authentication process
        await this.spotifyService.login();
        // Fetch user profile
        this.userProfile.set(await this.spotifyService.getMyProfile());
        // Redirect to the clean host URL
        await this.router.navigate(['/mode1/host']);
      } catch (e) {
        console.error('Error during Spotify authentication callback:', e);
        // On error, redirect to a safe page
        await this.router.navigate(['/welcome']);
      }
    } else {
      // This is a normal page load, just check for an existing token
      try {
        const token = await this.spotifyService.getAccessToken();
        if (token) {
          this.userProfile.set(await this.spotifyService.getMyProfile());
        }
      } catch (e) {
        // This can happen if the user is not logged in, which is fine.
        console.log('User is not logged in.');
      }
    }
  }

  async onLogin() {
    // This method now only initiates the login
    await this.spotifyService.login();
  }

  async onLogout() {
    await this.spotifyService.logout();
    this.userProfile.set(null);
  }

  public sessionLink = signal("https://sigfriedschweigl.github.io/POS/index.html")


  async addSession() {
    console.log(this.userProfile)
    const data = await this.supabaseService.addSession(this.title(), <string>this.userProfile()?.id);
    if (data && data[0] && data[0].qrCodeData) {
      this.sessionLink.set(data[0].qrCodeData)
    }
  }
}