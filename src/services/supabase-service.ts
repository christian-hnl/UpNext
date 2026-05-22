import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {environment} from '../environments/environment';
import { Database} from '../app/database.types';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient<Database>;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async simpleTest() {
    console.log('Sende Anfrage an den Supabase-Server...');

    // Das zwingt Supabase, eine echte Netzwerk-Anfrage an den Server zu schicken
    const { data, error } = await this.supabase.from('sessions').select('*');

    if (error) {
      console.error('❌ Server antwortet mit FEHLER:', error.message, error.code);
    } else {
      console.log('✅ Server antwortet mit ERFOLG:', data);
    }
  }

  async addSession(titleEingabe: string, hostID: string) {
    const rHostId = Math.floor(100000 + Math.random() * 900000).toString();
    const qrUrl = window.location.origin + '/mode1/join/' + rHostId;
    console.log(qrUrl);


    const { data, error } = await this.supabase
      .from('sessions').insert({
        host_id: hostID,
        title: titleEingabe,
        qrCodeData: qrUrl,
        mode: "host",
        status: "running"
      }).select();

    if (error) {
      console.error('Fehler beim Speichern:', error.message);
      return null;
    }

    console.log('✅ Eintrag erfolgreich gespeichert:', data);
    return data;
  }
}
