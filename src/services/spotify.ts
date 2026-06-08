import { Injectable } from '@angular/core';
import { SpotifyApi, Scopes, UserProfile, AuthorizationCodeWithPKCEStrategy, AccessToken } from '@spotify/web-api-ts-sdk';

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
  private clientId = "47763151a4a5406bbbb58c8ad2601f81";

  constructor() {
    const redirectUrl = window.location.origin + '/callback';
    
    const strategy = new CustomAuthorizationStrategy(this.clientId, redirectUrl, Scopes.all);
    this.sdk = new SpotifyApi(strategy);
  }

  /**
   * Initialisiert das SDK mit einem vorhandenen Token (z.B. vom Host).
   * Dies erlaubt Mitgliedern, Spotify-Aktionen über das Token des Hosts auszuführen.
   */
  setAccessToken(token: AccessToken) {
    this.sdk = SpotifyApi.withAccessToken(this.clientId, token);
  }

  async login(): Promise<UserProfile | null> {
    await this.sdk.authenticate();
    try {
      const profile = await this.getMyProfile();
      return profile;
    } catch (e) {
      console.error('[Spotify Service] Error getting profile after login:', e);
      return null;
    }
  }

  async search(search: string) {
    try {
      return await this.sdk.search(search, ["track"], "AT", 5);
    } catch (e: any) {
      console.error('[Spotify Service] Error in search:', e);
      if (e?.status === 401) {
        // Token abgelaufen oder nicht vorhanden
        // Wir könnten hier versuchen, den User erneut einzuloggen, 
        // aber für Mitglieder ist das nicht möglich.
      }
      throw e;
    }
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

  async getAvailableDevices() {
    try {
      const result = await this.sdk.player.getAvailableDevices();
      return result.devices;
    } catch (e) {
      console.error('[Spotify Service] Error getting available devices:', e);
      return [];
    }
  }

  async transferPlayback(deviceId: string) {
    try {
      await this.sdk.player.transferPlayback([deviceId], true);
    } catch (e) {
      console.error('[Spotify Service] Error transferring playback:', e);
      throw e;
    }
  }

  async getCurrentlyPlaying() {
    try {
      return await this.sdk.player.getCurrentlyPlayingTrack();
    } catch (e) {
      console.error('[Spotify Service] Error getting currently playing:', e);
      return null;
    }
  }

  async getPlaybackState() {
    try {
      return await this.sdk.player.getPlaybackState();
    } catch (e) {
      console.error('[Spotify Service] Error getting playback state:', e);
      return null;
    }
  }

  async getQueue() {
    try {
      return await this.sdk.player.getUsersQueue();
    } catch (e) {
      console.error('[Spotify Service] Error getting Spotify queue:', e);
      return null;
    }
  }

  async addToQueue(uri: string, deviceId?: string | null) {
    try {
      if (deviceId) {
        // Wir versuchen sicherzustellen, dass das Gerät aktiv ist
        await this.sdk.player.addItemToPlaybackQueue(uri, deviceId);
      } else {
        await this.sdk.player.addItemToPlaybackQueue(uri);
      }
      return true;
    } catch (e: any) {
      // Falls der Fehler durch einen leeren Body bei 204 verursacht wird, fangen wir ihn hier ab
      const errorMessage = e instanceof Error ? e.message : String(e);
      if (errorMessage.includes('Unexpected token') || errorMessage.includes('No number after minus sign')) {
        console.warn('[Spotify Service] Spotify hat 204 No Content zurückgegeben, was der SDK-Deserializer nicht mag. URI:', uri);
        return true;
      }
      
      if (e?.status === 404 && (e?.message?.includes('No active device found') || e?.reason === 'NO_ACTIVE_DEVICE')) {
        if (deviceId) {
            try {
                await this.transferPlayback(deviceId);
                // Kurz warten und erneut versuchen
                await new Promise(resolve => setTimeout(resolve, 500));
                await this.sdk.player.addItemToPlaybackQueue(uri, deviceId);
                return true;
            } catch (retryError) {
                console.error('[Spotify Service] Retry after transfer failed:', retryError);
            }
        }
        throw new Error('Kein aktives Spotify-Gerät gefunden. Bitte starte Spotify auf einem Gerät des Hosts.');
      }

      console.error('[Spotify Service] Error in addToQueue:', e);
      throw e;
    }
  }
}