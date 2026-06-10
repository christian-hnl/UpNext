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
  <span class="pill green">Dokument 07</span>
  <span class="pill">README – Anwendung</span>
  <span class="pill violet">Installation & Start</span>
</div>

# README – UpNext starten

Diese Anleitung erklärt jemandem, der den Code zum ersten Mal sieht, wie er **UpNext**
lokal startet. Mit einem Test auf einem fremden Rechner lässt sich prüfen, ob alles
vollständig ist.

## Was ist UpNext?

UpNext ist eine responsive Web-App, mit der Gäste auf einer Party gemeinsam die Musik
bestimmen: Songs vorschlagen, per Up-/Downvote bewerten und im **Private-Party-Modus**
automatisch über Spotify abspielen lassen.

## Voraussetzungen

| Werkzeug | Version / Hinweis |
|----------|-------------------|
| Node.js | LTS (≥ 20) empfohlen |
| npm | wird mit Node.js installiert |
| Angular CLI | optional global: `npm i -g @angular/cli` |
| Spotify | Account mit **Premium** (für Wiedergabe) |
| Supabase | bestehendes Projekt (Zugang im `environment` hinterlegt) |

## Schnellstart

```bash
# 1. Repository klonen
git clone <repository-url>
cd UpNext

# 2. Abhängigkeiten installieren
npm install

# 3. Entwicklungsserver starten
npm start          # entspricht: ng serve

# 4. Im Browser öffnen
#    http://localhost:4200/welcome
```

> **Hinweis zum `start`-Skript:** In `package.json` ist `start` auf eine feste Host-IP
> gesetzt (`ng serve --host 172.21.57.14`). Zum lokalen Testen genügt stattdessen
> `npx ng serve` (Standard `localhost:4200`) oder `npx ng serve --host 0.0.0.0`, um die
> App auch vom Smartphone im selben WLAN per QR-Code zu erreichen.

## Konfiguration

Die Zugangsdaten liegen in `src/environments/environment.ts` bzw.
`environment.development.ts`:

```ts
export const environment = {
  production: false,
  supabaseUrl: 'https://<projekt>.supabase.co',
  supabaseKey: '<anon-key>'
};
```

Der **Spotify-Client** ist im Service `src/services/spotify.ts` hinterlegt
(`clientId`). Die Redirect-URL wird automatisch aus `window.location.origin + '/callback'`
gebildet – diese URL muss im **Spotify Developer Dashboard** als gültige Redirect-URI
eingetragen sein (z. B. `http://localhost:4200/callback`).

## Build & Tests

```bash
npm run build      # Produktionsbuild nach dist/
npm test           # Unit-Tests (Vitest)
```

#### Datenbanktypen aktualisieren (optional)

```bash
npx supabase login
npx supabase gen types typescript --project-id <project-id> > src/app/database.types.ts
```

## So benutzt man die App

#### Als Host (Private Party)

1. `/welcome` öffnen → **Private Party** wählen.
2. Mit **Spotify** anmelden (öffnet den Spotify-Login).
3. Session-Titel eingeben und Session **erstellen**.
4. Spotify auf einem Gerät öffnen und im Dropdown als Wiedergabegerät wählen.
5. **QR-Code** den Gästen zeigen.

#### Als Gast

1. QR-Code scannen **oder** Session-ID auf `/welcome` eingeben.
2. Namen vergeben.
3. Songs suchen, zur **Warteschlange** hinzufügen und Vorschläge **voten**.

## Projektstruktur (Auszug)

```text
src/
├─ app/
│  ├─ welcome/          Startseite, Beitritt, Modusauswahl
│  ├─ mode1/            Private Party
│  │  ├─ host/          Spotify-Login & Session-Erstellung
│  │  ├─ session-host/  Host-Ansicht (QR, Suche, Queue, Geräte)
│  │  ├─ session-member/Gast-Ansicht
│  │  ├─ search/        Songsuche
│  │  ├─ queuevoting/   Warteschlange + Voting
│  │  └─ qrcode/        QR-Code
│  ├─ mode2/            Event-Modus (Platzhalter)
│  └─ error/            404-Seite
├─ services/
│  ├─ supabase-service.ts   Daten & Realtime
│  └─ spotify.ts            Spotify Web API
├─ schema.sql           DB-Schema (Referenz)
└─ styles.scss          globales Design-System
```

## Troubleshooting

| Problem | Lösung |
|---------|--------|
| „Kein aktives Spotify-Gerät" | Spotify auf einem Gerät öffnen und Wiedergabegerät wählen |
| QR-Code vom Handy nicht erreichbar | Dev-Server mit `--host 0.0.0.0` starten, gleiches WLAN |
| Spotify-Login schlägt fehl | Redirect-URI im Spotify-Dashboard prüfen |
| Suche/Voting reagiert nicht | Browser-Konsole prüfen; Supabase erreichbar? |

## Abschluss-Checkliste

- [x] Alle Pflichtenheft-Kapitel vollständig
- [x] ERD vorhanden ([03_pflichtenheft.md](03_pflichtenheft.md))
- [x] API dokumentiert
- [x] Testprotokoll ausgefüllt ([06_testprotokoll.md](06_testprotokoll.md))
- [x] README getestet (Start auf fremdem Rechner)
