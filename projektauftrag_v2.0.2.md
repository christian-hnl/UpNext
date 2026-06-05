# Projektauftrag
![logo.png](assets/logo.png)


## Projektbezeichnung
- UpNext - Musik Voting


## Projektauftraggeber
- Spotify Technology S.A.


## Projekthintergrund

#### Sinn und Zweck des Projekts
- Verbesserung des Musikerlebnisses bei Events/Partys unterschiedlicher Größe
- Die Anwendung hat zwei Modi um sowohl kleinere Partys zuhause, als auch professionelle Großevents abzudecken
  - Modus: **private Home Party**
    - bis zu 30 Leute
    - "autonomer DJ"
    - Gäste nehmen aktiv Einfluss auf die Playlist
    - Voting-System bestimmt über Reihenfolge der Songs, sowie Löschen von Songs aus der Warteschlange
    - automatisches Abspielen der Songs über Spotify
  - Modus: **Großevents und Clubs**
    - bis zu 3.000 Leute
    - "Werkzeug für den DJ"
    - Gäste schlagen Songs vor und bewerten die Vorschläge anderer, ohne den DJ physisch zu bedrängen
    - DJ kann sehen welche Genres/Songs Gäste gerade gerne hätten
    - Songs werden hier jedoch nicht automatisch abgespielt, DJ behält weiterhin die volle Kontrolle über die Playlist


#### Projektauslöser
- zunehmende Unzufriedenheit mit lokalen DJs (Patrick Biggs, Bruce)
- häufige Beschwerden über unpassende Songauswahl
- Kommunikationsschwierigkeiten zwischen Gästen und DJs
- Wunsch nach moderner, interaktiver Event-Musiklösung


## Projektendergebnis
#### Welches Ergebnis soll am Projektende vorliegen?
- fertiges Produkt mit zwei Modi
- funktionsfähiges UI
- einfach benutzbare Anwendung

#### Welche messbaren Eigenschaften hat das Endergebnis, damit von einem Projekterfolg gesprochen werden kann?
- mindestens 3.000 Nutzer können gleichzeitig in einer Session sein (Modus2)
- Beitritt in Sessions mit von Host generierten QR-Code
- keine App-Installation notwendig
- Songvorschläge werden in unter 3 Sekunden verarbeitet
- Abstimmungsergebnisse werden korrekt aktualisiert
- fehlerfreier Betrieb während eines Testevents in beiden Modi


## Projektziele

#### Hauptziel
- Mode1: vollautomatisierte, demokratische Steuerung der Playlist auf einer Home-Party durch die Gäste
- Mode2: Tool zur Unterstützung des DJs ohne automatischen Eingriff in die Playlist

#### Nicht-Ziele
- Entwicklung einer eigenen Musikplattform

#### Zielgruppe
- Modus1: private Partys mit bis zu 30 Personen
- Modus2: professionelle Events/Clubs mit bis zu 3.000 Personen und DJs


## Projektbeschreibung

#### Modus1
- Host startet eine Session, die Musik läuft autonom basierend auf den Wünschen der Gäste
  - Beitritt via generierten QR-Code
- interaktive Warteschlange
  - jeder Gast kann Songs hinzufügen
- Nutzer stimmen über die Songs in der Queue ab
  - positiv bewertete Songs werden priorisiert abgespielt
  - Songs ab einer festgelegten Grenze an Downvotes werden automatisch entfernt

#### Modus2
- Gäste können Songs vorschlagen, die in eine Ideen-Liste für den DJ kommen
- vorgeschlagene Songs werden weder automatisch abgespielt noch automatisch entfernt
- DJ sieht die Wünsche der Gäste als Hilfe, behält aber die volle Kontrolle über seine Playlist

#### gemeinsame Features
- Entwicklung einer responsive Webanwendung für Mobile-Geräte (Desktop)
- Entwicklung eines einfachen Analysesystems des Nutzerverhaltens und Abstimmungsverhalten
  - aktive/inaktive/kritische/zustimmende/wählerische/schnelle Nutzer usw. erkennen
  - auf Basis davon vergeben von Badges/Rängen/Abzeichen
  - macht Nutzerverhalten sichtbar und fördert die Aktivität
- Entwicklung einer einfachen Genre-Analyse
  - welche Musikgenres/Artists/Songs sind innerhalb dieser Session insgesamt gerade beliebt/unbeliebt
- Admin Steuerung


## Projektstart
- 28.04.2026
## Projektende
- Ende KW 24


## Projektressourcen
- eigene Hardware (Laptops)
- vorhandene Spotify Premium Abos
- keine geplanten anfallenden Kosten


## Projektrisiken
- Unterschätzen der Komplexität
- Überschreiten der Deadlines
- Probleme/Einschränkungen mit Spotify-API
- Manipulation der Abstimmungen
- klare Trennung der Modi
- Performance: technische Probleme bei hoher gleichzeitiger User-Anzahl (vor allem Modus2)
- geringe Akzeptanz/Nutzung der Anwendung durch Partygäste


## Projektorganisation
- Christian Hahnl
- Andreas Klehr

