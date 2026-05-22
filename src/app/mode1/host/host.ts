import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {UserProfile} from '@spotify/web-api-ts-sdk';
import { Spotify } from '../../../services/spotify';
import {SupabaseService} from '../../../services/supabase-service';
import {FormsModule} from '@angular/forms';
import {QRCodeComponent} from 'angularx-qrcode';

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

  title = signal("");


  ngOnInit() {
    this.checkAuth();
  }

  async checkAuth() {
    const accessToken = await this.spotifyService.getAccessToken();
    if (accessToken) {
      console.log("AccessToken: " + accessToken)
      this.userProfile.set(await this.spotifyService.getMyProfile());
      console.log(this.userProfile())
    }
  }

  async onLogin() {
    await this.spotifyService.login();
  }

  async onLogout() {
    await this.spotifyService.logout();
  }

  public sessionLink = signal("https://sigfriedschweigl.github.io/POS/index.html")

  public logoUrl: string = "assets/image.png";

  async addSession() {
    const data = await this.supabaseService.addSession(this.title());
    if (data && data[0] && data[0].qrCodeData) {
      this.sessionLink.set(data[0].qrCodeData)
    }
  }
}
