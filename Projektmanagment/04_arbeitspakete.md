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
  <span class="pill green">Dokument 04</span>
  <span class="pill">Arbeitspakete</span>
  <span class="pill violet">Wer · Was · Bis wann</span>
</div>

# Arbeitspakete

Die Arbeitspakete (AP) zerlegen die Projektphasen aus dem Projektauftrag in konkrete,
zuweisbare Aufgaben. Jedes Paket hat **genau eine verantwortliche Person**, einen
Zeitraum und ein **prüfbares Abnahmekriterium**. Sie bilden die Grundlage für das
[Gantt-Diagramm](05_gantt-diagramm.md).

## Team & Kürzel

| Kürzel | Person | Individueller Schwerpunkt |
|--------|--------|---------------------------|
| CH | Christian Hahnl | Songsuche, Warteschlange & Voting-Logik, Auto-Play |
| AK | Andreas Klehr | Start-/Beitrittsfluss (Welcome, Join, Set-Name), Routing & Navigation, Fehlerseite |

**Gemeinsam (50/50):** Supabase-Service & Datenmodell, Spotify-Integration,
Design-System / CSS sowie die Session-Host-Ansicht wurden von beiden zusammen entwickelt
(Pair-Programming). Die Aufteilung ist daher **kein** Frontend/Backend-Schnitt – die
zentrale Infrastruktur tragen beide gemeinsam.

## Übersicht der Arbeitspakete

| AP | Bezeichnung | Verantwortlich | Zeitraum | Meilenstein | Abnahmekriterium |
|----|-------------|----------------|----------|-------------|------------------|
| AP1 | Projektdokumentation (Auftrag, Pflichtenheft) | CH | KW 18 | M1 | Pflichtenheft vom Betreuer freigegeben |
| AP2 | Projekt-Setup (Angular, Supabase, Vercel, Spotify-Client) | CH + AK | KW 18 | M2 | `npm start` läuft, DB & Deployment erreichbar |
| AP3 | Datenmodell & Tabellen anlegen (6 Tabellen, ERD) | CH + AK | KW 18–19 | M2 | Schema in Supabase, ERD entspricht DB |
| AP4 | Design-System & globale UI (Farben, Fonts, Cards) | CH + AK | KW 18–19 | M2 | `styles.scss`/`_variables.scss` umgesetzt |
| AP5 | Spotify-OAuth-Login (PKCE) + Callback | CH + AK | KW 19 | M3 | Host kann sich anmelden, Profil wird geladen |
| AP6 | Session erstellen + QR-Code | CH | KW 19 | M3 | Session mit ID & QR wird angelegt |
| AP7 | Welcome-/Modus-Seiten & Beitritt + Validierung | AK | KW 19–20 | M3 | Gast tritt mit gültiger ID bei |
| AP8 | Set-Name & Teilnehmerverwaltung | AK | KW 20 | M4 | Teilnehmer wird in DB angelegt |
| AP9 | Songsuche (Spotify) + Ergebnisliste | CH | KW 20 | M4 | Suche liefert Tracks im UI |
| AP10 | Warteschlange: Hinzufügen, Anzeige, Realtime-Sort | CH | KW 20–21 | M4 | Queue aktualisiert sich live nach Score |
| AP11 | Voting (Up/Down) + Auto-Remove bei 40 % | CH | KW 21 | M4 | Score & Auto-Entfernen funktionieren |
| AP12 | Wiedergabe: Geräteauswahl, Transfer, Auto-Play | CH + AK | KW 21 | M4 | Top-Song spielt auf Host-Gerät |
| AP13 | Session-Host-Ansicht & Host-Admin (Teilnehmer, Sperren, Beenden, Host-Check) | CH + AK | KW 21 | M4 | Sperren/Beenden wirft Gäste raus; Nicht-Host blockiert |
| AP14 | Routing, Navigationsfluss & Fehlerseite (404) | AK | KW 21–22 | M5 | Ungültige Routen/Sessions landen auf 404 |
| AP15 | Responsives Feintuning & Animationen | CH + AK | KW 22 | M5 | App auf Smartphone & Desktop nutzbar |
| AP16 | Testdurchführung & Testprotokoll | CH + AK | KW 22–23 | M6 | Alle Muss-Tests dokumentiert |
| AP17 | README & Abschlussdoku | AK | KW 23 | M6 | Start auf fremdem Rechner erfolgreich |
| AP18 | Abschlusspräsentation & Probelauf | CH + AK | KW 24 | M7 | Pitch gehalten, Live-Demo läuft |
| AP19 | Modus 2 (Event): Songwünsche an DJ, Stimmungsbild *(in Umsetzung)* | CH + AK | KW 22–24 | M7 | Gäste schlagen dem DJ Songs vor, DJ sieht die Wünsche |

## Abhängigkeiten (Auszug)

- AP3 (Datenmodell) ist Voraussetzung für AP10/AP11 (Queue & Voting).
- AP5/AP6 (Login, Session) sind Voraussetzung für AP9/AP12 (Suche & Wiedergabe).
- AP16 (Tests) setzt voraus, dass AP5–AP14 fertig sind.

> **Hinweis:** **Modus 2 (Event)** wird aktuell aktiv implementiert (parallel zur
> Härtung von Modus 1). **Genre-Analyse und Badges (FA17–FA18)** sind als spätere
> Ausbaustufe vorgesehen und daher hier noch nicht als eigenes Arbeitspaket geführt.

## Beachtungspunkte

- AP mit nur einem Namen kennzeichnen den individuellen Schwerpunkt; die zentrale
  Infrastruktur (Supabase, Spotify, Design-System, Session-Host-Ansicht) wurde
  **gemeinsam** entwickelt und ist mit **CH + AK** ausgewiesen.
- Beide arbeiten bewusst eng zusammen (Pair-Programming an den Kernkomponenten),
  zusätzlich übernimmt jeder eigene Features parallel.
- Jedes Abnahmekriterium ist prüfbar formuliert – kein vages „fertig".
