# QuizHub v3

**Seks quiztyper:** 5–1 (Kjendiser, Geografi, Fotball, Blandet), Geografi (fun facts), Allmennquiz (åpne svar), Sportsquiz (åpne svar), Fotballkarriere (kategorier), Musikkquiz.

Spill én quiz eller lag quizkveld med felles poengtavle. Manuell poengføring og skjult fasit. Data lagres lokalt i nettleseren, med samme nøkkel som tidligere v1/v2, slik at eksisterende poeng og spillere ikke automatisk slettes. Spørsmålene er et startutvalg, ikke komplett import fra eldre prosjekter.

## Oppdatere GitHub og Render

1. Pakk ut ZIP-filen.
2. Åpne eksisterende GitHub-repository `quizhub` og last opp/erstatt filene i rotmappen (der `index.html` ligger).
3. Commit. Render Static Site bør deploye automatisk. `Publish Directory` er `.` og `Build Command` kan stå tomt.
4. Last siden på nytt etter deploy. Service Worker-cache er oppdatert til versjon 3.

Obs: Gamle quizer som var i gang, kan måtte velges på nytt etter oppdateringen. QuizHub synkroniserer ikke poeng på tvers av enheter.
