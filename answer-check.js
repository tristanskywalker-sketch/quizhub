// QuizHub v24: deterministisk retting til bruk i senere asynkrone utfordringer.
// Ingen nettverks- eller AI-kall. Fasit må ikke sendes til spilleren før innlevering.
const clean = value => String(value ?? '')
  .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('nb')
  .replace(/[’'`´.,!?()\[\]{}:;\-–—]/g, ' ')
  .replace(/[^\p{L}\p{N}\s]/gu, '')
  .replace(/\s+/g, ' ').trim();
function distance(a, b) {
  const prev = Array.from({length:b.length+1},(_,i)=>i);
  for(let i=1;i<=a.length;i++) {
    const row = [i];
    for(let j=1;j<=b.length;j++) row[j] = Math.min(row[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));
    for(let j=0;j<row.length;j++) prev[j]=row[j];
  }
  return prev[b.length];
}
export function checkOpenAnswer(question, supplied) {
  const input = clean(supplied);
  if (!input) return {status:'incorrect',reason:'Tomt svar'};
  const official = String(question?.answer ?? '').replace(/\s*\([^)]*\)/g, '').trim();
  const variants = [official,...(question?.acceptedAnswers || [])];
  // Kortformer kan registreres eksplisitt, for eksempel Man Utd.
  for (const variant of variants) {
    const standard = clean(variant);
    if (input === standard) return {status:'correct',reason:'Godkjent svarvariant'};
  }
  // I personspørsmål godtar vi etternavn selv om flere kan ha det samme etternavnet.
  const asksPerson = /^(hvem|hvilken (person|forfatter|artist|politiker|skuespiller|spiller|president|fotballspiller|mann|kvinne))\b/i.test(String(question?.question??''));
  if (asksPerson && !question?.disableSurname) {
    for (const variant of variants) {
      const words = clean(variant).split(' ');
      if(words.length >= 2 && input === words[words.length-1]) return {status:'correct',reason:'Etternavn godkjent'};
    }
  }
  // Svært restriktiv feilstaving: ingen automatisk omtolkning av korte landnavn.
  for(const variant of variants) {
    const standard = clean(variant);
    const a=input.replace(/ /g,'');
    const b=standard.replace(/ /g,'');
    const min=Math.min(a.length,b.length);
    const maxEdits=min>=14?2:min>=9?1:0;
    if(maxEdits && distance(a,b)<=maxEdits) return {status:'correct',reason:'Ubetydelig stavefeil'};
  }
  if(input.replace(/ /g,'').length <= 5) return {status:'incorrect',reason:'Kort svar stemmer ikke med fasit'};
  return {status:'review',reason:'Ikke automatisk godkjent; kan vurderes manuelt'};
}
