# QuizHub

Mobilvennlig quiz-app med enkeltquiz og quizkveld (felles poengtavle).

## Publiser på Render
1. Pakk ut ZIP-filen og last opp innholdet til et nytt GitHub-repository.
2. Opprett **New > Web Service** i Render og koble til repositoryet.
3. Velg **Node** som runtime.
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. Deploy. Åpne den HTTPS-adressen Render tildeler.

Du kan også kjøre appen lokalt med `npm start` (http://localhost:3000).

## Installere som app
Åpne nettsiden i Chrome på Android og velg «Legg til på startskjermen» eller «Installer app» i nettlesermenyen.

## Innhold
- `data.js`: Quiztyper og eksempelspørsmål. Legg til spørsmål her.
- `app.js`: Spillstyring, spillerregistrering, fasit og resultater.
- `style.css`: Utseende.
- `manifest.webmanifest`, `sw.js`, `icon.svg`: PWA/installasjon.

## Viktig
Dette er en førsteversjon med eksempeldata, ikke en import av dine komplette tidligere prosjekter. Spotify-åpning er en ekstern lenke (ikke integrert avspilling). Resultatene lagres lokalt i nettleseren på én enhet (localStorage), ikke i en serverdatabase. Rydding av nettleserdata kan slette poengene. Quizmaster legger inn poengene manuelt.
