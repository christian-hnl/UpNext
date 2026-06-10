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
table{border-collapse:collapse;width:100%;margin:1.2em 0;font-size:.93rem;
  background:var(--card);border:1px solid var(--border);border-radius:12px;overflow:hidden;}
th{background:#101010;color:var(--muted);text-transform:uppercase;font-size:.72rem;
  letter-spacing:.08em;text-align:left;padding:12px 14px;border-bottom:1px solid var(--border);}
td{padding:11px 14px;border-bottom:1px solid var(--border);color:#d8d8db;vertical-align:top;}
tr:last-child td{border-bottom:none;}
tr:hover td{background:rgba(255,255,255,.025);}
code{background:#0d0d0d;border:1px solid var(--border);border-radius:6px;padding:.12em .45em;
  font-size:.88em;color:var(--green);}
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
  <span class="pill green">Dokument 02</span>
  <span class="pill">Aufwandsschätzung</span>
  <span class="pill violet">T-Shirt-Sizing</span>
</div>

# Aufwandsschätzung

Die Schätzung erfolgt mit der **T-Shirt-Size-Methode**. Jede Anforderung erhält eine Größe
statt einer exakten Stundenzahl. Als Anker (Größe **M**) wurde der Spotify-Login gewählt,
dessen Aufwand aus Erfahrung gut bekannt war. Davon ausgehend wurden die übrigen
Anforderungen relativ geschätzt.

## Richtwerte (einmalig zu Projektbeginn festgelegt)

| Größe | Bedeutung | Richtwert (h) |
|-------|-----------|---------------|
| XS | Triviale Aufgabe, kein nennenswertes Risiko | 1 |
| S | Überschaubar, bekannte Lösung | 4 |
| M | Normaler Arbeitsaufwand, wenig Unbekanntes | 8 |
| L | Komplex, unbekannt oder viel Abstimmung nötig | 16 |
| XL | Sehr groß – muss aufgeteilt werden | 32 |

## Schätzung der umgesetzten Anforderungen (Modus 1)

| Anforderung | Größe | Aufwand (h) |
|-------------|-------|-------------|
| FA01 – Spotify-Login des Hosts (OAuth PKCE) | M | 8 |
| FA02 – Private Session erstellen (Titel, 6-stellige ID) | S | 4 |
| FA03 – QR-Code generieren & anzeigen | S | 4 |
| FA04 – Session beitreten + ID-Validierung | M | 8 |
| FA05 – Namen setzen / Teilnehmer anlegen | S | 4 |
| FA06 – Songsuche über Spotify | M | 8 |
| FA07 – Song zur Warteschlange hinzufügen | M | 8 |
| FA08 – Up-/Downvoting | M | 8 |
| FA09 – Queue nach Score sortieren (Realtime) | L | 16 |
| FA10 – Auto-Entfernen bei 40 % Downvotes | S | 4 |
| FA11 – Wiedergabegerät wählen / Playback-Transfer | M | 8 |
| FA12 – Auto-Play: Top-Song an Spotify + „played" markieren | L | 16 |
| FA13 – Teilnehmerliste & Sperren (Block/Unblock) | M | 8 |
| FA14 – Session beenden (Realtime-Kick) | S | 4 |
| FA15 – Fehlerseite (404) & Routing | S | 4 |
| NF01 – Responsive Design / UI-System | L | 16 |
| NF06 – Broken-Access-Control-Schutz (Host-Check) | S | 4 |
| **Zwischensumme Modus 1** | | **132 h** |

## Schätzung Modus 2 & Ausbaustufe

| Anforderung | Größe | Aufwand (h) | Status |
|-------------|-------|-------------|--------|
| FA16 – Modus 2: Songwünsche an den DJ | L | 16 | in Umsetzung |
| FA17 – Genre-/Artist-Analyse der Session | M | 8 | geplant |
| FA18 – Badge-/Rang-System (Nutzerverhalten) | L | 16 | geplant |
| **Zwischensumme** | | **40 h** | |

## Gesamtaufwand & Kapazitätsabgleich

| Posten | Aufwand |
|--------|---------|
| Umgesetzter Funktionsumfang (Modus 1) | 132 h |
| Modus 2 & Ausbaustufe | 40 h |
| **Gesamt (Vision)** | **172 h** |

**Verfügbare Kapazität:** 2 Personen × ~10 h/Woche × 7 Wochen (KW 18 – KW 24) ≈ **140 h**.

> **Scope-Entscheidung:** Priorität hatte ein vollständiger, abnahmefähiger **Modus 1**
> (132 h). **Modus 2** (FA16, 16 h) wird im Anschluss parallel umgesetzt; **Genre-Analyse
> und Badges** (FA17–FA18) folgen als spätere Ausbaustufe. Modus 1 passt sicher in die
> verfügbaren ~140 h.

## Beachtungspunkte

- Die Größen wurden im Team gemeinsam vergeben; Abweichungen wurden ausdiskutiert.
- Keine XL-Anforderung im Lieferumfang – die größten Brocken (Realtime-Queue, Auto-Play)
  wurden als **L** eingestuft und in Arbeitspakete weiter zerlegt.
- Die Richtwerte (h pro Größe) wurden zu Projektbeginn fixiert und nicht mehr geändert.
