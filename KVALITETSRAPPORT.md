# QuizHub v22 – kvalitetsrevisjon (11.11.2026)

Gjennomgåtte kildeoppføringer: 1494. Strukturkontroll for alle seks quiztyper; redaksjonell inspeksjon med regler for svaret-i-spørsmålet, duplikater og svake formuleringer. Fasit er **ikke** eksternt verifisert for alle spørsmål.

## Resultater

- geography: 432 før → 405 etter (27 fjernet)
- career: 43 før → 43 etter (0 fjernet)
- music: 24 før → 24 etter (0 fjernet)
- general: 862 før → 821 etter (41 fjernet)
- sports: 89 før → 81 etter (8 fjernet)
- fiveone: 44 før → 44 etter (0 fjernet)

Endringslogg: 76 fjerninger og 24 reviderte spørsmål.

61 spørsmål flagget for mulig ytterligere faktakontroll (automatisk forsiktighetsfilter, mange kan være helt riktige). 0 spørsmål har et svar som også er tekstlig til stede i spørsmålet, inkludert enkelte legitime sammenligningsspørsmål.

## Bekreftede kilder ved ekstern stikkprøve

- NOAA, Exxon Valdez, Prince William Sound, 24. mars 1989: https://incidentnews.noaa.gov/incident/6683
- Michelin-guide Tokyo 2026: https://www.michelin.com/en/publications/products-and-services/the-michelin-guide-tokyo-2026
- MLB 2026 World Series: https://www.mlb.com/news/brewers-beat-rays-game-5-win-2026-world-series

## Hva kvalitetssjekken omfatter og ikke omfatter

- Alle oppføringer er maskinelt kontrollert for struktur, manglende svar, identiske spørsmål og enkle tegn på ledetråd som røper fasit.
- Mange konkrete gjentakelser, lurespørsmål og banale formuleringer er fjernet eller forbedret.
- Utvalgte historiske og tidsbundne opplysninger er eksternt kontrollert. Det er **ikke** forsvarlig å hevde at hver fasit er uavhengig bekreftet; se `KREVER_FAKTASJEKK.csv` for en prioritert videre liste.
- Appen beholder seks quiztyper, nivåvalg, tilfeldig trekking og historikk. Redigerte spørsmål vil kunne få ny historikk fordi identiteten er knyttet til spørsmålsteksten.
- Databasen har unike ID-er, og identiske spørsmål som vises i fagquiz og allmennquiz får den samme ID-en.
