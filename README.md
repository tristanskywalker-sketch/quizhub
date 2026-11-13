# QuizHub v24

## Endringer

- Én faktisk lagret faktabank (`factBank` i `data.js`) – ikke tre separate kopier.
- Geografi, Sport og Allmennquiz henter fra bankens filtre.
- 15 nye, gjennomgåtte spørsmål fra brukerens bilde av 13.11.2026.
- 5–1, Fotballkarriere og Musikkquiz beholder egne datastrukturer.
- Tidligere quizmastermodus og poengtavle er beholdt.
- Pågående faktarunder med gammelt indeksoppsett starter på nytt etter oppgraderingen; lagrede poeng beholdes.

## Online-utfordringer
Denne versjonen innfører **ikke** online-spill. Neste fase er Supabase-drevet, asynkron utfordringsmodus. Åpne svar kan da rettes mot godkjente svarformer og etternavn; lignende navn som Irak/Iran skal ikke gi feilaktig godkjenning.

## Oppdatering
Last opp filene i denne mappen til eksisterende GitHub-repository for QuizHub. Render publiserer fra repositoryet.

## Retting av åpne svar
`answer-check.js` inneholder et testet, regelbasert utgangspunkt for automatisk godkjenning av etternavn og mindre stavefeil (Washington og Daar es salaam godkjennes; Iran/Irak skilles). Denne modulen brukes **ikke** i den eksisterende papirquiz-modusen. Online-utfordringer krever egen server-side svarkontroll for å holde fasit skjult.
