export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      participants: {
        Row: {
          id: string
          joined_at: string | null
          name: string | null
          role: string | null
          session_id: number | null
          status: string | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          name?: string | null
          role?: string | null
          session_id?: number | null
          status?: string | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          name?: string | null
          role?: string | null
          session_id?: number | null
          status?: string | null
        }
        Relationships: []
      }
      private_sessions: {
        Row: {
          active_device_id: string | null
          created_at: string
          duration_ms: number | null
          last_active_at: string | null
          qrCodeData: string | null
          session_id: number
          spotify_token: string | null
          status: string | null
          title: string
        }
        Insert: {
          active_device_id?: string | null
          created_at?: string
          duration_ms?: number | null
          last_active_at?: string | null
          qrCodeData?: string | null
          session_id?: number
          spotify_token?: string | null
          status?: string | null
          title?: string
        }
        Update: {
          active_device_id?: string | null
          created_at?: string
          duration_ms?: number | null
          last_active_at?: string | null
          qrCodeData?: string | null
          session_id?: number
          spotify_token?: string | null
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      public_sessions: {
        Row: {
          created_at: string
          event_name: string | null
          last_active_at: string | null
          organicer: string | null
          qrCodeData: string | null
          session_id: number
          status: string | null
        }
        Insert: {
          created_at?: string
          event_name?: string | null
          last_active_at?: string | null
          organicer?: string | null
          qrCodeData?: string | null
          session_id?: number
          status?: string | null
        }
        Update: {
          created_at?: string
          event_name?: string | null
          last_active_at?: string | null
          organicer?: string | null
          qrCodeData?: string | null
          session_id?: number
          status?: string | null
        }
        Relationships: []
      }
      session_queue: {
        Row: {
          id: number
          score: number | null
          session_id: number
          spotify_id: string | null
          status: string | null
          suggested_by: string | null
        }
        Insert: {
          id?: number
          score?: number | null
          session_id: number
          spotify_id?: string | null
          status?: string | null
          suggested_by?: string | null
        }
        Update: {
          id?: number
          score?: number | null
          session_id?: number
          spotify_id?: string | null
          status?: string | null
          suggested_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_queue_spotify_id_fkey"
            columns: ["spotify_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["spotify_id"]
          },
          {
            foreignKeyName: "session_queue_suggested_by_fkey"
            columns: ["suggested_by"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      songs: {
        Row: {
          album_image: string | null
          artist: string | null
          duration_ms: number | null
          genre: string | null
          sessionId: number | null
          spotify_id: string
          title: string | null
        }
        Insert: {
          album_image?: string | null
          artist?: string | null
          duration_ms?: number | null
          genre?: string | null
          sessionId?: number | null
          spotify_id: string
          title?: string | null
        }
        Update: {
          album_image?: string | null
          artist?: string | null
          duration_ms?: number | null
          genre?: string | null
          sessionId?: number | null
          spotify_id?: string
          title?: string | null
        }
        Relationships: []
      }
      votes: {
        Row: {
          id: number
          participant_id: string | null
          queue_id: number | null
          song_id: string | null
          vote: number | null
        }
        Insert: {
          id?: number
          participant_id?: string | null
          queue_id?: number | null
          song_id?: string | null
          vote?: number | null
        }
        Update: {
          id?: number
          participant_id?: string | null
          queue_id?: number | null
          song_id?: string | null
          vote?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_queue_id_fkey"
            columns: ["queue_id"]
            isOneToOne: false
            referencedRelation: "session_queue"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["spotify_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
