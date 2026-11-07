# QuizHub v9

Oppdatert fra v8. Nytt i v9:

- Familiequiz (70 % enkle, 30 % middels), vanlig quiz (30/50/20) og ekspertquiz (0/30/70) for **Allmennquiz, Geografi og Sportsquiz**.
- De nåværende 202 spørsmålene i disse tre bankene er forhåndsklassifisert. Nivåene er skjønnsmessige og kan justeres.
- Tilfeldige runder på 5/10/15/20 eller alle, uten gjentakelser innen én runde. Små banker eller uttømming av nivå kan gi avvik fra ønsket nivåfordeling.
- Fotballkarriere viser nå stiliserte draktikoner med klubbnavn og piler i stedet for en ren vertikal klubbliste. Dette er illustrerte drakter, ikke offisielle klubblogoer, og er ikke en eksakt kopi av det gamle prosjektet.
- Ingen nasjonalitetskategorier i Fotballkarriere.
- Alle 6 quiztyper, poeng og quizkveld er beholdt.

## Publisering
Pakk ut filene og last opp **innholdet** til roten av samme GitHub-repository. Render Static Site: publish directory `.`; ingen build nødvendig. Service worker bruker ny cache-versjon.

## Fremtidige importer
Nye spørsmål merkes med `difficulty: 'easy'`, `'medium'` eller `'hard'` på hvert spørsmål. Alle eksisterende nivåer ligger i `difficultyByIndex` i `data.js` (1-baserte indekser), og beholder foreløpig indeksrekkefølgen fra v8.
