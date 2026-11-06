# QuizHub v2 — 5–1 quiz og Kjendiser

Enkeltquiz og quizkveld med felles poengtavle. Quizformene er Gjett landet, Fotballkarriere, Musikkquiz, Allmennquiz og 5–1. I 5–1 finnes kategoriene Kjendiser, Geografi, Fotball og Blandet.

## Oppdater på GitHub / Render Static Site
1. Last ned og pakk ut ZIP-filen.
2. Åpne det **eksisterende** GitHub-repositoryet `quizhub` (ikke lag et nytt).
3. Last opp filene fra ZIP-filen i **roten** av repoet og **erstatt** eksisterende filer med samme navn. Commit endringene.
4. Render Static Site vil normalt publisere endringen automatisk fra `main`. Behold Publish Directory `.`. Det er ikke behov for `yarn install` eller Node-server.
5. Hvis gammel versjon fortsatt vises, last siden på nytt eller lukk og åpne installert app.

## Spilleregler 5–1
- Velg kategori. Hvert spørsmål har fem ledetråder med 5, 4, 3, 2 og 1 poeng.
- Når en spiller vil svare, trykker quizmaster «Lås svar» ved spillerens navn. Spilleren skriver svaret privat på papir, eller sier det til quizmaster uten at de andre hører.
- Poengnivået kan ikke endres for den spilleren i dette spørsmålet.
- Vis fasit når alle er klare; gi poeng med nedtrekkslisten hvis svaret er riktig (ellers 0). Klikk «Lagre poeng og neste».

## Begrensninger
Spillere og poeng lagres bare i denne nettleseren (localStorage). Startspørsmålene er håndlagde eksempler, ikke hele databasene fra de opprinnelige quizene. Spotify åpnes som ekstern lenke.
