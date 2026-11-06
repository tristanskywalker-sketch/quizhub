export const quizzes=[
 {id:'fiveone',name:'5–1 quiz',emoji:'🔎',subtitle:'Fem ledetråder – 5 til 1 poeng'},
 {id:'geography',name:'Geografi',emoji:'🌍',subtitle:'Fun facts, flagg og rekorder'},
 {id:'general',name:'Allmennquiz',emoji:'🧠',subtitle:'Vanlige spørsmål uten svaralternativer'},
 {id:'sports',name:'Sportsquiz',emoji:'🏆',subtitle:'Sport og idrett – åpne spørsmål'},
 {id:'career',name:'Fotballkarriere',emoji:'⚽',subtitle:'Klubbene avslører spilleren'},
 {id:'music',name:'Musikkquiz',emoji:'🎵',subtitle:'Låt og oppfølgingsspørsmål'}
];
export const questions={
 geography:[
  {question:'Hvilket land har verdens eneste nasjonalflagg som ikke er rektangulært eller kvadratisk?',answer:'Nepal',fact:'Nepals flagg består av to trekantede vimpler.'},
  {question:'Hvilket lands nasjonalflagg har verken rødt, hvitt eller blått i seg?',answer:'Jamaica',fact:'Flagget er grønt, gull og svart.'},
  {question:'Hvilket land har flest tidssoner dersom oversjøiske territorier regnes med?',answer:'Frankrike',fact:'Frankrikes oversjøiske områder strekker seg over mange tidssoner.'},
  {question:'Hva heter verdens største øy som ikke regnes som et kontinent?',answer:'Grønland',fact:'Australia regnes som kontinent og er derfor ikke med i denne sammenligningen.'},
  {question:'Hvilke to land deler verdens lengste internasjonale landegrense?',answer:'Canada og USA',fact:'Grensen strekker seg fra Atlanterhavet til Stillehavet og langs Alaska.'},
  {question:'Hvilken europeisk hovedstad ligger ved elven Tiber?',answer:'Roma',fact:'Tiber renner gjennom Italias hovedstad.'},
  {question:'Hvilket land er helt omsluttet av Sør-Afrika?',answer:'Lesotho',fact:'Lesotho er en enklave innenfor Sør-Afrika.'},
  {question:'Hvilket land har hovedstaden Ulaanbaatar?',answer:'Mongolia',fact:'Mongolia ligger mellom Russland og Kina.'},
  {question:'Hva heter verdens dypeste innsjø?',answer:'Bajkalsjøen (Baikal)',fact:'Innsjøen ligger i Sibir i Russland.'},
  {question:'Hvilket land har en sedertrefigur midt på flagget?',answer:'Libanon',fact:'Sedertreet har stor symbolsk betydning for landet.'},
  {question:'Hvilken hovedstad ligger på øya Sjælland?',answer:'København',fact:'København ligger hovedsakelig på Sjælland og Amager.'},
  {question:'Hvilket søramerikansk land har både Quechua og Aymara som offisielle språk sammen med spansk?',answer:'Bolivia',fact:'Bolivia anerkjenner mange urfolksspråk som offisielle.'}
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
  {question:'Hva heter hovedstaden i Australia?',answer:'Canberra'},
  {question:'Hvilket grunnstoff har det kjemiske symbolet Fe?',answer:'Jern'},
  {question:'Hvem skrev romanen «Sult»?',answer:'Knut Hamsun'},
  {question:'Hva heter den største planeten i solsystemet?',answer:'Jupiter'},
  {question:'Hvilket år sank Titanic?',answer:'1912'},
  {question:'Hvilken kunstner malte «Guernica»?',answer:'Pablo Picasso'},
  {question:'Hvilken valuta brukes i Japan?',answer:'Yen'},
  {question:'Hva er det kjemiske symbolet for gull?',answer:'Au'},
  {question:'Hvem skrev skuespillet «Et dukkehjem»?',answer:'Henrik Ibsen'},
  {question:'Hvilket organ produserer insulin?',answer:'Bukspyttkjertelen'},
  {question:'Hva heter verdens største nålevende dyr?',answer:'Blåhval'},
  {question:'Hva kalles prosessen der planter bruker lys til å lage sukker?',answer:'Fotosyntese'}
 ],
 sports:[
  {question:'Hvor mange spillere har ett lag på banen i vanlig elleverfotball?',answer:'11'},
  {question:'Hvilket land vant herre-VM i fotball i 2022?',answer:'Argentina'},
  {question:'Hvor mange ringer er det i OL-symbolet?',answer:'5'},
  {question:'Hva heter den norske skiskytteren som vant åtte olympiske gull?',answer:'Ole Einar Bjørndalen'},
  {question:'Hvilken idrett forbindes med Wimbledon?',answer:'Tennis'},
  {question:'Hvilken fotballklubb spiller hjemmekampene sine på Anfield?',answer:'Liverpool FC'},
  {question:'Hvor lang er et maraton, målt i kilometer?',answer:'42,195 km'},
  {question:'Hvilket land arrangerte sommer-OL i 2016?',answer:'Brasil'},
  {question:'Hva heter trofeet vinneren av NHL-sluttspillet mottar?',answer:'Stanley Cup'},
  {question:'Hvem scoret vinnermålet for Tyskland i VM-finalen i fotball 2014?',answer:'Mario Götze'},
  {question:'I hvilken idrett brukes uttrykkene birdie, eagle og bogey?',answer:'Golf'},
  {question:'Hvilket lag vant den første sesongen av Premier League i 1992–93?',answer:'Manchester United'}
 ],
 fiveone:[
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
