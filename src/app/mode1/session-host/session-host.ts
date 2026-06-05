import {Component, inject, input, OnInit, signal} from "@angular/core";
import {SupabaseService} from "../../../services/supabase-service";
import {Spotify} from "../../../services/spotify";
import {Qrcode} from "../qrcode/qrcode";
import {Queuevoting} from "../queuevoting/queuevoting";
import {Router} from "@angular/router";
import {Device} from "@spotify/web-api-ts-sdk";
import {Database} from "../../database.types";

type Participant = Database["public"]["Tables"]["participants"]["Row"];

@Component({
  selector: "app-session-member-host",
  imports: [
    Qrcode,
    Queuevoting
  ],
  templateUrl: "./session-host.html",
  styleUrl: "./session-host.scss",
})
export class SessionHost implements OnInit {

  private supabaseS = inject(SupabaseService);
  private spotifyAPI = inject(Spotify);
  private router = inject(Router);

  sessionId = input.required<number>();
  title = signal<string | undefined>(undefined);
  userName = signal<string | null | undefined>(undefined);
  members = signal<Participant[]>([]);
  devices = signal<Device[]>([]);
  selectedDeviceId = signal<string>("");
  qrcodedata = signal("")


  async ngOnInit() {
    const isAuthorized = await this.checkSession();
    if (!isAuthorized) {
      return;
    }

    await this.loadSessionInfos();
    await this.loadMyUserInfos();
    await this.loadMembers();
    await this.loadDevices();
  }


  /*
  loadSessionInfos()
  laedt den namen und qrCodeLink der session
  */
  async loadSessionInfos() {
    if (this.sessionId() === null) {
      await this.router.navigate(['/404']);
      return;
    }

    const { data, error } = await this.supabaseS.getPrivateSessionInfos(this.sessionId());

    if (error) {
      console.error('Error: ', error.message);
      await this.router.navigate(['/404']);
      return;
    }

    this.title.set(data?.title);
    this.qrcodedata.set(<string>data?.qrCodeData)
  }


  /*
  checkSession()
  checkt ob der user auch wirklich host ist
  verhindert brocken access control
   */
  async checkSession(): Promise<boolean> {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      await this.router.navigate(['/welcome']);
      return false;
    }

    const { data: hostData, error: hostError } = await this.supabaseS.checkHost(userId, this.sessionId());

    if (hostError) {
      console.error("Datenbank-Fehler beim Host-Check:", hostError);
      await this.router.navigate(['/404']);
      return false;
    }

    const isHost = hostData !== null;
    if (!isHost) {
      await this.router.navigate(['/404']);
      return false;
    }

    return true;
  }


  /*
  loadMyUserInfos()
  laedt den namen vom host
   */
  async loadMyUserInfos() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      await this.router.navigate(['/404']);
      return;
    }

    const { data, error } = await this.supabaseS.getUserInfos(userId);
    if (error) {
      await this.router.navigate(['/404']);
    }

    this.userName.set(data?.name);
  }


  /*
  loadMembers()
  laedt alle teilnehmer (host + members) der session inkl. status und rolle
   */
  async loadMembers() {
    const {data, error} = await this.supabaseS.getAllParticipantsBySessionId(this.sessionId());

    if (error) {
      console.error('Error: ', error.message);
      await this.router.navigate(['/404']);
      return;
    }

    this.members.set(data ?? []);
  }


  /*
  loadDevices()
  laedt die verfuegbaren Spotify-Wiedergabegeraete des Hosts
  und waehlt das aktive Geraet vor
   */
  async loadDevices() {
    const devices = await this.spotifyAPI.getAvailableDevices();
    this.devices.set(devices);

    const active = devices.find(device => device.is_active);
    if (active && active.id) {
      this.selectedDeviceId.set(active.id);
    }
  }


  /*
  onDeviceChange()
  uebertraegt die Wiedergabe auf das im Dropdown gewaehlte Geraet
   */
  async onDeviceChange(event: Event) {
    const deviceId = (event.target as HTMLSelectElement).value;
    this.selectedDeviceId.set(deviceId);
    if (!deviceId) {
      return;
    }

    try {
      await this.spotifyAPI.transferPlayback(deviceId);
    } catch (e) {
      console.error('[SessionHost] Fehler beim Wechseln des Geraets:', e);
    }
  }


  /*
  blockParticipant() / unblockParticipant()
  setzt den status eines teilnehmers; der gesperrte member wird
  clientseitig per realtime-subscription (session-member) rausgeworfen
   */
  async blockParticipant(participantId: string) {
    const { error } = await this.supabaseS.setParticipantStatus(participantId, 'blocked');
    if (error) {
      console.error('[SessionHost] Fehler beim Sperren:', error.message);
      return;
    }
    await this.loadMembers();
  }

  async unblockParticipant(participantId: string) {
    const { error } = await this.supabaseS.setParticipantStatus(participantId, 'active');
    if (error) {
      console.error('[SessionHost] Fehler beim Entsperren:', error.message);
      return;
    }
    await this.loadMembers();
  }


  /*
  endSession()
  beendet die session (status='finished'); mitglieder werden
  per realtime-subscription automatisch rausgeworfen
   */
  async endSession() {
    if (!confirm('Session wirklich beenden? Alle Teilnehmer werden entfernt.')) {
      return;
    }

    const { error } = await this.supabaseS.endSession(this.sessionId());
    if (error) {
      console.error('[SessionHost] Fehler beim Beenden der Session:', error.message);
      return;
    }

    await this.router.navigate(['/']);
  }


  /*
  syncQueues()  [Debug-Hilfsfunktion]
  schiebt den aktuell hoechstbewerteten Song aus der Supabase-Queue
  in die echte Spotify-Wiedergabeschlange des gewaehlten Geraets
   */
  async syncQueues() {
    const { data, error } = await this.supabaseS.getQueue(this.sessionId());
    if (error || !data || data.length === 0) {
      console.warn('[SessionHost] Keine Songs in der Queue zum Synchronisieren');
      return;
    }

    const top = data[0];
    if (!top.spotify_id) {
      return;
    }

    try {
      await this.spotifyAPI.addToQueue(`spotify:track:${top.spotify_id}`, this.selectedDeviceId() || null);
      console.log('[SessionHost] Top-Song zur Spotify-Queue hinzugefuegt:', top.spotify_id);
    } catch (e) {
      console.error('[SessionHost] Fehler beim Synchronisieren der Queue:', e);
    }
  }

}
