# README - Anwendung starten

Projekt: UpNext - Musik Voting
Projektteam: Christian Hahnl, Andreas Klehr
Stand: 08.06.2026

Diese Anleitung erklärt, wie die App lokal gestartet wird. Sie wurde auf einem zweiten Rechner
getestet.


## Was ist UpNext

UpNext ist eine Webanwendung für Musik-Voting auf Partys. Der Host startet eine Session und meldet
sich mit Spotify an. Die Gäste treten über einen QR-Code ohne App-Installation bei, schlagen Songs
vor und stimmen darüber ab. Die Warteschlange ordnet sich nach den Stimmen und spielt automatisch
über das Spotify-Gerät des Hosts.


## Voraussetzungen

| Voraussetzung | Hinweis |
|---------------|---------|
| Node.js (Version 20 oder neuer) | inklusive npm, von nodejs.org |
| Moderner Browser | Chrome, Edge oder Firefox |
| Spotify-Premium-Account | nötig für Login und automatische Wiedergabe |
| Aktives Spotify-Gerät | zum Beispiel die Spotify-App auf dem Gerät des Hosts |


## Installation

```
git clone <repository-url>
cd UpNextGit
npm install
```


## Starten

```
npm start
```

Danach im Browser öffnen:

```
http://localhost:4200
```

Hinweis zum Start-Skript: In package.json ist npm start auf "ng serve --host 172.21.57.14" gesetzt,
damit Handys im lokalen Netz per QR-Code beitreten können. Für reine localhost-Nutzung kann
stattdessen "npx ng serve" verwendet werden. Damit Handys beitreten können, muss die Host-IP im
selben WLAN erreichbar sein.


## Erste Schritte (Modus 1)

1. Als Host auf der Startseite eine Session erstellen, mit Spotify anmelden, einen Session-Titel
   eingeben und die Session starten.
2. Den angezeigten QR-Code den Gästen zeigen. In der Host-Ansicht das gewünschte Spotify-Gerät
   auswählen.
3. Als Gast den QR-Code scannen oder die Session-ID auf der Startseite eingeben und einen Namen
   vergeben.
4. In der Lobby Songs suchen, zur Warteschlange hinzufügen und up- oder downvoten.
5. Der höchstbewertete Song wird automatisch über das Spotify-Gerät des Hosts abgespielt.
6. Der Host kann Teilnehmer sperren oder die Session beenden. Beim Beenden werden alle Gäste
   entfernt.


## Konfiguration

| Was | Datei |
|-----|-------|
| Supabase-URL und anon-Key | src/environments/environment.ts |
| Spotify-Client-ID | src/services/spotify.ts |
| Spotify-Redirect-URI | im Spotify-Developer-Dashboard als <origin>/callback eintragen |


## Befehle

| Befehl | Wirkung |
|--------|---------|
| npm start | Entwicklungsserver starten |
| npm run build | Produktions-Build erzeugen (dist/) |
| npm test | Tests mit Vitest ausführen |
| npm run watch | Build im Watch-Modus |


## Fehlerbehebung

| Problem | Lösung |
|---------|--------|
| "Kein aktives Spotify-Gerät gefunden" | Spotify auf einem Host-Gerät öffnen und in der Host-Ansicht auswählen |
| Login schlägt fehl | Redirect-URI im Spotify-Dashboard prüfen (<origin>/callback) |
| Build bricht nach Typ-Regenerierung ab | database.types.ts muss UTF-8 sein, kein UTF-16 durch PowerShell-Umleitung |
| Handy kann nicht beitreten | Host-IP und Port im selben WLAN erreichbar machen, Firewall prüfen |
