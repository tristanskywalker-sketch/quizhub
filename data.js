export const quizzes=[
 {id:'country',name:'Gjett landet',emoji:'🌍',subtitle:'Ledetråder og synkende poeng',color:'mint'},
 {id:'career',name:'Fotballkarriere',emoji:'⚽',subtitle:'Klubbene avslører spilleren',color:'violet'},
 {id:'music',name:'Musikkquiz',emoji:'🎵',subtitle:'Låt og oppfølgingsspørsmål',color:'pink'},
 {id:'general',name:'Allmennquiz',emoji:'🧠',subtitle:'Fire svaralternativer',color:'amber'}
];
export const questions={
 country:[
  {answer:'Portugal',clues:['Landet ligger i Europa.','Landet har kyst mot Atlanterhavet.','Hovedstaden er Lisboa.']},
  {answer:'Japan',clues:['Landet ligger i Asia.','Landet består av mange øyer.','Hovedstaden er Tokyo.']},
  {answer:'Canada',clues:['Landet ligger i Nord-Amerika.','Landet har både engelsk og fransk som offisielle språk.','Hovedstaden er Ottawa.']},
  {answer:'Marokko',clues:['Landet ligger i Afrika.','Landet har kyst mot både Atlanterhavet og Middelhavet.','Hovedstaden er Rabat.']},
  {answer:'Argentina',clues:['Landet ligger i Sør-Amerika.','Landet er kjent for tango og fotball.','Hovedstaden er Buenos Aires.']}
 ],
 career:[
  {answer:'Erling Braut Haaland',category:'Norske spillere',clues:['Bryne','Molde','Red Bull Salzburg','Borussia Dortmund','Manchester City']},
  {answer:'Martin Ødegaard',category:'Norske spillere',clues:['Strømsgodset','Real Madrid','Heerenveen (lån)','Vitesse (lån)','Real Sociedad (lån)','Arsenal']},
  {answer:'Gareth Bale',category:'Britiske spillere',clues:['Southampton','Tottenham','Real Madrid','Tottenham (lån)','Los Angeles FC']},
  {answer:'Mario Götze',category:'Tyske spillere',clues:['Borussia Dortmund','Bayern München','Borussia Dortmund','PSV','Eintracht Frankfurt']},
  {answer:'Harry Kane',category:'Engelske spillere',clues:['Tottenham','Leyton Orient (lån)','Millwall (lån)','Norwich (lån)','Leicester (lån)','Bayern München']}
 ],
 music:[
  {answer:'ABBA – Dancing Queen',question:'Hvilket land representerte gruppen i Eurovision i 1974?',options:['Sverige','Norge','Danmark','Finland'],correct:0,spotify:'https://open.spotify.com/search/ABBA%20Dancing%20Queen'},
  {answer:'Oasis – Wonderwall',question:'Hvilket tiår ble denne sangen utgitt?',options:['1980-tallet','1990-tallet','2000-tallet','2010-tallet'],correct:1,spotify:'https://open.spotify.com/search/Oasis%20Wonderwall'},
  {answer:'a-ha – Take On Me',question:'Hvilket land kommer bandet fra?',options:['Sverige','Storbritannia','Norge','Nederland'],correct:2,spotify:'https://open.spotify.com/search/a-ha%20Take%20On%20Me'},
  {answer:'Britney Spears – ...Baby One More Time',question:'Hvilket år ble singelen først utgitt?',options:['1995','1998','2001','2004'],correct:1,spotify:'https://open.spotify.com/search/Britney%20Spears%20Baby%20One%20More%20Time'}
 ],
 general:[
  {question:'Hva er hovedstaden i Australia?',options:['Sydney','Canberra','Melbourne','Perth'],correct:1},
  {question:'Hvilket grunnstoff har det kjemiske symbolet Fe?',options:['Fluor','Fosfor','Jern','Francium'],correct:2},
  {question:'Hvor mange spillere er det på banen for ett fotballag ved vanlig elleverfotball?',options:['9','10','11','12'],correct:2},
  {question:'Hvilken planet er nærmest solen?',options:['Venus','Merkur','Mars','Jorden'],correct:1},
  {question:'Hvem skrev romanen «Sult»?',options:['Knut Hamsun','Henrik Ibsen','Sigrid Undset','Tarjei Vesaas'],correct:0}
 ]
};
