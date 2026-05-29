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


  async addPrivateSession(titleEingabe: string) {
    const randSessionId = Math.floor(100000 + Math.random() * 900000);
    const qrUrl = window.location.origin + '/mode1/sessionMember/' + randSessionId;
    console.log(qrUrl);


    const { data, error } = await this.supabase
      .from('private_sessions').insert({
        session_id: randSessionId,
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


  //joining
  async joinPrivateSession(id: number) {
    return this.supabase
        .from('private_sessions')
        .select('session_id')
        .eq('session_id', id)
        .maybeSingle();
  }

  async joinPublicSession(id: number) {
      return this.supabase
          .from('public_sessions')
          .select('session_id')
          .eq('session_id', id)
          .maybeSingle();
  }

  async getPrivateSessionInfos(id: number) {
    return this.supabase
      .from('private_sessions')
        .select('*')
        .eq('session_id', id)
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


  async getMemberNamesBySessionId(sessionId: number) {
      return this.supabase
          .from('participants')
          .select('name')
          .eq('session_id', sessionId)
          .eq('role', 'member');
  }

    async getHostNameBySessionId(sessionId: number) {
        return this.supabase
            .from('participants')
            .select('name')
            .eq('session_id', sessionId)
            .eq('role', 'host')
            .single();
    }


}
