# Arbeitspakete

Projekt: UpNext - Musik Voting
Projektteam: Christian Hahnl, Andreas Klehr
Stand: 06.05.2026


## Grundsätze

- Jedes Arbeitspaket hat genau eine verantwortliche Person.
- Jedes Arbeitspaket hat ein prüfbares Abnahmekriterium.
- Jedes Arbeitspaket ist einem Meilenstein zugeordnet (siehe Gantt-Diagramm).

Kürzel: CH = Christian Hahnl, AK = Andreas Klehr.


## Übersicht

| AP | Bezeichnung | Verantw. | Zeitraum | Meilenstein |
|----|-------------|----------|----------|-------------|
| AP01 | Projektsetup (Angular, Repo, Supabase) | CH | KW 18 | M2 |
| AP02 | Datenbankschema und Typen | AK | KW 18-19 | M3 |
| AP03 | Spotify-Authentifizierung (OAuth/PKCE) | CH | KW 19 | M2 |
| AP04 | Session erstellen und QR-Code | AK | KW 19-20 | M4 |
| AP05 | Beitritt und Namenseingabe | CH | KW 20 | M4 |
| AP06 | Songsuche über Spotify | AK | KW 20-21 | M4 |
| AP07 | Warteschlange und Voting | CH | KW 21 | M4 |
| AP08 | Echtzeit-Synchronisation | AK | KW 21-22 | M4 |
| AP09 | Automatische Wiedergabe und Geräteauswahl | CH | KW 22 | M5 |
| AP10 | Admin: Teilnehmer sperren, Session beenden | AK | KW 22 | M5 |
| AP11 | Modus 2 Grundgerüst (Ausblick) | CH | KW 22-23 | M5 |
| AP12 | Fehlerbehandlung (Toast, Error-Handler) | AK | KW 22 | M5 |
| AP13 | Responsives Design und Styling | CH | KW 20-23 | M5 |
| AP14 | Tests und Testprotokoll | AK | KW 23 | M6 |
| AP15 | Projektdokumentation | CH | KW 18-24 | M6 |
| AP16 | Abschlusspräsentation und Probelauf | CH, AK | KW 24 | M7 |


## Details

### AP01 Projektsetup
Verantwortlich: CH, Zeitraum: KW 18, Meilenstein: M2
Angular-Projekt aufsetzen, Git-Repository anlegen, Supabase-Projekt erstellen, Abhängigkeiten
installieren.
Abnahme: npm install und npm start laufen fehlerfrei, leere App ist im Browser erreichbar.

### AP02 Datenbankschema und Typen
Verantwortlich: AK, Zeitraum: KW 18-19, Meilenstein: M3
Tabellen private_sessions, public_sessions, participants, songs, session_queue und votes mit
Beziehungen anlegen, database.types.ts generieren.
Abnahme: Alle Tabellen existieren, die Typen kompilieren ohne Fehler.

### AP03 Spotify-Authentifizierung
Verantwortlich: CH, Zeitraum: KW 19, Meilenstein: M2
OAuth-2.0-PKCE-Flow, Callback-Route, Token-Handling, Profilabruf.
Abnahme: Host kann sich mit Spotify anmelden, der Profilname wird angezeigt.

### AP04 Session erstellen und QR-Code
Verantwortlich: AK, Zeitraum: KW 19-20, Meilenstein: M4
Session mit Titel anlegen, Session-ID nach Konvention erzeugen, QR-Code anzeigen.
Abnahme: Nach dem Starten existiert ein scanbarer QR-Code mit Beitritts-URL.

### AP05 Beitritt und Namenseingabe
Verantwortlich: CH, Zeitraum: KW 20, Meilenstein: M4
Welcome-Seite, Set-Name-Seite, Teilnehmer anlegen, Modus-Erkennung.
Abnahme: Gast tritt per ID/QR und Name bei und landet in der richtigen Lobby.

### AP06 Songsuche
Verantwortlich: AK, Zeitraum: KW 20-21, Meilenstein: M4
Suchfeld mit Debounce, Spotify-Suche, Ergebnisliste mit Cover und Dauer.
Abnahme: Suche liefert in unter 3 Sekunden Treffer, bereits eingereihte Songs sind markiert.

### AP07 Warteschlange und Voting
Verantwortlich: CH, Zeitraum: KW 21, Meilenstein: M4
Song zur Queue hinzufügen, Up- und Downvote, Score-Berechnung, Top-10-Sortierung.
Abnahme: Votes verändern den Score, die Queue ist sortiert, eine Stimme pro Person und Song.

### AP08 Echtzeit-Synchronisation
Verantwortlich: AK, Zeitraum: KW 21-22, Meilenstein: M4
Supabase-Realtime-Abos auf session_queue und participants.
Abnahme: Änderungen auf einem Gerät erscheinen live auf einem zweiten Gerät.

### AP09 Automatische Wiedergabe und Geräteauswahl
Verantwortlich: CH, Zeitraum: KW 22, Meilenstein: M5
Geräteliste laden, Wiedergabe übertragen, Songs in die Spotify-Queue legen, gespielte Songs
per Polling entfernen.
Abnahme: Top-Song wird automatisch auf dem gewählten Gerät abgespielt und danach entfernt.

### AP10 Admin-Funktionen
Verantwortlich: AK, Zeitraum: KW 22, Meilenstein: M5
Teilnehmer sperren und entsperren, Session beenden.
Abnahme: Gesperrter oder entfernter Teilnehmer verliert sofort den Zugriff.

### AP11 Modus 2 (Ausblick)
Verantwortlich: CH, Zeitraum: KW 22-23, Meilenstein: M5
Route, Grundgerüst und Konzept der Ideenliste für den DJ ohne Auto-Wiedergabe.
Abnahme: Modus-2-Route erreichbar, Konzept im Pflichtenheft dokumentiert.

### AP12 Fehlerbehandlung
Verantwortlich: AK, Zeitraum: KW 22, Meilenstein: M5
Toast-Komponente, NotificationService, globaler Error-Handler.
Abnahme: Fehler erzeugen eine verständliche, automatisch verschwindende Meldung.

### AP13 Responsives Design
Verantwortlich: CH, Zeitraum: KW 20-23, Meilenstein: M5
Mobile-first SCSS, einheitliche Karten und Buttons, Spotify-Farbschema.
Abnahme: Alle Hauptseiten sind auf dem Smartphone ohne horizontales Scrollen bedienbar.

### AP14 Tests und Testprotokoll
Verantwortlich: AK, Zeitraum: KW 23, Meilenstein: M6
Vitest-Tests, manuelle Durchführung aller Testfälle, Protokollierung.
Abnahme: Testprotokoll vollständig ausgefüllt, alle Muss-Tests bestanden oder als Einschränkung
dokumentiert.

### AP15 Dokumentation
Verantwortlich: CH, Zeitraum: KW 18-24 (laufend), Meilenstein: M6
Auftrag, Pflichtenheft, Arbeitspakete, Gantt, README.
Abnahme: Abschluss-Checkliste vollständig abgehakt.

### AP16 Abschlusspräsentation
Verantwortlich: CH und AK, Zeitraum: KW 24, Meilenstein: M7
Pitch aufbauen, Live-Demo vorbereiten, Probelauf.
Abnahme: Probelauf erfolgreich, Live-Demo läuft in Modus 1.
