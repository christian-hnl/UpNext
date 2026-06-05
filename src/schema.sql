
CREATE TABLE public.participants (
                                     joined_at timestamp with time zone DEFAULT now(),
                                     id uuid NOT NULL DEFAULT gen_random_uuid(),
                                     role text DEFAULT 'member'::text,
                                     session_id integer DEFAULT 0,
                                     name text,
                                     status text DEFAULT 'active'::text,
                                     CONSTRAINT participants_pkey PRIMARY KEY (id)
);
CREATE TABLE public.songs (
                              spotify_id text NOT NULL,
                              title text,
                              artist text,
                              genre text,
                              sessionId text,
                              album_image text,
                              duration_ms integer,
                              CONSTRAINT songs_pkey PRIMARY KEY (spotify_id)
);
CREATE TABLE public.session_queue (
                                      id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
                                      session_id uuid NOT NULL,
                                      spotify_id text,
                                      suggested_by uuid,
                                      score integer,
                                      status text,
                                      CONSTRAINT session_queue_pkey PRIMARY KEY (id),
                                      CONSTRAINT session_queue_suggested_by_fkey FOREIGN KEY (suggested_by) REFERENCES public.participants(id),
                                      CONSTRAINT session_queue_spotify_id_fkey FOREIGN KEY (spotify_id) REFERENCES public.songs(spotify_id)
);
CREATE TABLE public.votes (
                              vote smallint,
                              song_id text,
                              id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
                              queue_id bigint,
                              participant_id uuid,
                              CONSTRAINT votes_pkey PRIMARY KEY (id),
                              CONSTRAINT votes_queue_id_fkey FOREIGN KEY (queue_id) REFERENCES public.session_queue(id),
                              CONSTRAINT votes_song_id_fkey FOREIGN KEY (song_id) REFERENCES public.songs(spotify_id)
);
CREATE TABLE public.private_sessions (
                                         created_at timestamp with time zone NOT NULL DEFAULT now(),
                                         session_id integer NOT NULL DEFAULT 0,
                                         qrCodeData text,
                                         title text NOT NULL DEFAULT 'NULL'::text,
                                         status text DEFAULT 'deactivated'::text,
                                         spotify_token text,
                                         active_device_id text,
                                         CONSTRAINT private_sessions_pkey PRIMARY KEY (session_id)
);
CREATE TABLE public.public_sessions (
                                        session_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
                                        created_at timestamp with time zone NOT NULL DEFAULT now(),
                                        event_name text,
                                        status text DEFAULT 'deactivated'::text,
                                        organicer text DEFAULT 'upNext'::text,
                                        qrCodeData text,
                                        CONSTRAINT public_sessions_pkey PRIMARY KEY (session_id)
);