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

  async addSession(titleEingabe: string) {
    const rHostId = Math.floor(100000 + Math.random() * 900000).toString();
    const qrUrl = window.location.origin + '/mode1/session/' + rHostId;
    console.log(qrUrl);


    const { data, error } = await this.supabase
      .from('sessions').insert({
        host_id: rHostId,
        title: titleEingabe,
        qrCodeData: qrUrl,
        status: "running"
      }).select();

    if (error) {
      console.error('error:', error.message);
      return null;
    }

    console.log('eintrag erfolgreich:', data);
    return data;
  }



  async joinSession(id: string) {
    return this.supabase
        .from('sessions')
        .select('host_id')
        .eq('host_id', id)
        .maybeSingle();
  }

  async getSessionInfos(id: string) {
    return this.supabase
      .from('sessions')
        .select('*')
        .eq('host_id', id)
        .maybeSingle();
  }

  async addUser(username: string, sessionId: number) {
    return this.supabase
      .from('participants')
        .insert({
          name: username,
          role: 'member',
          session_id: sessionId
        })
  }


}
