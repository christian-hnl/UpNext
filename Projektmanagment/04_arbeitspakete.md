<div align="center">

# 🎵 UpNext — Musik Voting
### Schritt 4 · Arbeitspakete

</div>

|  |  |
|---|---|
| **Projekt** | UpNext – Musik Voting |
| **Dokument** | Arbeitspakete |
| **Version** | 1.0 |
| **Datum** | 06.05.2026 |
| **Autoren** | Christian Hahnl · Andreas Klehr |
| **Status** | Freigegeben |

---

## 1. Grundsätze

- Jedes Arbeitspaket (AP) hat **genau eine verantwortliche Person**.
- Jedes AP hat ein **prüfbares Abnahmekriterium** (kein vages „fertig").
- Jedes AP ist einem **Meilenstein** zugeordnet (siehe [Gantt-Diagramm](05_gantt-diagramm.md)).
- Kürzel: **CH** = Christian Hahnl · **AK** = Andreas Klehr.

## 2. Übersicht der Arbeitspakete

| AP | Bezeichnung | Verantw. | Zeitraum | Meilenstein |
|----|-------------|:--------:|----------|:-----------:|
| AP01 | Projektsetup (Angular, Repo, Supabase-Projekt) | CH | KW 18 | M2 |
| AP02 | Datenbankschema & TypeScript-Typen | AK | KW 18–19 | M3 |
| AP03 | Spotify-Authentifizierung (OAuth/PKCE) | CH | KW 19 | M2 |
| AP04 | Session erstellen + QR-Code-Generierung | AK | KW 19–20 | M4 |
| AP05 | Beitritt & Namenseingabe (Set-Name, Welcome) | CH | KW 20 | M4 |
| AP06 | Songsuche über Spotify | AK | KW 20–21 | M4 |
| AP07 | Warteschlange & Voting-Logik | CH | KW 21 | M4 |
| AP08 | Echtzeit-Synchronisation (Supabase Realtime) | AK | KW 21–22 | M4 |
| AP09 | Automatische Wiedergabe & Geräteauswahl | CH | KW 22 | M5 |
| AP10 | Admin: Teilnehmer sperren & Session beenden | AK | KW 22 | M5 |
| AP11 | Modus 2 – Konzept & Grundgerüst *(Ausblick)* | CH | KW 22–23 | M5 |
| AP12 | Fehlerbehandlung (Toast, GlobalErrorHandler) | AK | KW 22 | M5 |
| AP13 | Responsives Design & Styling | CH | KW 20–23 | M5 |
| AP14 | Tests & Testprotokoll | AK | KW 23 | M6 |
| AP15 | Projektmanagement-Dokumentation | CH | KW 18–24 | M6 |
| AP16 | Abschlusspräsentation & Probelauf | CH + AK | KW 24 | M7 |

## 3. Detailbeschreibung

### AP01 · Projektsetup
- **Verantwortlich:** CH · **Zeitraum:** KW 18 · **Meilenstein:** M2
- **Inhalt:** Angular-21-Projekt aufsetzen, Git-Repository anlegen, Supabase-Projekt erstellen,
  Abhängigkeiten (`@supabase/supabase-js`, `@spotify/web-api-ts-sdk`, `angularx-qrcode`) installieren.
- **Abnahmekriterium:** `npm install` und `npm start` laufen fehlerfrei; leere App ist im Browser erreichbar.

### AP02 · Datenbankschema & Typen
- **Verantwortlich:** AK · **Zeitraum:** KW 18–19 · **Meilenstein:** M3
- **Inhalt:** Tabellen `private_sessions`, `public_sessions`, `participants`, `songs`,
  `session_queue`, `votes` mit Beziehungen anlegen; `database.types.ts` generieren.
- **Abnahmekriterium:** Alle Tabellen aus dem Datenkatalog existieren; Typen kompilieren ohne Fehler.

### AP03 · Spotify-Authentifizierung
- **Verantwortlich:** CH · **Zeitraum:** KW 19 · **Meilenstein:** M2
- **Inhalt:** OAuth-2.0-PKCE-Flow, Callback-Route, Token-Handling, Profilabruf.
- **Abnahmekriterium:** Host kann sich mit Spotify anmelden; Profilname wird angezeigt.

### AP04 · Session erstellen + QR-Code
- **Verantwortlich:** AK · **Zeitraum:** KW 19–20 · **Meilenstein:** M4
- **Inhalt:** Session mit Titel anlegen, Session-ID nach Konvention erzeugen, QR-Code rendern.
- **Abnahmekriterium:** Nach „Session starten" existiert ein scanbarer QR-Code mit Beitritts-URL.

### AP05 · Beitritt & Namenseingabe
- **Verantwortlich:** CH · **Zeitraum:** KW 20 · **Meilenstein:** M4
- **Inhalt:** Welcome-Seite (Session-ID), Set-Name-Seite, Teilnehmer anlegen, Modus-Erkennung.
- **Abnahmekriterium:** Gast tritt per ID/QR + Name bei und landet in der korrekten Lobby.

### AP06 · Songsuche
- **Verantwortlich:** AK · **Zeitraum:** KW 20–21 · **Meilenstein:** M4
- **Inhalt:** Suchfeld mit Debounce, Spotify-Search-Aufruf, Ergebnisliste mit Cover & Dauer.
- **Abnahmekriterium:** Suche liefert in < 3 s Treffer; bereits in der Queue befindliche Songs sind markiert.

### AP07 · Warteschlange & Voting
- **Verantwortlich:** CH · **Zeitraum:** KW 21 · **Meilenstein:** M4
- **Inhalt:** Song zur Queue hinzufügen, Up-/Downvote, Score-Berechnung, Top-10-Sortierung.
- **Abnahmekriterium:** Votes verändern den Score; Queue ist absteigend sortiert; 1 Stimme pro Person/Song.

### AP08 · Echtzeit-Synchronisation
- **Verantwortlich:** AK · **Zeitraum:** KW 21–22 · **Meilenstein:** M4
- **Inhalt:** Supabase-Realtime-Abos auf `session_queue` und `participants`.
- **Abnahmekriterium:** Änderungen auf einem Gerät erscheinen live auf einem zweiten Gerät.

### AP09 · Automatische Wiedergabe & Geräteauswahl
- **Verantwortlich:** CH · **Zeitraum:** KW 22 · **Meilenstein:** M5
- **Inhalt:** Geräteliste laden, Wiedergabe übertragen, Songs in die Spotify-Queue legen,
  gespielte Songs per Polling entfernen.
- **Abnahmekriterium:** Top-Song wird automatisch auf dem gewählten Gerät abgespielt und danach entfernt.

### AP10 · Admin-Funktionen
- **Verantwortlich:** AK · **Zeitraum:** KW 22 · **Meilenstein:** M5
- **Inhalt:** Teilnehmer sperren/entsperren, Session beenden (Realtime-Rauswurf).
- **Abnahmekriterium:** Gesperrter/entfernter Teilnehmer verliert sofort den Zugriff.

### AP11 · Modus 2 (Ausblick)
- **Verantwortlich:** CH · **Zeitraum:** KW 22–23 · **Meilenstein:** M5
- **Inhalt:** Route, Grundgerüst und Konzept der Ideenliste für den DJ (ohne Auto-Wiedergabe).
- **Abnahmekriterium:** Modus-2-Route erreichbar; Konzept im Pflichtenheft dokumentiert.

### AP12 · Fehlerbehandlung
- **Verantwortlich:** AK · **Zeitraum:** KW 22 · **Meilenstein:** M5
- **Inhalt:** Toast-Komponente, `NotificationService`, globaler Error-Handler.
- **Abnahmekriterium:** Fehler erzeugen eine verständliche, automatisch verschwindende Meldung.

### AP13 · Responsives Design
- **Verantwortlich:** CH · **Zeitraum:** KW 20–23 · **Meilenstein:** M5
- **Inhalt:** Mobile-first SCSS, Spotify-Farbschema, einheitliche Karten/Buttons.
- **Abnahmekriterium:** Alle Hauptscreens sind auf dem Smartphone ohne horizontales Scrollen bedienbar.

### AP14 · Tests & Testprotokoll
- **Verantwortlich:** AK · **Zeitraum:** KW 23 · **Meilenstein:** M6
- **Inhalt:** Vitest-Tests, manuelle Durchführung aller Testfälle, Protokollierung.
- **Abnahmekriterium:** Testprotokoll vollständig ausgefüllt, alle Muss-Tests bestanden oder als Einschränkung dokumentiert.

### AP15 · Dokumentation
- **Verantwortlich:** CH · **Zeitraum:** KW 18–24 (laufend) · **Meilenstein:** M6
- **Inhalt:** Auftrag, Pflichtenheft, Arbeitspakete, Gantt, README.
- **Abnahmekriterium:** Abschluss-Checkliste vollständig abgehakt.

### AP16 · Abschlusspräsentation
- **Verantwortlich:** CH + AK · **Zeitraum:** KW 24 · **Meilenstein:** M7
- **Inhalt:** Pitch-Aufbau, Live-Demo vorbereiten, Probelauf.
- **Abnahmekriterium:** Probelauf erfolgreich; Live-Demo läuft in Modus 1.

---

<div align="center">

*UpNext — Musik Voting · Arbeitspakete · Version 1.0 · 06.05.2026*

</div>
