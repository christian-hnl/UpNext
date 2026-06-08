# Zeitplanung (Gantt-Diagramm)

Projekt: UpNext - Musik Voting
Projektteam: Christian Hahnl, Andreas Klehr
Stand: 06.05.2026


## Meilensteine

Meilensteine sind überprüfbare Zwischenergebnisse, also abgeschlossene Zustände und keine
Tätigkeiten.

| Meilenstein | Ergebnis | KW |
|-------------|----------|-----|
| M1 | Pflichtenheft vom Betreuer freigegeben | KW 19 |
| M2 | Entwicklungsumgebung läuft (Angular, Supabase, Spotify-PoC) | KW 20 |
| M3 | Datenbank vollständig, Schema und Realtime einsatzbereit | KW 20 |
| M4 | Modus-1-Kernfunktionen umgesetzt (Session, Beitritt, Suche, Queue, Voting, Sync) | KW 22 |
| M5 | Auto-Wiedergabe, Admin-Funktionen und Design fertig | KW 23 |
| M6 | Testprotokoll vollständig ausgefüllt | KW 23 |
| M7 | Abschlusspräsentation gehalten, Projekt abgenommen | KW 24 |


## Zeitachse (Kalenderwochen 2026)

| KW | Zeitraum | Schwerpunkt |
|----|----------|-------------|
| KW 18 | 27.04 - 03.05 | Projektstart, Setup, Schema |
| KW 19 | 04.05 - 10.05 | Pflichtenheft, Auth |
| KW 20 | 11.05 - 17.05 | Session, Beitritt, Suche |
| KW 21 | 18.05 - 24.05 | Queue, Voting, Realtime |
| KW 22 | 25.05 - 31.05 | Wiedergabe, Admin, Modus 2 |
| KW 23 | 01.06 - 07.06 | Design, Tests, Bugfixing |
| KW 24 | 08.06 - 14.06 | Abnahme und Präsentation |


## Gantt-Diagramm

```mermaid
gantt
    title UpNext Projektzeitplan
    dateFormat YYYY-MM-DD
    axisFormat KW%V

    section Planung
    Projektsetup (AP01)            :done, a1, 2026-04-28, 5d
    DB-Schema und Typen (AP02)     :done, a2, 2026-04-28, 9d
    Pflichtenheft                  :done, a3, 2026-04-29, 9d
    M1 Pflichtenheft freigegeben   :milestone, m1, 2026-05-08, 0d

    section Grundlagen
    Spotify-Auth PKCE (AP03)       :done, b1, 2026-05-04, 5d
    M2 Dev-Umgebung laeuft         :milestone, m2, 2026-05-11, 0d
    M3 Datenbank fertig            :milestone, m3, 2026-05-11, 0d

    section Modus 1 Kern
    Session und QR (AP04)          :done, c1, 2026-05-11, 7d
    Beitritt und Name (AP05)       :done, c2, 2026-05-13, 5d
    Songsuche (AP06)               :done, c3, 2026-05-14, 7d
    Queue und Voting (AP07)        :done, c4, 2026-05-18, 6d
    Realtime-Sync (AP08)           :done, c5, 2026-05-20, 8d
    M4 Kernfunktionen fertig       :milestone, m4, 2026-05-29, 0d

    section Ausbau
    Auto-Wiedergabe (AP09)         :done, d1, 2026-05-25, 6d
    Admin-Funktionen (AP10)        :done, d2, 2026-05-25, 5d
    Modus 2 Geruest (AP11)         :active, d3, 2026-05-27, 8d
    Fehlerbehandlung (AP12)        :done, d4, 2026-05-25, 4d
    Responsives Design (AP13)      :done, d5, 2026-05-11, 24d
    M5 Ausbau und Design fertig    :milestone, m5, 2026-06-05, 0d

    section Abschluss
    Tests und Protokoll (AP14)     :active, e1, 2026-06-01, 7d
    Dokumentation (AP15)           :active, e2, 2026-04-28, 47d
    M6 Testprotokoll fertig        :milestone, m6, 2026-06-07, 0d
    Praesentation (AP16)           :f1, 2026-06-08, 5d
    M7 Abnahme und Praesentation   :milestone, m7, 2026-06-12, 0d
```


## Hinweise

- Im 2er-Team laufen Frontend-Logik (CH) und Datenbank/Realtime (AK) weitgehend parallel. Das ist
  an den überlappenden Balken erkennbar.
- KW 23 ist als Puffer für Tests und Bugfixing eingeplant.
- Design (AP13) und Dokumentation (AP15) laufen projektbegleitend über mehrere Wochen.
- Die Meilensteine sind als Zustände formuliert, zum Beispiel "Pflichtenheft freigegeben" und nicht
  "Pflichtenheft schreiben".
