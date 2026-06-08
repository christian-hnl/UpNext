# Präsentation / Pitch

Projekt: UpNext - Musik Voting
Vortragende: Christian Hahnl, Andreas Klehr
Publikum: Spotify Technology S.A.
Dauer: 10 bis 15 Minuten
Stand: 08.06.2026


## Aufbau

| Abschnitt | Inhalt | Zeit | Wer |
|-----------|--------|------|-----|
| 1 Problem | Warum gibt es UpNext | 2 min | AK |
| 2 Lösung | Was wurde gebaut | 2 min | CH |
| 3 Live-Demo | Kernfunktionen live | 6 min | CH und AK |
| 4 Ausblick | Was mit mehr Zeit | 2 min | AK |
| 5 Lessons Learned | Was wir gelernt haben | 2 min | CH |


## 1. Problem

- Auf Partys entscheidet meist eine Person über die Musik, der Rest hat keinen Einfluss.
- Gäste bedrängen den DJ, die Stimmung leidet, die Songauswahl trifft die Crowd oft nicht.
- Auslöser waren wiederkehrende Beschwerden über lokale DJs und die schlechte Kommunikation
  zwischen Gästen und DJ.
- Kernfrage: Wie wird die Musikauswahl fair und interaktiv, ohne Chaos?


## 2. Lösung

- UpNext ist eine Webanwendung, mit der alle Gäste über die Playlist mitbestimmen.
- Beitritt per QR-Code, keine App-Installation.
- Gäste schlagen Songs vor und stimmen ab. Die Warteschlange sortiert sich live, der Top-Song läuft
  automatisch über Spotify.
- Zwei Modi: Home Party (Gäste steuern automatisch) und Großevent/Club (Werkzeug für den DJ).
- Technik: Angular im Frontend, Supabase als Echtzeit-Datenbank, Spotify Web API für Musik und
  Wiedergabe.


## 3. Live-Demo

Vorher einen Probelauf machen. Spotify-Gerät offen, zweites Handy bereit, Internet getestet.

Ablauf in Modus 1:

1. Host startet eine Session, meldet sich mit Spotify an, gibt den Titel "Demo-Party" ein, der
   QR-Code erscheint.
2. Host wählt das aktive Spotify-Gerät aus.
3. Ein Gast scannt den QR-Code mit dem Handy, gibt einen Namen ein, die Lobby erscheint.
4. Live einen Song suchen und zur Warteschlange hinzufügen.
5. Vom zweiten Gerät up- und downvoten. Die Queue sortiert sich in Echtzeit auf beiden Geräten.
6. Der Top-Song läuft automatisch über Spotify und verschwindet danach aus der Queue.
7. Einen Teilnehmer sperren, dann die Session beenden. Die Gäste werden automatisch hinausgeworfen.

Backup-Plan: Falls das WLAN streikt, Screenshots oder ein aufgezeichnetes Demo-Video bereithalten.
Es muss auch live etwas geändert werden können.


## 4. Ausblick

- Modus 2 vollständig: Ideenliste und Bewertung als Werkzeug für den DJ, bis zu 3.000 Gäste.
- Automatische Verdrängung von Songs ab einem Downvote-Schwellwert.
- Nutzer-Analyse und Badges: aktive, kritische und wählerische Nutzer erkennen.
- Genre-Analyse: Übersicht, welche Genres gerade beliebt sind.
- Skalierungstests für die 3.000-Nutzer-Anforderung.


## 5. Lessons Learned

- Erst dokumentieren, dann coden. Pflichtenheft und ERD haben spätere Umbauten erspart.
- Externe APIs sind tückisch. Spotify liefert keine Webhooks, daher war eine Polling-Lösung nötig,
  und 204 No Content musste gesondert behandelt werden.
- Realtime lohnt sich. Supabase-Realtime macht die Voting-UX erst überzeugend.
- Scope-Disziplin. Modus 1 sauber fertigzustellen war wichtiger, als Modus 2 halb zu bauen.
- Im 2er-Team parallel arbeiten: Frontend-Logik und Datenbank gleichzeitig.


## Checkliste vor dem Pitch

- [ ] Probelauf der gesamten Demo durchgeführt
- [ ] Spotify-Premium eingeloggt, Wiedergabegerät aktiv
- [ ] Zweites Gerät bereit und im selben Netz
- [ ] Backup-Video oder Screenshots griffbereit
- [ ] Rollen und Zeiten abgestimmt
- [ ] Live-Änderung vorbereitet
