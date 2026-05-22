import { Injectable } from '@angular/core';
import { SpotifyApi, Scopes, UserProfile } from '@spotify/web-api-ts-sdk';

@Injectable({
  providedIn: 'root',
})
export class Spotify {
  private sdk: SpotifyApi;

  constructor() {
    // Initialisierung: Das SDK prüft bei jedem Seitenaufruf automatisch,
    // ob ein Login-Callback in der URL steckt.
    this.sdk = SpotifyApi.withUserAuthorization(
      "c680968a416149a08fa5191dbea575b5",
      "http://127.0.0.1:4200/callback",
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
