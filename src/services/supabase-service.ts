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
    const rHostId = Math.floor(100000 + Math.random() * 900000);
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

  async joinSession(id: number) {
    return this.supabase
        .from('sessions')
        .select('host_id')
        .eq('host_id', id)
        .maybeSingle();
  }

  async getSessionInfos(id: number) {
    return this.supabase
      .from('sessions')
        .select('*')
        .eq('host_id', id)
        .maybeSingle();
  }

  async addUser(username: string, sessionId: number, host: boolean) {
    let role: string = 'member';
    if (host) role = 'host';

    return this.supabase
      .from('participants')
        .insert({
          name: username,
          role: role,
          session_id: sessionId
        }).select('id')
        .single();
  }

  async getUserInfos(id: string) {
      return this.supabase
          .from('participants')
          .select('*')
          .eq('id', id)
        .single();
  }


}
