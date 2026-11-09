# QuizHub v14 – større Geografi Fun Facts-bank

Bygger på QuizHub v13, med eksisterende quizmoduser, nivåvalg, tilfeldig trekking og spørsmålhistorikk bevart.

## Nytt
- Geografi Fun Facts er utvidet fra 207 til **343 spørsmål** (+136).
- Alle 136 nye spørsmål har `question`, `answer`, `fact` og eksplisitt `difficulty`.
- Nytt utvalg: 39 enkle, 80 middels og 17 vanskelige spørsmål.
- Innhold fra flagg og hovedsteder til elver, øyer, geografiske særtrekk og steder i verden.
- Service worker-cache er oppdatert til `quizhub-v14`, slik at gamle filer ikke blir hengende igjen etter deploy.

## Installer
1. Pakk ut ZIP-filen.
2. Last opp **filene inni ZIP-filen** til roten i eksisterende GitHub-repository `quizhub`.
3. Commit changes. Render Static Site publiserer vanligvis automatisk.
4. Hvis gammel versjon vises, last siden på nytt med Ctrl+Shift+R eller lukk/åpne den installerte appen.

## Merknader
Spørsmålene er redaksjonelt utarbeidet. Det er kontrollert at JavaScript kan importeres og at antallet og nivåmerkingen er riktig. Ikke alle geografiske påstander er verifisert mot eksterne kilder, og full UI-nettlesertest er ikke utført.
