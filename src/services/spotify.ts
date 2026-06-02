import { Injectable } from '@angular/core';
import { SpotifyApi, Scopes, UserProfile } from '@spotify/web-api-ts-sdk';

@Injectable({
  providedIn: 'root',
})
export class Spotify {
  private sdk: SpotifyApi;

  constructor() {
    const redirectUrl = window.location.origin + '/callback';
    console.log(redirectUrl)
    this.sdk = SpotifyApi.withUserAuthorization(
        "47763151a4a5406bbbb58c8ad2601f81",
        redirectUrl,
        Scopes.all
    );
  }

  async login(): Promise<UserProfile | null> {
    await this.sdk.authenticate();
    try {
      return await this.getMyProfile();
    } catch (e) {
      return null;
    }
  }

  async search(search: string){
    return await this.sdk.search(search, ["track"], "AT", 5);
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

  async addToQueue(){
    return await this.sdk
  }
}