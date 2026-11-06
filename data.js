export const quizzes=[
 {id:'country',name:'Gjett landet',emoji:'🌍',subtitle:'Ledetråder og synkende poeng',color:'mint'},
 {id:'career',name:'Fotballkarriere',emoji:'⚽',subtitle:'Klubbene avslører spilleren',color:'violet'},
 {id:'music',name:'Musikkquiz',emoji:'🎵',subtitle:'Låt og oppfølgingsspørsmål',color:'pink'},
 {id:'general',name:'Allmennquiz',emoji:'🧠',subtitle:'Fire svaralternativer',color:'amber'},
 {id:'fiveone',name:'5–1 quiz',emoji:'🔎',subtitle:'Fem ledetråder – fra 5 til 1 poeng',color:'cyan'}
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
 ,fiveone:[
  {category:'Kjendiser',answer:'Leonardo DiCaprio',clues:['Jeg ble født i California i 1974.','Jeg startet som barneskuespiller og fikk en Oscar-nominasjon for What’s Eating Gilbert Grape.','Jeg har spilt hovedroller i filmer regissert av Martin Scorsese.','Jeg vant Oscar for beste mannlige hovedrolle for The Revenant.','Jeg spilte Jack i Titanic.']},
  {category:'Kjendiser',answer:'Adele',clues:['Jeg ble født i London i 1988.','Jeg slo gjennom med et album oppkalt etter alderen min.','Albumene mine heter blant annet 19, 21, 25 og 30.','Jeg synger låten Rolling in the Deep.','Jeg synger Hello og Someone Like You.']},
  {category:'Kjendiser',answer:'Dwayne Johnson',clues:['Jeg ble født i California i 1972.','Jeg var profesjonell wrestler før jeg ble filmstjerne.','Jeg har medvirket i flere filmer i Fast & Furious-serien.','Jeg spiller i Jumanji: Welcome to the Jungle.','Jeg er kjent under kallenavnet The Rock.']},
  {category:'Kjendiser',answer:'Taylor Swift',clues:['Jeg ble født i Pennsylvania i 1989.','Jeg startet musikkarrieren innen country.','Jeg har gitt ut album med navnene Red og 1989.','Jeg er kjent for å spille inn nye versjoner merket Taylor’s Version.','Jeg synger Shake It Off og Blank Space.']},
  {category:'Kjendiser',answer:'Gordon Ramsay',clues:['Jeg ble født i Skottland i 1966.','Jeg er kjent innen et yrke som krever mye arbeid på kjøkkenet.','Jeg har drevet restauranter med Michelin-stjerner.','Jeg har ledet TV-programmet Hell’s Kitchen.','Jeg er en britisk kjendiskokk kjent for et temperamentsfullt TV-image.']},
  {category:'Geografi',answer:'Island',clues:['Dette landet ligger i Europa.','Landet har ingen landgrenser mot andre land.','Landet ligger på den midtatlantiske ryggen.','Geotermisk energi og vulkaner er viktige kjennetegn.','Hovedstaden er Reykjavík.']},
  {category:'Geografi',answer:'Nepal',clues:['Dette landet ligger i Asia.','Landet har ingen kyst.','Landet grenser til både India og Kina.','Landets flagg er ikke firkantet.','Mount Everest ligger på grensen mellom dette landet og Kina.']},
  {category:'Geografi',answer:'New Zealand',clues:['Dette landet ligger på den sørlige halvkule.','Det er en øystat i Stillehavet.','Landet har to store hovedøyer, Nordøya og Sørøya.','Filmeningen av Ringenes herre-trilogien foregikk her.','Hovedstaden er Wellington.']},
  {category:'Fotball',answer:'Erling Braut Haaland',clues:['Jeg er født i Leeds i 2000.','Min far spilte profesjonell fotball i England.','Jeg spilte for Molde før jeg flyttet til Østerrike.','Jeg scoret mange mål for Borussia Dortmund.','Jeg er norsk spiss i Manchester City.']},
  {category:'Fotball',answer:'Lionel Messi',clues:['Jeg er født i Rosario i 1987.','Jeg har spilt profesjonell klubbfotball i Spania, Frankrike og USA.','Jeg spilte lenge sammen med Xavi og Andrés Iniesta.','Jeg vant VM i fotball med Argentina i 2022.','Jeg er kjent for draktnummer 10 og mange år i Barcelona.']},
  {category:'Fotball',answer:'Mario Götze',clues:['Jeg ble født i 1992 i Tyskland.','Jeg spilte for både Borussia Dortmund og Bayern München.','Jeg gikk videre til PSV i Nederland i 2020.','Jeg scoret i VM-finalen mot Argentina i 2014.','Jeg avgjorde VM-finalen i 2014 med et mål i ekstraomgangene.']}
 ]

};
