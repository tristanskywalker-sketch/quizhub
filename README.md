# QuizHub v26 – Firebase-innlogging og online-utfordringer

Dette er **nettsidepakken**. Den viderefører papirquiz/quizmaster fra v25 og bytter online-innlogging fra Supabase til **Firebase Authentication**. Utfordringer og lukket fasit håndteres av en egen **Cloudflare Worker + D1** (gratisnivåer, under kvotene). Den separate serverpakken heter `QuizHub-v26-server.zip` og **må IKKE publiseres i Render**.

## Oppsett – anbefalt rekkefølge

1. Åpne https://console.firebase.google.com/ og opprett et prosjekt (Spark/free).
2. Under **Build → Authentication → Sign-in method** aktiver **Email/Password**. E-postbekreftelse kreves av serveren. Under **Authentication → Settings → Authorized domains** legg til `quizhub-tjhh.onrender.com` (og eventuelt ditt eget domene).
3. Under **Project settings → Your apps → Add app → Web** registrer QuizHub-webappen. Finn `firebaseConfig`. Kopier `apiKey`, `authDomain`, `projectId`, `appId` til nettsidens `config.js`.
4. Pakk ut **serverpakken** lokalt på PC (ikke i GitHub-mappen som Render serverer). Følg `README-SERVER.md`: opprett Cloudflare-konto, D1-database og deploy Worker. Sett samme Firebase projectId i `wrangler.toml`.
5. Kopier Worker-adressen som ser ut som `https://quizhub-online.DITT-NAVN.workers.dev` til `ONLINE_API_URL` i `config.js`. Husk å bruke din egen faktiske adresse.
6. **Publiser bare innholdet i denne nettsidepakken** til GitHub-repoet som er koblet til Render. Av hensyn til cache kan det være nødvendig å oppdatere fanen/lukke installert PWA og åpne på nytt.
7. Opprett to testkontoer med separate e-poster (din og Olas), bekreft e-posten, velg brukernavn. Lag en utfordring, inviter den andre via brukernavn eller kode og test begge innleveringene.

## Innstillinger

Nettsidefilen `config.js` inneholder **bare offentlige Firebase-webverdier og Cloudflare Worker URL**. Firebase web API key er ikke en hemmelig servernøkkel. Legg **aldri** inn service-account JSON eller Cloudflare tokens i denne filen.

`ALLOWED_ORIGIN` i serverens `wrangler.toml` må samsvare med adressen din (som standard `https://quizhub-tjhh.onrender.com`). Dersom du bruker egen domeneløsning, oppdater adressen før deploy.

## Hva er implementert?

- Firebase e-post/passord-konto, e-postbekreftelse og varig innlogging.
- Unike brukernavn, invitasjon via brukernavn eller lenke/kode (kan invitere flere).
- Samme 5, 10, 15 eller 20 spørsmål i Sport, Geografi eller Allmenn; felles frist på 24, 48 eller 72 timer.
- Lagring av svarutkast **lokalt på enheten**; innsending én gang.
- Regelbasert serverretting av åpne svar med etternavn og forsiktig stavefeiltoleranse.
- Når alle har levert, eller når fristen utløper, vises fasit, svar og poengtavle.
- Tvilsvar kan manuelt godkjennes/avvises av oppretteren etter at utfordringen er avsluttet.

**Ikke implementert:** Pushvarsler, AI-basert vurdering eller synkronisering av uferdige svar mellom enheter. Invitasjon oppdages i Mine utfordringer eller via lenke.

**Viktig begrensning:** Den eksisterende offline/papirquiz-modusen har fortsatt fasit i den offentlige filen `data.js`. Den nye Worker-en skjuler fasit i online-API-et fram til avslutning, men teknisk kyndige spillere kan finne de samme svarene i denne offentlige filen. Dette er **ikke en jukssikker konkurranseløsning** før papirquizens faktadata/fasiter også flyttes til et tilgangskontrollert område. Til vennequiz basert på tillit kan den brukes etter praktisk testing.

## Teknisk sikkerhet og teststatus

Worker validerer Firebase ID-tokenets signatur, prosjekt, utløp og bekreftet e-post. D1 er tilgjengelig bare for Worker-en, som kontrollerer medlemskap før spørsmål og resultater returneres. Ingen service-account-nøkkel trengs. Serverbasert spørsmålskatalog leveres som **separat serverpakke** for ikke å eksponere serverens private spørsmålsfil på Render.

Kode og SQL er kontrollert lokalt for syntaks. Det er ikke utført ende-til-ende-test mot en virkelig Firebase-/Cloudflare-konto, siden den krever brukerkontoer og dine prosjektverdier.
