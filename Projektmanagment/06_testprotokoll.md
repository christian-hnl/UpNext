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
.ok{color:var(--green);font-weight:700;}
.fail{color:var(--danger);font-weight:700;}
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
  <span class="pill green">Dokument 06</span>
  <span class="pill">Testprotokoll</span>
  <span class="pill violet">Abnahmenachweis</span>
</div>

# Testprotokoll

Dieses Protokoll dokumentiert die Durchführung aller Testfälle aus dem
[Testkonzept](03_pflichtenheft.md) (Kapitel 12). Geprüft wurde der umgesetzte
Funktionsumfang von **Modus 1**. Jeder Testfall enthält das tatsächliche Ergebnis,
Status und Datum.

## Testumgebung

| Eigenschaft | Wert |
|-------------|------|
| Build | Produktionsbuild (`npm run build`) |
| URL | `https://up-next-beta.vercel.app/welcome` |
| Browser | Chrome (Desktop), Safari (iOS), Chrome (Android) |
| Backend | Supabase (PostgreSQL + Realtime) |
| Spotify | Premium-Account des Hosts, aktives Gerät |
| Tester | Christian Hahnl, Andreas Klehr |

## Testfortschritt

| | Anzahl |
|---|---|
| Testfälle gesamt | 15 |
| ✅ Bestanden | 14 |
| ⚠️ Bekannte Einschränkung | 1 |
| ❌ Fehlgeschlagen | 0 |

## Testfälle (Muss-Anforderungen)

| TC | Anf. | Durchführung | Erwartet | Ergebnis | Status | Datum |
|----|------|--------------|----------|----------|--------|-------|
| TC01 | FA01 | „Mit Spotify anmelden" geklickt | Login + Profil | Profil geladen, Anzeige „Angemeldet als …" | <span class="ok">✅</span> | 03.06.2026 |
| TC02 | FA02 | Session „Geburtstag" erstellt | 6-stellige ID (Start `1`), Host-View | ID `1xxxxx`, Weiterleitung korrekt | <span class="ok">✅</span> | 03.06.2026 |
| TC03 | FA03 | Host-View geöffnet | QR-Code mit Beitritts-URL | QR mit `/mode1/session-member/1xxxxx` | <span class="ok">✅</span> | 03.06.2026 |
| TC04 | FA04 | ID `123` (ungültig) & gültige ID | Fehler bzw. Beitritt | ungültig → Fehlermeldung, gültig → Beitritt | <span class="ok">✅</span> | 03.06.2026 |
| TC05 | FA05 | Name „Max" gesetzt | Teilnehmer angelegt | Eintrag in `participants`, Weiterleitung | <span class="ok">✅</span> | 03.06.2026 |
| TC06 | FA06 | Suche „Blinding Lights" | bis 5 Tracks | 5 Treffer mit Cover/Artist | <span class="ok">✅</span> | 04.06.2026 |
| TC07 | FA07 | Track hinzugefügt | Song in Queue, Score 1 | Song erscheint, Score 1 | <span class="ok">✅</span> | 04.06.2026 |
| TC08 | FA08 | Up- dann Downvote | Score & Sortierung ändern sich | Score korrekt, Neusortierung | <span class="ok">✅</span> | 04.06.2026 |
| TC09 | FA09 | Vote aus 2. Browser | Live-Update | Queue aktualisiert sich via Realtime | <span class="ok">✅</span> | 04.06.2026 |
| TC10 | FA10 | 40 % der Gäste downvoten | Song verschwindet | Status `deleted`, aus Queue entfernt | <span class="ok">✅</span> | 05.06.2026 |
| TC11 | FA11 | Gerät im Dropdown gewählt | Playback-Transfer | Wiedergabe auf gewähltes Gerät | <span class="ok">✅</span> | 05.06.2026 |
| TC12 | FA12 | Top-Song läuft auf Spotify | als `played` markiert | Status `played` gesetzt | <span class="ok">✅</span> | 05.06.2026 |
| TC13 | FA13 | Gast gesperrt | Gast fliegt raus | Status `blocked`, Realtime-Kick | <span class="ok">✅</span> | 05.06.2026 |
| TC14 | FA14 | Session beendet (Bestätigung) | alle Gäste raus | Status `finished`, Weiterleitung | <span class="ok">✅</span> | 05.06.2026 |
| TC15 | FA15 | URL `/xyz` aufgerufen | 404-Seite | Fehlerseite mit Hinweis | <span class="ok">✅</span> | 05.06.2026 |

## Bekannte Einschränkungen

| ID | Beschreibung | Auswirkung | Geplante Lösung |
|----|--------------|------------|-----------------|
| E1 | Auto-Play benötigt ein **aktives** Spotify-Gerät des Hosts; ist keines aktiv, erscheint die Meldung „Kein aktives Spotify-Gerät gefunden". | Host muss Spotify einmalig öffnen | Hinweis im UI, automatischer Transfer-Retry vorhanden |
| E2 | Modus 2 (Event) ist aktuell **in Umsetzung** und daher noch nicht abschließend testbar; Genre-Analyse und Badges folgen als Ausbaustufe. | Modus-2-Tests folgen | Testfälle TC16+ nach Fertigstellung ergänzen |

## Fehlermeldungen (Stichprobe)

Geprüft wurde, dass Fehler mit **verständlichen Meldungen** statt technischer Stacktraces
angezeigt werden:

- Ungültige Session-ID → Inline-Fehlermeldung im Beitrittsfeld.
- Kein aktives Gerät → „Bitte starte Spotify auf einem Gerät des Hosts."
- Nicht-Host ruft Host-Route auf → Weiterleitung auf `/welcome` bzw. `/404`.

## Fazit

Alle **Muss-Anforderungen (FA01–FA12)** sowie die Soll-Anforderungen FA13–FA15 wurden
**bestanden**. Damit ist das Abnahmekriterium aus dem Pflichtenheft erfüllt. Die
verbleibenden Punkte (E1/E2) sind dokumentierte, bewusste Einschränkungen.
