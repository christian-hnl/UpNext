import { Injectable } from '@angular/core';
import { SpotifyApi, Scopes, UserProfile, AuthorizationCodeWithPKCEStrategy } from '@spotify/web-api-ts-sdk';

class CustomAuthorizationStrategy extends AuthorizationCodeWithPKCEStrategy {
  override async generateRedirectUrlForUser(scopes: string[], challenge: string): Promise<string> {
    const url = await super.generateRedirectUrlForUser(scopes, challenge);
    return `${url}&show_dialog=true`;
  }
}

@Injectable({
  providedIn: 'root',
})
export class Spotify {
  private sdk: SpotifyApi;

  constructor() {
    const redirectUrl = window.location.origin + '/callback';
    console.log('[Spotify Service] Redirect URL:', redirectUrl)
    
    const clientId = "47763151a4a5406bbbb58c8ad2601f81";
    const strategy = new CustomAuthorizationStrategy(clientId, redirectUrl, Scopes.all);
    this.sdk = new SpotifyApi(strategy);
  }

  async login(): Promise<UserProfile | null> {
    console.log('[Spotify Service] login called');
    await this.sdk.authenticate();
    try {
      const profile = await this.getMyProfile();
      console.log('[Spotify Service] Login successful, profile:', profile);
      return profile;
    } catch (e) {
      console.error('[Spotify Service] Error getting profile after login:', e);
      return null;
    }
  }

  async search(search: string){
    console.log('[Spotify Service] searching for:', search);
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

  async addToQueue(uri: string) {
    console.log('[Spotify Service] addToQueue called with uri:', uri);
    try {
      const result = await this.sdk.player.addItemToPlaybackQueue(uri);
      console.log('[Spotify Service] addToQueue result:', result);
      return result;
    } catch (e) {
      // Falls der Fehler durch einen leeren Body bei 204 verursacht wird, fangen wir ihn hier ab
      const errorMessage = e instanceof Error ? e.message : String(e);
      if (errorMessage.includes('Unexpected token') || errorMessage.includes('No number after minus sign')) {
        console.warn('[Spotify Service] Spotify hat 204 No Content zurückgegeben, was der SDK-Deserializer nicht mag. URI:', uri);
        return null;
      }
      console.error('[Spotify Service] Error in addToQueue:', e);
      throw e;
    }
  }
}