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
blockquote{border-left:3px solid var(--green);background:rgba(30,215,96,.06);margin:1.2em 0;
  padding:.6em 1.1em;border-radius:0 10px 10px 0;color:var(--muted);}
hr{border:none;border-top:1px solid var(--border);margin:2.4em 0;}
ul li::marker{color:var(--green);}
.slide{background:linear-gradient(160deg,#151515,#0c0c0c);border:1px solid var(--border);
  border-radius:18px;padding:22px 26px;margin:18px 0;box-shadow:0 18px 50px -24px rgba(0,0,0,.75);}
.slide h3{margin-top:.2em;}
.slide .num{font-size:.7rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--faint);}
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
  <span class="pill green">Dokument 08</span>
  <span class="pill">Präsentation / Pitch</span>
  <span class="pill violet">10–15 Minuten</span>
</div>

# Abschlusspräsentation

Foliengerüst für den Kunden-Pitch (Spotify Technology S.A.). Dauer **10–15 Minuten**,
inklusive **Live-Demo**. Vor dem Termin **Probelauf** machen – die Demo muss live laufen
und live veränderbar sein.

<div class="slide">
<p class="num">Folie 1 · Titel</p>
<h3>UpNext – Gemeinsam Musik hören</h3>

- Projektteam: **Christian Hahnl** & **Andreas Klehr**
- Aufgabenteilung: **gemeinsam** Supabase, Spotify-Integration & Design-System ·
  **CH** – Suche, Queue & Voting · **AK** – Start-/Beitrittsfluss, Routing, Fehlerseite
- Auftraggeber: **Spotify Technology S.A.**
- Live: `up-next-beta.vercel.app`
</div>

<div class="slide">
<p class="num">Folie 2 · Das Problem</p>
<h3>Auf Partys bestimmt einer die Musik – alle anderen leiden</h3>

- DJ/Gastgeber spielt nur seinen Geschmack.
- Gäste trauen sich nicht ans Pult – hohe Hemmschwelle.
- Auf Heimpartys wird das Handy chaotisch herumgereicht.
- Der DJ weiß nicht, was das Publikum gerade hören will.
</div>

<div class="slide">
<p class="num">Folie 3 · Die Lösung</p>
<h3>Eine Web-App, in der die Gäste demokratisch mitentscheiden</h3>

- Beitritt per **QR-Code** – keine App-Installation.
- Songs **vorschlagen** und per **Up-/Downvote** bewerten.
- **Modus 1 (Private Party):** „autonomer DJ" – Top-Songs laufen automatisch über Spotify,
  stark abgelehnte Songs fliegen raus.
- **Modus 2 (Event):** Werkzeug für den DJ – Songwünsche & Stimmungsbild, DJ behält die Kontrolle.
</div>

<div class="slide">
<p class="num">Folie 4 · Tech-Stack</p>
<h3>Schlank gebaut, ohne eigenen Server</h3>

- **Angular 21** (Standalone + Signals), TypeScript, SCSS
- **Supabase** – PostgreSQL + Realtime (Live-Updates der Queue)
- **Spotify Web API** – Suche & Wiedergabe
- **Vercel** – Hosting · **angularx-qrcode** – Beitritt per QR
</div>

<div class="slide">
<p class="num">Folie 5 · Live-Demo</p>
<h3>Vom QR-Scan bis zum automatisch laufenden Song</h3>

1. Host meldet sich mit Spotify an, erstellt Session → **QR-Code**.
2. Gast scannt, vergibt Namen, **sucht** einen Song, fügt ihn hinzu.
3. Zweiter Gast **votet** → Queue sortiert sich **in Echtzeit** neu.
4. Song mit ≥ 40 % Downvotes **verschwindet** automatisch.
5. Top-Song **läuft** auf dem Spotify-Gerät des Hosts.

> **Backup:** Screenshots/Screen-Recording bereithalten, falls WLAN/Spotify streikt.
</div>

<div class="slide">
<p class="num">Folie 6 · Mit mehr Zeit</p>
<h3>Aktueller Ausbau & Ausblick</h3>

- **Modus 2 (Event)** wird **gerade implementiert** – DJ-Dashboard für bis zu 3.000 Gäste.
- **Genre-/Artist-Analyse**: Was ist gerade beliebt?
- **Badges & Ränge** für aktive, kritische oder wählerische Nutzer.
- Skalierungs- & Last-Tests für Großevents.
</div>

<div class="slide">
<p class="num">Folie 7 · Lessons Learned</p>
<h3>Was wir mitnehmen</h3>

- **Erst dokumentieren, dann coden** – Pflichtenheft & ERD haben Umbauten erspart.
- **Realtime** ist mächtig, aber das Zusammenspiel mit der Spotify-Wiedergabe ist knifflig
  (aktives Gerät nötig).
- **Scope-Disziplin**: Modus 1 sauber fertig statt beide Modi halbfertig.
- Enge Zusammenarbeit an der Kern-Infrastruktur (Pair-Programming) plus parallele
  Einzel-Features war in der kurzen Zeit entscheidend.
</div>

<div class="slide">
<p class="num">Folie 8 · Abschluss</p>
<h3>Danke – Fragen?</h3>

- Demo & Code: `up-next-beta.vercel.app`
- Dokumentation: siehe [Projektübersicht](00_uebersicht.md)
</div>

## Sprecher-Hinweise

- Zeit im Blick behalten: Problem & Lösung kurz, **Demo ist der Star** (~5 Min).
- Eine Änderung **live** machen (z. B. spontan einen Song voten lassen).
- Auf Rückfragen zu Skalierung (Modus 2) und Manipulationsschutz (Voting) vorbereitet sein.
