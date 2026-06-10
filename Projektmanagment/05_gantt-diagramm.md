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
  <span class="pill green">Dokument 05</span>
  <span class="pill">Gantt-Diagramm</span>
  <span class="pill violet">Zeitplanung</span>
</div>

# Zeitplanung (Gantt-Diagramm)

Der Zeitplan zeigt die Arbeitspakete aus [Dokument 04](04_arbeitspakete.md) als Balken
über die Kalenderwochen **KW 18 bis KW 24** (28.04.2026 – Ende KW 24). Supabase,
Spotify-Integration, Design-System und die Session-Host-Ansicht entstehen **gemeinsam**
(CH + AK); zusätzlich übernimmt jeder eigene Features parallel (CH: Suche/Queue/Voting,
AK: Einstiegs-/Navigationsfluss). Für Tests und Bugfixing ist Puffer eingeplant.

## Meilensteine

| Meilenstein | Ergebnis (überprüfbarer Zustand) | KW |
|-------------|----------------------------------|----|
| **M1** | Pflichtenheft vom Betreuer freigegeben | KW 18 |
| **M2** | Entwicklungsumgebung läuft, DB & Deployment stehen (PoC) | KW 19 |
| **M3** | Login, Session & Beitritt funktionieren | KW 20 |
| **M4** | Alle Muss-Anforderungen (Modus 1) im Frontend implementiert | KW 21 |
| **M5** | Access Control & responsives Design abgeschlossen | KW 22 |
| **M6** | Testprotokoll vollständig ausgefüllt, README getestet | KW 23 |
| **M7** | Abschlusspräsentation gehalten, Projekt abgenommen | KW 24 |

## Gantt (Mermaid)

```mermaid
gantt
    title UpNext – Projektzeitplan (KW 18–24)
    dateFormat  YYYY-MM-DD
    axisFormat  KW %V

    section Planung
    AP1 Dokumentation/Pflichtenheft (CH)   :done, a1, 2026-04-28, 7d
    M1 Pflichtenheft freigegeben           :milestone, m1, 2026-05-01, 0d

    section Setup
    AP2 Projekt-Setup (CH+AK)              :a2, 2026-04-28, 5d
    AP3 Datenmodell & ERD (CH+AK)          :a3, 2026-04-30, 6d
    AP4 Design-System & UI (CH+AK)         :a4, 2026-04-28, 9d
    M2 Umgebung laeuft (PoC)               :milestone, m2, 2026-05-08, 0d

    section Kernfunktionen
    AP5 Spotify-Login (CH+AK)              :a5, 2026-05-05, 4d
    AP6 Session + QR (CH)                  :a6, 2026-05-07, 4d
    AP7 Welcome/Beitritt (AK)              :a7, 2026-05-06, 6d
    M3 Login/Session/Beitritt             :milestone, m3, 2026-05-15, 0d
    AP8 Set-Name/Teilnehmer (AK)           :a8, 2026-05-12, 4d
    AP9 Songsuche (CH)                     :a9, 2026-05-12, 4d
    AP10 Queue + Realtime (CH)             :a10, 2026-05-14, 6d
    AP11 Voting + Auto-Remove (CH)         :a11, 2026-05-18, 4d
    AP12 Wiedergabe/Auto-Play (CH+AK)      :a12, 2026-05-19, 4d
    AP13 Session-Host & Host-Admin (CH+AK) :a13, 2026-05-18, 4d
    M4 Muss-Anforderungen fertig          :milestone, m4, 2026-05-22, 0d

    section Haerten
    AP14 Routing + 404 (AK)                :a14, 2026-05-22, 4d
    AP15 Responsive Feintuning (CH+AK)     :a15, 2026-05-25, 4d
    M5 Sicherheit & Design                :milestone, m5, 2026-05-29, 0d

    section Abschluss
    AP16 Tests & Protokoll (CH+AK)         :a16, 2026-05-29, 6d
    AP17 README & Doku (AK)                :a17, 2026-06-02, 4d
    M6 Tests & README                     :milestone, m6, 2026-06-05, 0d
    AP19 Modus 2 implementieren (CH+AK)    :active, a19, 2026-05-25, 18d
    AP18 Praesentation & Probelauf (CH+AK) :a18, 2026-06-08, 5d
    M7 Praesentation/Abnahme              :milestone, m7, 2026-06-12, 0d
```


## Tipps zur Umsetzung (berücksichtigt)

- **Gemeinsam & parallel:** Supabase, Spotify und Design-System bauen beide zusammen;
  zusätzlich laufen CH-Features (Suche/Queue/Voting) und AK-Features (Einstiegsfluss)
  ab KW 18 parallel. Die Session-Host-Ansicht (AP13) entsteht gemeinsam.
- **Puffer:** Für Tests/Bugfixing sind eigene Pakete (AP16) und KW 22–23 reserviert.
- Meilensteine sind als **abgeschlossene Zustände** formuliert (z. B. „Pflichtenheft
  *freigegeben*"), nicht als Tätigkeit.
