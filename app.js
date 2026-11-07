import {quizzes,questions,getDifficulty} from './data.js';
const KEY='quizhub-save-v1'; // Behold gamle spillere og lagrede poeng ved oppdatering
const blank=()=>({mode:null,players:[],scores:{},rounds:[],quiz:null,index:0,revealed:false,clue:0,selected:null,awarded:{},category:'',locks:{},complete:false,deck:null,roundSize:10,level:''});
let state;
try{state={...blank(),...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{state=blank()}
// Gamle økter i fjernet quiztype skal ikke stoppe den oppdaterte appen.
if(state.quiz==='career'){state.category='';state.deck=null;state.index=0;state.revealed=false;state.clue=0;}
if(state.quiz==='country'){state.quiz=null;state.category='';state.started=true;}
// Pågående økter fra tidligere versjoner kan spilles ferdig med gammel rekkefølge.
if(state.quiz&&state.category!==undefined&&state.index>0&&!Array.isArray(state.deck)){const old=(questions[state.quiz]||[]).filter(q=>!['fiveone','career'].includes(state.quiz)||state.category==='Blandet'||q.category===state.category);state.deck=old.map((_,i)=>i);}
const app=document.querySelector('#app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){localStorage.setItem(KEY,JSON.stringify(state));}
function update(obj){Object.assign(state,obj);save();render();}
const quiz=id=>quizzes.find(x=>x.id===id);
const leveled=['general','geography','sports'];
const difficultyNames={easy:'Enkel',medium:'Middels',hard:'Vanskelig'};
const configs={family:{name:'Familiequiz',description:'70 % enkle og 30 % middels spørsmål',weights:{easy:7,medium:3,hard:0}},normal:{name:'Vanlig quiz',description:'30 % enkle, 50 % middels og 20 % vanskelige',weights:{easy:3,medium:5,hard:2}},expert:{name:'Ekspertquiz',description:'30 % middels og 70 % vanskelige',weights:{easy:0,medium:3,hard:7}}};
const list=()=>state.quiz==='fiveone'?(questions.fiveone||[]).filter(q=>state.category==='Blandet'||q.category===state.category):(questions[state.quiz]||[]);
const active=()=>list()[Array.isArray(state.deck)?state.deck[state.index]:state.index];
const count=()=>Array.isArray(state.deck)?state.deck.length:list().length;
function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function makeDeck(length, requested){return shuffle(Array.from({length},(_,i)=>i)).slice(0,requested==='all'?length:Math.min(length,Number(requested)||10));}
// Trekk en blanding uten gjentakelser. Bruk nærmeste tilgjengelige nivå hvis et nivå går tomt.
function makeLeveledDeck(type,requested,level){
 const pool=list();const countRequested=requested==='all'?pool.length:Math.min(pool.length,Number(requested)||10);
 const bands={easy:[],medium:[],hard:[]};pool.forEach((q,i)=>bands[getDifficulty(type,q,i)]?.push(i));
 for(const k in bands)bands[k]=shuffle(bands[k]);
 const weights=configs[level]?.weights||configs.normal.weights;
 const desired={};let rem=countRequested;
 for(const k of ['easy','medium','hard']){desired[k]=Math.floor(countRequested*weights[k]/10);rem-=desired[k];}
 // Fordel avrundingsrest etter største brøkrest.
 const rank=['easy','medium','hard'].sort((a,b)=>(countRequested*weights[b]/10%1)-(countRequested*weights[a]/10%1));
 for(let i=0;i<rem;i++)desired[rank[i%rank.length]]++;
 let chosen=[];
 for(const k of ['easy','medium','hard']) chosen.push(...bands[k].splice(0,desired[k]));
 let remaining=countRequested-chosen.length;
 // I familiequiz unngås vanskelige så lenge easy/medium er tilgjengelig.
 const fallback=level==='family'?['easy','medium','hard']:level==='expert'?['hard','medium','easy']:['medium','easy','hard'];
 for(const k of fallback){if(!remaining)break;const add=bands[k].splice(0,remaining);chosen.push(...add);remaining-=add.length;}
 return shuffle(chosen);
}
const safeColor=(s)=>{const n=String(s).toLowerCase().replace(/\s*\(.*?\)/g,'');const palettes=[['#e12842','#ffffff','stripes'],['#245dba','#ffffff','solid'],['#e7c03a','#141b37','solid'],['#ffffff','#202b3c','solid'],['#1a9c79','#ffffff','stripes'],['#a12f57','#ffffff','solid'],['#111a28','#ffffff','stripes'],['#f38b35','#19213c','solid']];
 const named=[[/arsenal|manchester united|liverpool|bayern|salzburg|benfica|ajax|sevilla|monaco|molde|bryne|psv|feyenoord|az alkmaar/,['#d32a42','#ffffff','solid']],[/real madrid|tottenham|leeds|fulham|valencia|swansea|derby county/,['#f8f8f8','#252d42','solid']],[/barcelona|basel/,['#8d244f','#204e9c','stripes']],[/manchester city|napoli|lazio|melbourne city/,['#8ec8ef','#ffffff','solid']],[/chelsea|everton|leicester|schalke|inter/,['#1d4da3','#ffffff','solid']],[/juventus|newcastle|udinese/,['#ffffff','#151515','stripes']],[/borussia dortmund/,['#f1d22d','#121212','solid']],[/milan|flamengo|atletico madrid/,['#d92b3b','#161922','stripes']],[/celtic|sporting cp/,['#f8f8f8','#21875c','hoops']],[/norwich/,['#e8d238','#1d9156','solid']],[/wolverhampton/,['#ebae2b','#161922','solid']]];
 for(const [rx,colors] of named)if(rx.test(n))return colors;
 let h=0;for(const ch of n)h=(h*31+ch.charCodeAt(0))|0;return palettes[Math.abs(h)%palettes.length];};
function jersey(club,i){const [primary,secondary,kind]=safeColor(club);const id='kit'+i;let pattern=kind==='stripes'?`<path d="M30 23h10v54H30zm20 0h10v54H50z" fill="${secondary}" opacity=".9"/>`:kind==='hoops'?`<path d="M20 38h50v10H20zm0 20h50v10H20z" fill="${secondary}"/>`:'';
 return `<div class="kit-item"><div class="kit-number">${i+1}</div><svg class="kit-icon" viewBox="0 0 92 91" role="img" aria-label="Drakt til ${esc(club)}"><defs><clipPath id="${id}"><path d="M29 10 14 18 4 36 20 44 25 34 25 80 67 80 67 34 72 44 88 36 78 18 63 10 57 18 35 18Z"/></clipPath></defs><path d="M29 10 14 18 4 36 20 44 25 34 25 80 67 80 67 34 72 44 88 36 78 18 63 10 57 18 35 18Z" fill="${primary}" stroke="#ffffff" stroke-width="2.1" stroke-opacity=".55"/><g clip-path="url(#${id})">${pattern}</g><path d="M35 18Q46 33 57 18" fill="none" stroke="${secondary}" stroke-width="5"/><path d="M25 74h42" stroke="${secondary}" stroke-width="3"/></svg><span class="kit-name">${esc(club)}</span></div>`;}

const header=()=>`<header class="top"><div class="logo">QUIZ<b>HUB</b><div class="tag">Én app. Uendelig med quizglede.</div></div><button class="btn ghost" data-action="home">Hjem</button></header>`;
const back=(action='home')=>`<button class="back" data-action="${action}">← Tilbake</button>`;
const quizzTiles=()=>`<div class="grid">${quizzes.map(q=>`<button class="tile" data-action="choose" data-id="${q.id}"><div class="em">${q.emoji}</div><strong>${esc(q.name)}</strong><small>${esc(q.subtitle)}</small>${q.id==='career'?`<small>${questions.career.length} spillere i én samlet bank</small>`:''}</button>`).join('')}</div>`;
const board=()=>`<table class="board"><thead><tr><th>Spiller</th><th>Poeng</th></tr></thead><tbody>${[...state.players].sort((a,b)=>(state.scores[b]||0)-(state.scores[a]||0)).map((p,i)=>`<tr><td>${i+1}. ${esc(p)}</td><td><strong>${state.scores[p]||0}</strong></td></tr>`).join('')}</tbody></table>`;
function home(){return `<div class="eyebrow">Velkommen til QuizHub</div><h1 class="heading">Hva skal vi spille<br>i dag?</h1><p class="sub">Spill én quiz, eller samle gjengen til en hel quizkveld med felles poengtavle.</p><div class="modes"><button class="mode" data-action="setmode" data-mode="single"><div>🎯</div><strong>Enkeltquiz</strong><small>Spill én quiz med separat resultat.</small></button><button class="mode" data-action="setmode" data-mode="night"><div>🏆</div><strong>Quizkveld</strong><small>Flere quizrunder – samme poengtavle.</small></button></div><div class="banner"><strong>Seks quiztyper er klare!</strong><p>5–1, geografi-funfacts, allmennquiz, sportsquiz, fotballkarriere og musikkquiz. Eksempelspørsmål følger med.</p></div>${state.mode?`<button class="btn secondary" data-action="resume">Fortsett forrige spill</button>`:''}`;}
function setup(){return `${back()}<div class="eyebrow">${state.mode==='night'?'Quizkveld':'Enkeltquiz'}</div><h1 class="heading">Hvem er med?</h1><p class="sub">Registrer spillerne. Quizmaster kan også delta, og fasiten forblir skjult til dere åpner den.</p><div class="panel"><h2>Spillere</h2><form id="addplayer" class="field"><input id="playername" placeholder="Skriv navn" maxlength="30" autocomplete="off" aria-label="Spillernavn" required><button class="btn" type="submit">Legg til</button></form><div>${state.players.map(p=>`<span class="pill">${esc(p)} <button data-action="remove" data-id="${encodeURIComponent(p)}" aria-label="Fjern ${esc(p)}">×</button></span>`).join('')||'<p class="empty">Ingen spillere lagt til ennå.</p>'}</div></div><div class="actions"><button class="btn" data-action="start" ${!state.players.length?'disabled':''}>Velg quiz →</button></div><p class="notice">Poeng lagres på denne enheten. Dette er laget for én felles skjerm, ikke direkte synkronisering mellom ulike telefoner.</p>`;}
function selection(){return `${back('setup')}<div class="eyebrow">${state.mode==='night'?'Quizkveld':'Enkeltquiz'}</div><h1 class="heading">Velg quiz</h1>${state.mode==='night'?`<div class="panel"><div class="roundhead"><h2>🏆 Samlet poengtavle</h2><span class="tiny">${state.rounds.length} fullførte runder</span></div>${board()}<button class="btn ghost" data-action="finish">Avslutt quizkvelden</button></div>`:''}${quizzTiles()}<p class="notice">Spørsmålsbanken er utvidet. De gamle quizprosjektenes komplette databaser er ikke importert ennå.</p>`;}
function categorySelection(){
 const cats=['Kjendiser','Geografi','Fotball','Blandet'];
 const icons=['🌟','🌍','⚽','🎲'];
 return `${back('selection')}<div class="eyebrow">${esc(quiz(state.quiz).name)}</div><h1 class="heading">Velg kategori</h1><p class="sub">Fem ledetråder per spørsmål. Lås svar på ønsket poengnivå.</p><div class="grid">${cats.map((c,i)=>`<button class="tile" data-action="category" data-id="${esc(c)}"><div class="em">${icons[i]}</div><strong>${esc(c)}</strong><small>${c==='Blandet'?'Alle spørsmål':questions.fiveone.filter(q=>q.category===c).length+' spørsmål'}</small></button>`).join('')}</div>`;
}
function levelSelection(){return `${back('selection')}<div class="eyebrow">${esc(quiz(state.quiz).name)}</div><h1 class="heading">Velg vanskelighetsgrad</h1><p class="sub">Spørsmålene er sortert etter forventet vanskelighetsgrad. Trekningen blir tilfeldig innenfor nivåene.</p><div class="level-grid">${Object.entries(configs).map(([key,v])=>`<button class="level-tile" data-action="setlevel" data-id="${key}"><strong>${key==='family'?'👨‍👩‍👧‍👦':key==='normal'?'🧠':'🎓'} ${v.name}</strong><span>${v.description}</span></button>`).join('')}</div><p class="notice">Vanskelighetsgrad er et anslag. For små spørsmålsutvalg kan fordelingen avvike hvis det ikke finnes nok spørsmål på et nivå.</p>`;}
function roundSetup(){const n=list().length;const opts=[5,10,15,20].filter(v=>v<=n);opts.push('all');return `${back(state.quiz==='fiveone'?'categories':leveled.includes(state.quiz)?'levels':'selection')}<div class="eyebrow">${esc(quiz(state.quiz).name)}</div><h1 class="heading">Hvor mange spørsmål?</h1><p class="sub">Vi trekker tilfeldig fra ${n} tilgjengelige spørsmål${leveled.includes(state.quiz)?' · '+esc(configs[state.level]?.name||'Vanlig quiz'):''}${state.category&&state.category!=='Blandet'?' i '+esc(state.category):''}. Hvert spørsmål kommer bare én gang per runde.</p><div class="roundchoices">${opts.map(v=>`<button class="btn ${v===10||v==='all'&&n<10?'':'secondary'}" data-action="beginround" data-size="${v}">${v==='all'?'Alle '+n:v+' spørsmål'}</button>`).join('')}</div><p class="notice">En ny runde gir et nytt tilfeldig utvalg og en ny rekkefølge. Poengene fortsetter å telle i quizkveld-modus.</p>`;}
function play(){let q=active();if(!q)return `<h2>Ingen flere spørsmål</h2><button class="btn" data-action="done">Se resultat</button>`;
 const type=state.quiz, total=count();
 let content='';
 if(type==='fiveone'){
  const visible=Math.min(state.clue+1,5);
  content+=`<span class="pill">${esc(q.category)}</span><h2>Hvem eller hva er svaret?</h2><p class="muted">Avgi svar skriftlig utenfor skjermen. Lås poengnivået for hver spiller når de vil svare.</p>`;
  content+=q.clues.slice(0,visible).map((c,i)=>`<div class="clue"><strong>${5-i} poeng</strong><p style="margin:6px 0 0">${esc(c)}</p></div>`).join('');
  if(!state.revealed&&state.clue<4)content+=`<button class="btn secondary" data-action="clue">Vis neste ledetråd (${4-state.clue} poeng)</button>`;
  content+=`<h3>Låste svar</h3>${state.players.map(p=>{const lock=state.locks[p];return `<div class="scoreops"><strong class="player-label">${esc(p)}</strong>${lock?`<span class="pill">🔒 ${lock.points} poeng</span>`:`<button class="btn secondary" data-action="lock" data-id="${encodeURIComponent(p)}" ${state.revealed?'disabled':''}>Lås svar (${5-state.clue} p)</button>`}</div>`}).join('')}`;
 }else if(type==='career'){
  content+=`<p class="muted">Hvilken spiller har denne karrieren?</p>`;
  content+=`<div class="career-kits">${q.clues.map((club,i)=>jersey(club,i)).join('<span class="kit-arrow" aria-hidden="true">→</span>')}</div>`;
 }else if(['general','geography','sports'].includes(type)){
  content+=`<h2 class="open-question">${esc(q.question)}</h2><p class="muted">Spillerne skriver ned svaret før fasit vises. Ingen svaralternativer.</p>`;
 }else{
 content+=`<p class="sub">Spill låten uten å vise tittelen til deltakerne. Fasit ligger bak knappen.</p><a class="btn secondary" href="${esc(q.spotify)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;text-decoration:none">🎵 Åpne låten i Spotify</a><h2>Bonusspørsmål (1 poeng)</h2><p>${esc(q.question)}</p><p class="tiny">1 poeng for riktig artist og låt, og 1 poeng for bonusspørsmålet (maks 2). Skriv svarene på papir før du viser fasit.</p>`;
 }
 content+=`<div class="actions"><button class="btn ${state.revealed?'good':''}" data-action="reveal">${state.revealed?'✓ Fasit vises':'👁 Vis fasit'}</button></div>`;
 if(state.revealed){
 content+=`<div class="answer">${esc(q.answer)}</div>`;
 if(type==='music')content+=`<p class="muted">Bonusfasit: <strong>${esc(q.bonusAnswer)}</strong></p>`;
 if(q.fact)content+=`<p class="muted">💡 ${esc(q.fact)}</p>`;
 content+=`<h3>Gi poeng</h3><p class="tiny">Quizmaster registrerer poeng manuelt etter at alle har svart.</p>`;
 for(const p of state.players){const max=type==='fiveone'?(state.locks[p]?.points||0):type==='music'?2:1;
 content+=`<div class="scoreops"><strong class="player-label">${esc(p)}</strong>${type==='fiveone'?`<span class="tiny">${state.locks[p]?'Låst på '+max+' poeng':'Ikke låst'}</span>`:''}<select data-award-player="${encodeURIComponent(p)}" aria-label="Poeng til ${esc(p)}">${Array.from({length:max+1},(_,v)=>`<option value="${v}" ${(state.awarded[p]||0)===v?'selected':''}>${v} poeng</option>`).join('')}</select></div>`;
 }
 }
 return `${back('selection')}<div class="roundhead"><div><div class="eyebrow">${esc(quiz(type).name)}${leveled.includes(type)?' · '+esc(configs[state.level]?.name||'Vanlig quiz'):''}</div><h2>Spørsmål ${state.index+1} av ${total}</h2></div><span class="pill">${state.mode==='night'?'🏆 Quizkveld':'🎯 Enkeltquiz'}</span></div><div class="panel">${content}</div><div class="actions"><button class="btn" data-action="next" ${!state.revealed?'disabled':''}>${state.index===total-1?'Fullfør quiz':'Lagre poeng og neste →'}</button><button class="btn ghost" data-action="selection">Til quizoversikt</button></div>`;
}
function results(){return `${back('selection')}<div class="eyebrow">${state.mode==='night'?'Quizkveld':'Enkeltquiz'}</div><h1 class="heading">${state.mode==='night'?'Quizkveldens resultat':'Resultat'}</h1><div class="panel">${board()}${state.mode==='night'?`<h3>Fullførte runder</h3>${state.rounds.map((r,i)=>`<p>${i+1}. ${esc(quiz(r)?.name||r)}</p>`).join('')||'<p class="muted">Ingen fullførte runder.</p>'}`:''}</div><div class="actions">${state.mode==='night'?'<button class="btn" data-action="selection">Spill en ny runde</button>':'<button class="btn" data-action="new">Ny enkeltquiz</button>'}<button class="btn secondary" data-action="reset">Start helt på nytt</button></div>`;}
function render(){app.innerHTML=header()+(state.complete?results():!state.mode?home():state.quiz?(state.quiz==='fiveone'&&!state.category?categorySelection():leveled.includes(state.quiz)&&!state.level?levelSelection():!Array.isArray(state.deck)?roundSetup():play()):state.players.length&&state.started?selection():setup());}
function resetQuestion(){state.index=0;state.revealed=false;state.clue=0;state.selected=null;state.awarded={};state.locks={};state.category='';state.deck=null;state.level='';state.complete=false;}
function dispatch(action,el){switch(action){
 case 'home':update({mode:null,quiz:null,complete:false});break;
 case 'setmode':state=blank();update({mode:el.dataset.mode});break;
 case 'resume':render();break;
 case 'setup':update({started:false,quiz:null,complete:false});break;
 case 'start':update({started:true});break;
 case 'choose':resetQuestion();state.quiz=el.dataset.id;save();render();break;
 case 'levels':state.deck=null;state.level='';save();render();break;
 case 'categories':state.deck=null;state.category='';save();render();break;
 case 'beginround':{const pool=list();if(!pool.length){alert('Ingen spørsmål i denne kategorien ennå.');break;}state.deck=leveled.includes(state.quiz)?makeLeveledDeck(state.quiz,el.dataset.size,state.level):makeDeck(pool.length,el.dataset.size);state.roundSize=el.dataset.size;state.index=0;state.clue=0;state.revealed=false;state.locks={};state.awarded={};save();render();break;}
 case 'setlevel':state.level=el.dataset.id;state.deck=null;state.index=0;state.revealed=false;save();render();break;
 case 'category':state.category=el.dataset.id;state.deck=null;state.index=0;state.clue=0;state.locks={};state.awarded={};state.revealed=false;save();render();break;
 case 'lock':{if(state.revealed||state.quiz!=='fiveone')break;const p=decodeURIComponent(el.dataset.id);if(!state.players.includes(p)||state.locks[p])break;state.locks[p]={points:5-state.clue};save();render();break;}
 case 'selection':update({quiz:null,complete:false,started:true});break;
 case 'remove':{const p=decodeURIComponent(el.dataset.id);state.players=state.players.filter(x=>x!==p);delete state.scores[p];save();render();break;}
 case 'clue':if(!state.revealed)update({clue:Math.min(state.clue+1,active().clues.length-1)});break;
 case 'option':update({selected:Number(el.dataset.id)});break;
 case 'reveal':update({revealed:!state.revealed});break;
 case 'next':{
   if(!state.revealed)return;
   state.players.forEach(p=>state.scores[p]=(state.scores[p]||0)+Number(state.awarded[p]||0));
   state.index++;state.revealed=false;state.clue=0;state.selected=null;state.awarded={};state.locks={};
   if(state.index>=count()){if(state.mode==='night'){state.rounds.push(state.quiz);state.quiz=null;state.started=true}else{state.complete=true;state.quiz=null;}}
   save();render();break;
 }
 case 'finish':update({complete:true});break;
 case 'done':update({complete:true,quiz:null});break;
 case 'new':state=blank();update({mode:'single'});break;
 case 'reset':if(confirm('Slette denne quizkvelden og alle poeng på denne enheten?')){state=blank();save();render();}break;
 }}
document.addEventListener('click',e=>{const el=e.target.closest('[data-action]');if(el)dispatch(el.dataset.action,el);});
document.addEventListener('submit',e=>{if(e.target.id!=='addplayer')return;e.preventDefault();const input=document.querySelector('#playername');const p=input.value.trim();if(!p)return;if(state.players.some(x=>x.toLocaleLowerCase('nb')===p.toLocaleLowerCase('nb'))){alert('Navnet finnes allerede');return;}state.players.push(p);state.scores[p]=0;save();render();document.querySelector('#playername')?.focus();});
document.addEventListener('change',e=>{if(e.target.matches('[data-award-player]')){state.awarded[decodeURIComponent(e.target.dataset.awardPlayer)]=Number(e.target.value);save();}});
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
render();
