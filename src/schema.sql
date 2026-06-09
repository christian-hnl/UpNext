-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.participants (
                                     id uuid NOT NULL DEFAULT gen_random_uuid(),
                                     role text DEFAULT 'member'::text,
                                     session_id integer DEFAULT 0,
                                     name text,
                                     joined_at timestamp with time zone DEFAULT now(),
                                     CONSTRAINT participants_pkey PRIMARY KEY (id)
);
CREATE TABLE public.songs (
                              spotify_id text NOT NULL,
                              title text,
                              artist text,
                              genre text,
                              sessionId integer,
                              duration_ms bigint,
                              album_image text,
                              CONSTRAINT songs_pkey PRIMARY KEY (spotify_id)
);
CREATE TABLE public.session_queue (
                                      id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
                                      spotify_id text,
                                      suggested_by uuid,
                                      score integer,
                                      session_id integer,
                                      status text,
                                      CONSTRAINT session_queue_pkey PRIMARY KEY (id),
                                      CONSTRAINT session_queue_suggested_by_fkey FOREIGN KEY (suggested_by) REFERENCES public.participants(id),
                                      CONSTRAINT session_queue_spotify_id_fkey FOREIGN KEY (spotify_id) REFERENCES public.songs(spotify_id)
);
CREATE TABLE public.votes (
                              id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
                              queue_id bigint,
                              participant_id uuid,
                              vote smallint,
                              song_id text,
                              CONSTRAINT votes_pkey PRIMARY KEY (id),
                              CONSTRAINT votes_queue_id_fkey FOREIGN KEY (queue_id) REFERENCES public.session_queue(id),
                              CONSTRAINT votes_song_id_fkey FOREIGN KEY (song_id) REFERENCES public.songs(spotify_id)
);
CREATE TABLE public.private_sessions (
                                         created_at timestamp with time zone NOT NULL DEFAULT now(),
                                         session_id integer NOT NULL DEFAULT 0,
                                         title text NOT NULL DEFAULT 'NULL'::text,
                                         qrCodeData text,
                                         status text DEFAULT 'deactivated'::text,
                                         active_device_id text,
                                         spotify_token text,
                                         duration_ms bigint,
                                         last_active_at timestamp with time zone DEFAULT now(),
                                         CONSTRAINT private_sessions_pkey PRIMARY KEY (session_id)
);
CREATE TABLE public.public_sessions (
                                        session_id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
                                        created_at timestamp with time zone NOT NULL DEFAULT now(),
                                        event_name text,
                                        status text DEFAULT 'deactivated'::text,
                                        organicer text DEFAULT 'upNext'::text,
                                        qrCodeData text,
                                        last_active_at timestamp with time zone DEFAULT now(),
                                        CONSTRAINT public_sessions_pkey PRIMARY KEY (session_id)
);