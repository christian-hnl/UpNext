import { Injectable } from '@angular/core';
import { SpotifyApi, Scopes, UserProfile } from '@spotify/web-api-ts-sdk';

@Injectable({
  providedIn: 'root',
})
export class Spotify {
  private sdk: SpotifyApi;

  constructor() {
    // Liest die aktuelle Domain aus (z.B. http://localhost:4200 oder https://deine-app.vercel.app)
    const redirectUrl = window.location.origin + '/callback';

    this.sdk = SpotifyApi.withUserAuthorization(
        "c680968a416149a08fa5191dbea575b5",
        redirectUrl,
        Scopes.all
    );
  }

  async login() {
    await this.sdk.authenticate();
  }

  async getMyProfile(): Promise<UserProfile> {
    return await this.sdk.currentUser.profile();
  }

  async logout() {
    this.sdk.logOut();
  }

  async getAccessToken(){
    return await this.sdk.getAccessToken();
  }
}