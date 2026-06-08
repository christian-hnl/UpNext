# Testprotokoll

Projekt: UpNext - Musik Voting
Getestet von: Christian Hahnl, Andreas Klehr
Stand: 07.06.2026


## Testumgebung

| | |
|---|---|
| Browser | Chrome / Edge (aktuelle Version) |
| Geräte | Desktop und 2 Smartphones (für Realtime-Tests) |
| Datenbank | Supabase (PostgreSQL mit Realtime) |
| Spotify | Premium-Account mit aktivem Wiedergabegerät |
| Build | Angular-Dev-Server (npm start) |
| Automatisierte Tests | Vitest (npm test) |


## Überblick

| Status | Anzahl |
|--------|--------|
| Bestanden | 12 |
| Bestanden mit Einschränkung | 1 |
| Offen (Ausblick) | 1 |
| Fehlgeschlagen | 0 |


## Manuelle Testfälle

| TC | Anforderung | Beschreibung | Erwartet | Ergebnis | Datum |
|----|-------------|--------------|----------|----------|-------|
| TC01 | FA01 | Host meldet sich mit Spotify an | Login ok, Profil geladen | bestanden | 02.06.2026 |
| TC02 | FA02 | Session mit Titel erstellen | Session-ID und QR-Code | bestanden | 02.06.2026 |
| TC03 | FA03 | Beitritt per Session-ID und Name | Gast in richtiger Lobby | bestanden | 03.06.2026 |
| TC04 | FA04 | Songsuche Bohemian Rhapsody | Treffer in unter 3 s | bestanden | 03.06.2026 |
| TC05 | FA05 | Song zur Queue hinzufügen | Song erscheint mit Score 1 | bestanden | 03.06.2026 |
| TC06 | FA06 | Up- und Downvote abgeben | Score ändert sich, 1 Stimme/Person | bestanden | 04.06.2026 |
| TC07 | FA07 | Queue nach Score sortieren | Höchster Score oben (Top 10) | bestanden | 04.06.2026 |
| TC08 | FA08 | Gespielten Song entfernen | Laufender Song verlässt die Queue | bestanden | 04.06.2026 |
| TC09 | FA09 | Auto-Wiedergabe auf gewähltem Gerät | Top-Song wird abgespielt | bestanden | 05.06.2026 |
| TC10 | FA11 | Session beenden | Mitglieder werden hinausgeworfen | bestanden | 05.06.2026 |
| TC11 | FA12 | Realtime über 2 Geräte | Änderung live auf Gerät B | bestanden | 05.06.2026 |
| TC12 | FA10 | Teilnehmer sperren | Gesperrter Gast verliert Zugriff | bestanden | 05.06.2026 |
| TC13 | NF05 | Nicht-Host ruft Host-URL auf | Weiterleitung auf 404 | bestanden | 06.06.2026 |
| TC14 | FA16 | Fehler (kein aktives Gerät) | Verständliche Fehlermeldung | bestanden | 06.06.2026 |
| TC15 | FA13 | Downvote-Verdrängung am Schwellwert | Song wird automatisch entfernt | mit Einschränkung | 06.06.2026 |
| TC16 | FA14 | Modus 2 Ideenliste / Analyse | DJ sieht bewertete Vorschläge | offen | - |


## Automatisierte Tests (Vitest)

Zu den Hauptkomponenten und Services gibt es Spec-Dateien, unter anderem app, host, queuevoting,
search, session-host, session-member, set-name, welcome, notification.service, toast und error.

Ausführung mit:

```
npm test
```

Die Tests prüfen das korrekte Erzeugen der Komponenten sowie zentrale Service-Logik wie
Benachrichtigungen und Voting.


## Bekannte Einschränkungen

| ID | Beschreibung | Umgang |
|----|--------------|--------|
| TC15 / FA13 | Songs werden nicht automatisch entfernt, wenn sie eine Downvote-Grenze erreichen. Negativ bewertete Songs sinken nur im Ranking ab, der Host kann sie manuell entfernen. | Als bekannte Einschränkung dokumentiert. Automatische Verdrängung ist als Folgefeature geplant. |
| TC16 / FA14 | Modus 2 (Ideenliste für den DJ) und die Nutzer- und Genre-Analyse sind konzipiert, aber noch nicht funktional umgesetzt. | Konzept im Pflichtenheft festgehalten, Umsetzung in einer Folgeiteration. |
| Spotify 204 | Beim Hinzufügen zur Spotify-Queue liefert Spotify gelegentlich 204 No Content, was der SDK-Deserializer als Fehler interpretiert. | Im Spotify-Service abgefangen und als Erfolg behandelt. |


## Fazit

Alle Muss-Anforderungen für Modus 1 sind umgesetzt und bestanden. Eine Kann-Anforderung
(automatische Downvote-Verdrängung) ist als bekannte Einschränkung dokumentiert, Modus 2 und die
Analyse-Features sind als Ausblick gekennzeichnet. Der Prototyp gilt damit als abnahmebereit.
