# Aufwandsschätzung

Projekt: UpNext - Musik Voting
Projektteam: Christian Hahnl, Andreas Klehr
Verfahren: T-Shirt-Size-Methode
Stand: 30.04.2026


## Methode

Die Schätzung erfolgt mit der T-Shirt-Size-Methode. Jede Anforderung bekommt eine Größe statt
einer genauen Stundenzahl. Als bekannter Anker dient FA01 (Spotify-Login) mit Größe M. Davon
ausgehend wurden die anderen Aufwände geschätzt.

Die Richtwerte wurden einmal zu Projektbeginn festgelegt und danach nicht mehr verändert.

| Größe | Bedeutung | Richtwert (h) |
|-------|-----------|---------------|
| XS | Triviale Aufgabe, kein nennenswertes Risiko | 2 |
| S | Überschaubar, bekannte Lösung | 4 |
| M | Normaler Arbeitsaufwand, wenig Unbekanntes | 8 |
| L | Komplex oder viel Abstimmung nötig | 16 |
| XL | Sehr groß, muss aufgeteilt werden | 32 |


## Vorgehen

1. Alle Anforderungen aus dem Projektauftrag auflisten
2. Im Team jede Anforderung mit einer Größe versehen, bei Abweichungen diskutieren
3. Stunden je Größe aufaddieren
4. Mit der verfügbaren Kapazität vergleichen, Scope bei Bedarf anpassen


## Ergebnis

### Funktionale Anforderungen

| ID | Anforderung | Größe | Aufwand (h) |
|------|-------------|-------|-------------|
| FA01 | Spotify-Login (OAuth 2.0 / PKCE) | M | 8 |
| FA02 | Session erstellen und QR-Code erzeugen | M | 8 |
| FA03 | Session beitreten (ID/QR und Namenseingabe) | S | 4 |
| FA04 | Songsuche über Spotify | M | 8 |
| FA05 | Song zur Warteschlange hinzufügen | M | 8 |
| FA06 | Voting (Up- und Downvote) | M | 8 |
| FA07 | Queue nach Score sortieren | S | 4 |
| FA08 | Gespielte Songs automatisch entfernen | M | 8 |
| FA09 | Automatische Wiedergabe und Geräteauswahl | L | 16 |
| FA10 | Teilnehmer sperren und entsperren | S | 4 |
| FA11 | Session beenden | S | 4 |
| FA12 | Echtzeit-Synchronisation | L | 16 |
| FA13 | Modus 2 Ideenliste (Ausblick) | M | 8 |
| FA14 | Nutzer- und Genre-Analyse, Badges (Ausblick) | L | 16 |
| | Zwischensumme | | 120 |

### Übergreifende Anforderungen

| ID | Anforderung | Größe | Aufwand (h) |
|------|-------------|-------|-------------|
| INF01 | Projektsetup (Angular, Supabase, Schema) | M | 8 |
| NF01 | Responsives Design und Styling | L | 16 |
| NF02 | Tests und Testprotokoll | M | 8 |
| DOK01 | Projektmanagement-Dokumentation | M | 8 |
| | Zwischensumme | | 40 |


## Gesamtaufwand

| | |
|---|---|
| Geschätzter Gesamtaufwand | rund 152 h |
| Verfügbare Kapazität (2 Personen, 7 Wochen, ca. 14 h/Woche) | rund 196 h |
| Puffer für Tests und Bugfixing | rund 44 h |

Der Scope passt. Bei etwa 196 h Kapazität und 152 h geschätztem Aufwand bleibt genug Puffer für
Tests und Unvorhergesehenes. Die beiden Ausblick-Features (FA13, FA14) sind als Nice-to-have
eingeplant und werden bei Zeitknappheit nach hinten gereiht.


## Beachte

- XL-Anforderungen wurden bewusst vermieden. Größere Brocken wie Realtime-Sync und Auto-Wiedergabe
  wurden in L-Pakete aufgeteilt.
- Die Größen wurden im Team gemeinsam vergeben. Abweichungen haben Unklarheiten aufgedeckt.
