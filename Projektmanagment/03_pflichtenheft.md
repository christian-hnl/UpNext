<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap');
:root{
  --bg:#070707;--card:#151515;--card2:#1e1e1e;--text:#fff;--muted:#a7a7ad;--faint:#6e6e74;
  --border:#262626;--green:#1ed760;--green2:#1db954;--violet:#b721ff;--danger:#f0334b;
}
body{background:var(--bg);color:var(--text);font-family:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;
  line-height:1.65;max-width:980px;margin:0 auto;padding:0 24px 96px;letter-spacing:-.011em;}
h1,h2,h3,h4{font-family:'Space Grotesk','Inter',sans-serif;letter-spacing:-.02em;color:#fff;}
h2{margin-top:2.4em;padding-bottom:.35em;border-bottom:1px solid var(--border);font-size:1.5rem;}
h2::before{content:'';display:inline-block;width:10px;height:10px;border-radius:3px;
  background:linear-gradient(180deg,#28e974,var(--green));margin-right:12px;vertical-align:middle;}
h3{color:var(--green);font-size:1.12rem;margin-top:1.8em;}
h4{color:#d98bff;font-size:.98rem;margin-top:1.4em;}
a{color:var(--green);text-decoration:none;}
a:hover{text-decoration:underline;}
strong{color:#fff;}
table{border-collapse:collapse;width:100%;margin:1.2em 0;font-size:.9rem;
  background:var(--card);border:1px solid var(--border);border-radius:12px;overflow:hidden;}
th{background:#101010;color:var(--muted);text-transform:uppercase;font-size:.72rem;
  letter-spacing:.08em;text-align:left;padding:12px 14px;border-bottom:1px solid var(--border);}
td{padding:11px 14px;border-bottom:1px solid var(--border);color:#d8d8db;vertical-align:top;}
tr:last-child td{border-bottom:none;}
tr:hover td{background:rgba(255,255,255,.025);}
code{background:#0d0d0d;border:1px solid var(--border);border-radius:6px;padding:.12em .45em;
  font-size:.86em;color:var(--green);}
pre{background:#0d0d0d;border:1px solid var(--border);border-radius:12px;padding:16px 18px;overflow:auto;}
pre code{background:none;border:none;color:#cfd2d6;padding:0;}
blockquote{border-left:3px solid var(--green);background:rgba(30,215,96,.06);margin:1.2em 0;
  padding:.6em 1.1em;border-radius:0 10px 10px 0;color:var(--muted);}
hr{border:none;border-top:1px solid var(--border);margin:2.4em 0;}
ul li::marker{color:var(--green);}
.hero{display:flex;align-items:center;gap:18px;margin:40px 0 8px;}
.hero img{width:64px;height:64px;filter:drop-shadow(0 6px 18px rgba(30,215,96,.4));}
.hero .t{margin:0;font-size:2.6rem;font-weight:700;font-family:'Space Grotesk';
  background:linear-gradient(180deg,#fff 30%,#c7cad6);-webkit-background-clip:text;
  background-clip:text;-webkit-text-fill-color:transparent;line-height:1;}
.hero .s{margin:6px 0 0;font-size:.72rem;font-weight:600;letter-spacing:.28em;
  text-transform:uppercase;color:var(--faint);}
.pills{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 6px;}
.pill{display:inline-block;background:var(--card);border:1px solid var(--border);
  border-radius:999px;padding:6px 14px;font-size:.74rem;font-weight:600;color:var(--muted);}
.pill.green{background:rgba(30,215,96,.12);border-color:rgba(30,215,96,.3);color:var(--green);}
.pill.violet{background:rgba(183,33,255,.12);border-color:rgba(183,33,255,.3);color:#d98bff;}
</style>

<div class="hero">
  <img src="../public/media/logo.png" alt="upNext Logo"/>
  <div>
    <p class="t">upNext</p>
    <p class="s">Gemeinsam Musik hören</p>
  </div>
</div>

<div class="pills">
  <span class="pill green">Dokument 03</span>
  <span class="pill">Pflichtenheft</span>
  <span class="pill violet">Technische Umsetzung</span>
</div>

# Pflichtenheft

Das Pflichtenheft beantwortet die Frage: **Wie** werden die Anforderungen aus dem
Projektauftrag technisch umgesetzt? Es ist die Antwort des Projektteams an den
Auftraggeber (Spotify Technology S.A.).

---

## 1 · Ausgangslage

Auf Partys und Events bestimmt fast ausschließlich der Gastgeber bzw. der DJ die Musik.
Gäste haben kaum eine niederschwellige Möglichkeit, ihre Wünsche einzubringen. Das führt
zu unpassender Musik, Frust und einer dauernden Hemmschwelle, den DJ direkt anzusprechen.
Gleichzeitig fehlt dem DJ ein Stimmungsbild darüber, was das Publikum gerade hören möchte.

## 2 · Ist-Zustand

| Bestehender Ansatz | Schwäche |
|--------------------|----------|
| DJ wählt allein aus | Einseitig, ignoriert Publikumsgeschmack |
| Gast geht persönlich zum Pult | Hohe Hemmschwelle, stört den DJ |
| Handy wird auf Heimpartys herumgereicht | Chaotisch, keine faire Reihenfolge |
| Bestehende „Jukebox"-Apps | Oft App-Installation nötig oder kostenpflichtig |

## 3 · Zielsetzung

#### Soll-Zustand

Eine **responsive Webanwendung**, die Gäste ohne Installation per QR-Code beitreten lässt,
Songvorschläge ermöglicht und über ein **Voting-System** demokratisch die Wiedergabe steuert.

#### Ziele

- **Modus 1 (Private Party):** vollautomatische, demokratische Playlist-Steuerung durch die
  Gäste mit automatischer Wiedergabe über Spotify.
- **Modus 2 (Event):** Werkzeug zur Unterstützung des DJs – Songwünsche und Stimmungsbild,
  aber ohne automatischen Eingriff in die Playlist.

#### Nicht-Ziele (Abgrenzung)

- Keine eigene Musikplattform – Katalog und Wiedergabe kommen ausschließlich von Spotify.
- Keine native App (iOS/Android) – ausschließlich Web.
- Kein Ersatz des DJs in Modus 2.

## 4 · Anforderungen

#### Funktionale Anforderungen

| ID | Anforderung | Priorität | Status |
|----|-------------|-----------|--------|
| FA01 | Host meldet sich per Spotify (OAuth 2.0 PKCE) an | Muss | ✅ |
| FA02 | Host erstellt eine private Session mit Titel; System vergibt 6-stellige ID | Muss | ✅ |
| FA03 | System erzeugt & zeigt QR-Code zum Beitritt | Muss | ✅ |
| FA04 | Gast tritt per ID-Eingabe oder QR-Scan bei; ID wird validiert | Muss | ✅ |
| FA05 | Gast vergibt einen Anzeigenamen | Muss | ✅ |
| FA06 | Teilnehmer suchen Songs über die Spotify-Suche | Muss | ✅ |
| FA07 | Teilnehmer fügen Songs zur Warteschlange hinzu | Muss | ✅ |
| FA08 | Teilnehmer bewerten Songs per Up-/Downvote | Muss | ✅ |
| FA09 | Warteschlange sortiert sich nach Score in Echtzeit | Muss | ✅ |
| FA10 | Song wird bei ≥ 40 % Downvotes automatisch entfernt | Muss | ✅ |
| FA11 | Host wählt das Spotify-Wiedergabegerät / Playback-Transfer | Muss | ✅ |
| FA12 | Top-Song wird an Spotify übergeben & als „played" markiert | Muss | ✅ |
| FA13 | Host sieht Teilnehmerliste und kann Gäste sperren | Soll | ✅ |
| FA14 | Host beendet die Session; Gäste werden automatisch entfernt | Soll | ✅ |
| FA15 | Ungültige Routen/Sessions führen auf eine Fehlerseite (404) | Soll | ✅ |
| FA16 | Modus 2: Gäste schlagen dem DJ Songs vor | Soll | 🔧 in Umsetzung |
| FA17 | Genre-/Artist-Analyse der Session | Kann | 🔜 geplant |
| FA18 | Badge-/Rang-System auf Basis des Nutzerverhaltens | Kann | 🔜 geplant |

#### Nicht-funktionale Anforderungen

| ID | Anforderung | Kriterium |
|----|-------------|-----------|
| NF01 | Responsive, mobile-first | Nutzbar auf Smartphone & Desktop |
| NF02 | Keine App-Installation | Läuft im Browser, Beitritt per Link/QR |
| NF03 | Performance | Songvorschlag wird in < 3 s verarbeitet |
| NF04 | Echtzeit | Queue-/Voting-Updates via Supabase Realtime |
| NF05 | Skalierbarkeit | Modus 2 zielt auf bis zu 3.000 gleichzeitige Gäste |
| NF06 | Sicherheit | Host-Aktionen serverseitig auf Rolle geprüft (kein Broken Access Control) |

## 5 · UI-Konzept

Das Design folgt einem dunklen, „Spotify-nahen" Look: tiefschwarze Flächen
(`#070707`), Glas-Karten, **Grün** (`#1ed760`) als Primärakzent und **Violett**
(`#b721ff`) für den Event-Modus. Schriften: *Space Grotesk* (Headlines) und *Inter* (Text).
Mobil gibt es eine schwebende Bottom-Tabbar (Übersicht / Suche).

```text
  WELCOME                  SESSION (HOST)               SESSION (GAST)
 ┌─────────────┐          ┌──────────────────┐        ┌──────────────┐
 │   ◐ upNext  │          │  QR  │  Teilnehmer│        │ Jetzt läuft  │
 │ Session-ID  │          │──────┼────────────│        │  ▶ Song      │
 │ [______][→] │          │ Suche│  Queue     │        │──────────────│
 │             │          │ ┌──┐ │  1. Song ▲▼│        │ Queue        │
 │  PRIVATE    │          │ │  │ │  2. Song ▲▼│        │  1. Song ▲ ▼ │
 │  PARTY      │          │ └──┘ │  3. Song ▲▼│        │  2. Song ▲ ▼ │
 │  EVENT      │          │ Gerät▼  [Beenden] │        │ [◯ Übersicht]│
 └─────────────┘          └──────────────────┘        └──────────────┘
```

Wichtigste Seiten: **Welcome** (Beitritt + Modusauswahl), **Mode1/Mode2-Landing**,
**Set-Name**, **Session-Host** (QR, Suche, Queue, Geräteauswahl, Teilnehmer),
**Session-Member** (Queue + Voting), **Error/404**.

## 6 · Lieferobjekte & Abnahmekriterien

| Lieferobjekt | Abnahmekriterium |
|--------------|------------------|
| Prototyp Modus 1 | FA01–FA12 bestanden (siehe Testprotokoll) |
| Host-Administration | FA13–FA14 bestanden |
| Deployment | App unter `up-next-beta.vercel.app` erreichbar |
| Projektdokumentation | Dokumente 00–08 vollständig |
| Modus 2 (in Umsetzung) | Songwünsche an den DJ + Stimmungsbild (FA16); Genre/Badges (FA17–FA18) als Ausbaustufe |

> Der Prototyp gilt als abgenommen, wenn alle Muss-Anforderungen (FA01–FA12) im
> Testprotokoll als *bestanden* dokumentiert sind.

---

# Technische Dokumentation

## 7 · Architektur

UpNext ist eine **Single-Page-Application** (Angular 21, Standalone Components + Signals).
Es gibt **keinen eigenen Backend-Server**: Das Frontend spricht direkt mit **Supabase**
(PostgreSQL, Realtime, Auto-API) und der **Spotify Web API**. Hosting erfolgt auf **Vercel**.

```text
 ┌────────────────────────────────────────────────────────────┐
 │                      CLIENT (Browser)                       │
 │   Angular 21 SPA · TypeScript · SCSS · angularx-qrcode      │
 │                                                            │
 │   ┌──────────────┐         ┌───────────────────────────┐   │
 │   │ Komponenten  │ ──────▶ │  SupabaseService  (Daten) │   │
 │   │ welcome/     │         │  Spotify         (Player) │   │
 │   │ mode1/ mode2 │         └───────────────┬───────────┘   │
 │   └──────────────┘                         │               │
 └────────────────────────────────────────────┼──────────────┘
                  │                            │
        Realtime  │ HTTPS / WSS                │ HTTPS (OAuth PKCE)
                  ▼                            ▼
      ┌────────────────────────┐   ┌──────────────────────────┐
      │       SUPABASE         │   │     SPOTIFY WEB API       │
      │  PostgreSQL + Realtime │   │  Suche · Player · Devices │
      │  Auto-generierte API   │   │  (@spotify/web-api-ts-sdk)│
      └────────────────────────┘   └──────────────────────────┘
```

**Begründung der Wahl:** Supabase liefert Datenbank, Echtzeit-Subscriptions und eine
fertige API ohne eigenen Serverbetrieb – ideal für ein kleines Team. Spotify übernimmt
Katalog und Wiedergabe, sodass keine eigene Musikinfrastruktur nötig ist.

## 8 · Datenkatalog

#### `private_sessions` — Heimparty-Sessions (Modus 1)

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| session_id (PK) | integer | 6-stellige ID, beginnt mit `1` |
| title | text | Session-Name |
| qrCodeData | text | Beitritts-URL für den QR-Code |
| status | text | `running` / `finished` / `deactivated` |
| active_device_id | text | gewähltes Spotify-Gerät |
| spotify_token | text | Access-Token des Hosts (für Gast-Aktionen) |
| created_at / last_active_at | timestamptz | Erstell- & Aktivitätszeitpunkt |

#### `public_sessions` — Event-Sessions (Modus 2)

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| session_id (PK) | integer | ID, beginnt mit `2` (auto-generiert) |
| event_name | text | Name des Events |
| organicer | text | Veranstalter (Default `upNext`) |
| status | text | Sessionstatus |
| qrCodeData | text | Beitritts-URL |
| created_at / last_active_at | timestamptz | Zeitstempel |

#### `participants` — Teilnehmer

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id (PK) | uuid | Teilnehmer-ID |
| name | text | Anzeigename |
| role | text | `host` / `member` |
| session_id | integer | zugehörige Session |
| joined_at | timestamptz | Beitrittszeit |

#### `songs` — globaler Song-Katalog (Cache)

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| spotify_id (PK) | text | Spotify-Track-URI/ID |
| title / artist / genre | text | Metadaten |
| album_image | text | Cover-URL |
| duration_ms | bigint | Länge in ms |
| sessionId | integer | zuletzt zugeordnete Session |

#### `session_queue` — Warteschlange je Session

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id (PK) | bigint | Queue-Eintrag |
| spotify_id (FK → songs) | text | referenzierter Song |
| suggested_by (FK → participants) | uuid | Vorschlagender |
| session_id | integer | Session |
| score | integer | Summe der Votes |
| status | text | `queued` / `played` / `deleted` |

#### `votes` — Einzelstimmen

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id (PK) | bigint | Stimme |
| queue_id (FK → session_queue) | bigint | bewerteter Queue-Eintrag |
| participant_id (FK → participants) | uuid | Wähler |
| song_id (FK → songs) | text | Song |
| vote | smallint | `+1` (up) / `-1` (down) |

## 9 · Entity-Relationship-Diagramm (ERD)

```text
  ┌──────────────────┐          ┌──────────────────┐
  │ private_sessions │          │  public_sessions │
  │  PK session_id   │          │  PK session_id   │
  └────────┬─────────┘          └─────────┬────────┘
           │ 1                            │ 1
           │      (session_id, logisch)   │
           └──────────────┬───────────────┘
                          │ n
                  ┌───────┴────────┐
                  │  participants  │
                  │   PK id (uuid) │
                  └───┬────────┬───┘
              1       │        │       1
       suggested_by   │        │  participant_id
                      │ n      │ n
              ┌───────┴──────┐ │   ┌──────────┐
              │ session_queue│ └──▶│  votes   │
              │   PK id      │◀────│  PK id   │
              │ FK spotify_id│  n  │ FK queue │
              └──────┬───────┘     │ FK song  │
                  n  │             └────┬─────┘
                     │ FK spotify_id    │ FK song_id
                     ▼                  ▼
                  ┌───────────────────────┐
                  │        songs          │
                  │   PK spotify_id       │
                  └───────────────────────┘
```

**Beziehungen:** Eine Session hat *n* Teilnehmer. Ein Teilnehmer erzeugt *n*
Queue-Einträge (`suggested_by`) und *n* Votes. Ein Queue-Eintrag referenziert genau
einen Song und sammelt *n* Votes. Songs werden global zwischengespeichert.

## 10 · API-Dokumentation

UpNext nutzt keine selbst geschriebene REST-Schicht, sondern die **auto-generierte
Supabase-API** (gekapselt im `SupabaseService`), **Supabase Realtime** und die
**Spotify Web API**. Nachfolgend die genutzten Operationen.

#### Daten-API (`SupabaseService` → PostgreSQL)

| Operation | Tabelle / Aktion | Zweck | Auth |
|-----------|------------------|-------|------|
| `addPrivateSession(title, token)` | `private_sessions` INSERT | Session anlegen | Host |
| `joinPrivateSession(id)` / `joinPublicSession(id)` | SELECT | Existenz prüfen | – |
| `checkIfSessionIsValid(id)` | SELECT | 6-stellige ID validieren | – |
| `getPrivateSessionInfos(id)` | SELECT | Sessiondaten laden | – |
| `addUser(name, sessionId, host)` | `participants` INSERT | Teilnehmer anlegen | – |
| `getUserInfos(id)` | SELECT | eigene Daten | – |
| `getAllParticipantsBySessionId(id)` | SELECT | Teilnehmerliste | Host |
| `checkHost(userId, sessionId)` | SELECT | Rollenprüfung (Access Control) | Host |
| `setParticipantStatus(id, status)` | UPDATE | Gast sperren/entsperren | Host |
| `addSongToQueue(sessionId, song, userId)` | `songs` UPSERT + `session_queue` INSERT | Song vorschlagen | Member |
| `getQueue(sessionId)` | SELECT (join `songs`) | Top-10 nach Score | – |
| `vote(queueId, userId, value)` | `votes` INSERT/UPDATE | Up-/Downvote | Member |
| `markSongAsPlayed(queueId)` | UPDATE `status='played'` | abgespielt markieren | Host |
| `endSession(sessionId)` | UPDATE `status='finished'` | Session beenden | Host |
| `updateActivity(sessionId)` | UPDATE `last_active_at` | Aktivität tracken | – |

#### Realtime (WebSocket)

| Kanal | Tabelle | Event | Zweck |
|-------|---------|-------|-------|
| `queue-{sessionId}` | `session_queue` | `*` (INSERT/UPDATE/DELETE) | Queue & Votes live aktualisieren |

#### Spotify Web API (`Spotify`-Service via SDK)

| Methode | Spotify-Endpunkt | Zweck |
|---------|------------------|-------|
| `login()` | OAuth 2.0 Authorize (PKCE) | Host-Anmeldung |
| `search(q)` | `GET /v1/search?type=track` | Songsuche (Markt AT, 5 Treffer) |
| `getAvailableDevices()` | `GET /v1/me/player/devices` | Geräte des Hosts |
| `transferPlayback(deviceId)` | `PUT /v1/me/player` | Wiedergabe übertragen |
| `getCurrentlyPlaying()` | `GET /v1/me/player/currently-playing` | aktuellen Track lesen |
| `addToQueue(uri, deviceId)` | `POST /v1/me/player/queue` | Song in Spotify-Queue |

#### Frontend-Routen (Angular Router)

| Pfad | Komponente | Zweck |
|------|------------|-------|
| `/welcome` | Welcome | Start, Beitritt, Modusauswahl |
| `/mode1` · `/mode2` | Mode1 / Mode2 | Modus-Landing |
| `/callback` | Host | Spotify-OAuth-Rücksprung |
| `/set-name/:sessionId` | SetName | Namen vergeben |
| `/mode1/session-host/:sessionId` | SessionHost | Host-Ansicht |
| `/mode1/session-member/:sessionId` | SessionMember | Gast-Ansicht |
| `/mode2/session-member/:sessionId` | SessionMemberMode2 | Event-Gast (Platzhalter) |
| `/404` · `**` | Error | Fehlerseite |

## 11 · Setup

Voraussetzungen: **Node.js** (LTS), **npm** sowie Zugangsdaten für Supabase und einen
Spotify-Developer-Client. Details siehe [07_readme-anwendung.md](07_readme-anwendung.md).

```bash
npm install      # Abhängigkeiten installieren
npm start        # Dev-Server (Angular CLI)
npm run build    # Produktionsbuild nach dist/
```

## 12 · Testkonzept

Jede Muss-Anforderung wird mit mindestens einem Testfall abgedeckt. Die Durchführung
und Ergebnisse stehen im [Testprotokoll](06_testprotokoll.md).

| TC | Anforderung | Vorgehen | Erwartetes Ergebnis |
|----|-------------|----------|---------------------|
| TC01 | FA01 | Host klickt „Mit Spotify anmelden" | Login erfolgreich, Profil sichtbar |
| TC02 | FA02 | Host erstellt Session mit Titel | 6-stellige ID (Start `1`), Weiterleitung Host-View |
| TC03 | FA03 | Host-View öffnen | QR-Code mit Beitritts-URL wird angezeigt |
| TC04 | FA04 | Gültige & ungültige ID eingeben | gültig → Beitritt, ungültig → Fehlermeldung |
| TC05 | FA05 | Namen eingeben & bestätigen | Teilnehmer angelegt, Weiterleitung Session |
| TC06 | FA06 | Suchbegriff eingeben | bis zu 5 passende Tracks erscheinen |
| TC07 | FA07 | Song hinzufügen | Song erscheint in der Queue (Score 1) |
| TC08 | FA08 | Up-/Downvote abgeben | Score ändert sich, Reihenfolge passt sich an |
| TC09 | FA09 | Voting aus 2. Browser | Queue aktualisiert sich in Echtzeit |
| TC10 | FA10 | ≥ 40 % der Gäste downvoten | Song verschwindet aus der Queue |
| TC11 | FA11 | Gerät im Dropdown wählen | Wiedergabe wird auf Gerät übertragen |
| TC12 | FA12 | Top-Song läuft auf Spotify | Song wird als `played` markiert |
| TC13 | FA13 | Host sperrt Gast | Gast wird aus der Session entfernt |
| TC14 | FA14 | Host beendet Session | alle Gäste werden weitergeleitet |
| TC15 | FA15 | ungültige URL aufrufen | 404-Seite erscheint |

> **Gefahren bei fehlender Doku:** Ohne API-Übersicht, ERD und Testkonzept würde die
> Schnittstelle zwischen Frontend, Supabase und Spotify ständig umgebaut, die DB-Struktur
> mehrfach geändert und eine Abnahme wäre nicht nachweisbar.
