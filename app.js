import {quizzes,questions} from './data.js';
const KEY='quizhub-save-v1'; // Behold gamle spillere og lagrede poeng ved oppdatering
const blank=()=>({mode:null,players:[],scores:{},rounds:[],quiz:null,index:0,revealed:false,clue:0,selected:null,awarded:{},category:'',locks:{},complete:false});
let state;
try{state={...blank(),...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{state=blank()}
// Gamle økter i fjernet quiztype skal ikke stoppe den oppdaterte appen.
if(state.quiz==='country'){state.quiz=null;state.category='';state.started=true;}
const app=document.querySelector('#app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){localStorage.setItem(KEY,JSON.stringify(state));}
function update(obj){Object.assign(state,obj);save();render();}
const quiz=id=>quizzes.find(x=>x.id===id);
const list=()=>['fiveone','career'].includes(state.quiz)?(questions[state.quiz]||[]).filter(q=>state.category==='Blandet'||q.category===state.category):(questions[state.quiz]||[]);
const active=()=>list()[state.index];
const header=()=>`<header class="top"><div class="logo">QUIZ<b>HUB</b><div class="tag">Én app. Uendelig med quizglede.</div></div><button class="btn ghost" data-action="home">Hjem</button></header>`;
const back=(action='home')=>`<button class="back" data-action="${action}">← Tilbake</button>`;
const quizzTiles=()=>`<div class="grid">${quizzes.map(q=>`<button class="tile" data-action="choose" data-id="${q.id}"><div class="em">${q.emoji}</div><strong>${esc(q.name)}</strong><small>${esc(q.subtitle)}</small></button>`).join('')}</div>`;
const board=()=>`<table class="board"><thead><tr><th>Spiller</th><th>Poeng</th></tr></thead><tbody>${[...state.players].sort((a,b)=>(state.scores[b]||0)-(state.scores[a]||0)).map((p,i)=>`<tr><td>${i+1}. ${esc(p)}</td><td><strong>${state.scores[p]||0}</strong></td></tr>`).join('')}</tbody></table>`;
function home(){return `<div class="eyebrow">Velkommen til QuizHub</div><h1 class="heading">Hva skal vi spille<br>i dag?</h1><p class="sub">Spill én quiz, eller samle gjengen til en hel quizkveld med felles poengtavle.</p><div class="modes"><button class="mode" data-action="setmode" data-mode="single"><div>🎯</div><strong>Enkeltquiz</strong><small>Spill én quiz med separat resultat.</small></button><button class="mode" data-action="setmode" data-mode="night"><div>🏆</div><strong>Quizkveld</strong><small>Flere quizrunder – samme poengtavle.</small></button></div><div class="banner"><strong>Seks quiztyper er klare!</strong><p>5–1, geografi-funfacts, allmennquiz, sportsquiz, fotballkarriere og musikkquiz. Eksempelspørsmål følger med.</p></div>${state.mode?`<button class="btn secondary" data-action="resume">Fortsett forrige spill</button>`:''}`;}
function setup(){return `${back()}<div class="eyebrow">${state.mode==='night'?'Quizkveld':'Enkeltquiz'}</div><h1 class="heading">Hvem er med?</h1><p class="sub">Registrer spillerne. Quizmaster kan også delta, og fasiten forblir skjult til dere åpner den.</p><div class="panel"><h2>Spillere</h2><form id="addplayer" class="field"><input id="playername" placeholder="Skriv navn" maxlength="30" autocomplete="off" aria-label="Spillernavn" required><button class="btn" type="submit">Legg til</button></form><div>${state.players.map(p=>`<span class="pill">${esc(p)} <button data-action="remove" data-id="${encodeURIComponent(p)}" aria-label="Fjern ${esc(p)}">×</button></span>`).join('')||'<p class="empty">Ingen spillere lagt til ennå.</p>'}</div></div><div class="actions"><button class="btn" data-action="start" ${!state.players.length?'disabled':''}>Velg quiz →</button></div><p class="notice">Poeng lagres på denne enheten. Dette er laget for én felles skjerm, ikke direkte synkronisering mellom ulike telefoner.</p>`;}
function selection(){return `${back('setup')}<div class="eyebrow">${state.mode==='night'?'Quizkveld':'Enkeltquiz'}</div><h1 class="heading">Velg quiz</h1>${state.mode==='night'?`<div class="panel"><div class="roundhead"><h2>🏆 Samlet poengtavle</h2><span class="tiny">${state.rounds.length} fullførte runder</span></div>${board()}<button class="btn ghost" data-action="finish">Avslutt quizkvelden</button></div>`:''}${quizzTiles()}<p class="notice">Spørsmålsbanken er utvidet. De gamle quizprosjektenes komplette databaser er ikke importert ennå.</p>`;}
function categorySelection(){
 const isFive=state.quiz==='fiveone';
 const cats=isFive?['Kjendiser','Geografi','Fotball','Blandet']:[...new Set((questions.career||[]).map(q=>q.category)),'Blandet'];
 const icons=isFive?['🌟','🌍','⚽','🎲']:['⚽','🏅','🌍','🎲','🎯'];
 return `${back('selection')}<div class="eyebrow">${esc(quiz(state.quiz).name)}</div><h1 class="heading">Velg kategori</h1><p class="sub">${isFive?'Fem ledetråder per spørsmål. Lås svar på ønsket poengnivå.':'Gjett spilleren ut fra klubbene i karriereløpet.'}</p><div class="grid">${cats.map((c,i)=>`<button class="tile" data-action="category" data-id="${esc(c)}"><div class="em">${icons[i]||'⚽'}</div><strong>${esc(c)}</strong><small>${c==='Blandet'?'Alle spørsmål':questions[state.quiz].filter(q=>q.category===c).length+' spørsmål'}</small></button>`).join('')}</div>`;
}
function play(){let q=active();if(!q)return `<h2>Ingen flere spørsmål</h2><button class="btn" data-action="done">Se resultat</button>`;
 const type=state.quiz, count=list().length;
 let content='';
 if(type==='fiveone'){
  const visible=Math.min(state.clue+1,5);
  content+=`<span class="pill">${esc(q.category)}</span><h2>Hvem eller hva er svaret?</h2><p class="muted">Avgi svar skriftlig utenfor skjermen. Lås poengnivået for hver spiller når de vil svare.</p>`;
  content+=q.clues.slice(0,visible).map((c,i)=>`<div class="clue"><strong>${5-i} poeng</strong><p style="margin:6px 0 0">${esc(c)}</p></div>`).join('');
  if(!state.revealed&&state.clue<4)content+=`<button class="btn secondary" data-action="clue">Vis neste ledetråd (${4-state.clue} poeng)</button>`;
  content+=`<h3>Låste svar</h3>${state.players.map(p=>{const lock=state.locks[p];return `<div class="scoreops"><strong class="player-label">${esc(p)}</strong>${lock?`<span class="pill">🔒 ${lock.points} poeng</span>`:`<button class="btn secondary" data-action="lock" data-id="${encodeURIComponent(p)}" ${state.revealed?'disabled':''}>Lås svar (${5-state.clue} p)</button>`}</div>`}).join('')}`;
 }else if(type==='career'){
  content+=`<p class="muted">Hvilken spiller har denne karrieren?</p><span class="pill">${esc(q.category||'Fotball')}</span>`;
  content+=`<div class="career-list">${q.clues.map((club,i)=>`<div class="career-club"><span>${i+1}</span>${esc(club)}</div>`).join('')}</div>`;
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
 return `${back('selection')}<div class="roundhead"><div><div class="eyebrow">${esc(quiz(type).name)}</div><h2>Spørsmål ${state.index+1} av ${count}</h2></div><span class="pill">${state.mode==='night'?'🏆 Quizkveld':'🎯 Enkeltquiz'}</span></div><div class="panel">${content}</div><div class="actions"><button class="btn" data-action="next" ${!state.revealed?'disabled':''}>${state.index===count-1?'Fullfør quiz':'Lagre poeng og neste →'}</button><button class="btn ghost" data-action="selection">Til quizoversikt</button></div>`;
}
function results(){return `${back('selection')}<div class="eyebrow">${state.mode==='night'?'Quizkveld':'Enkeltquiz'}</div><h1 class="heading">${state.mode==='night'?'Quizkveldens resultat':'Resultat'}</h1><div class="panel">${board()}${state.mode==='night'?`<h3>Fullførte runder</h3>${state.rounds.map((r,i)=>`<p>${i+1}. ${esc(quiz(r)?.name||r)}</p>`).join('')||'<p class="muted">Ingen fullførte runder.</p>'}`:''}</div><div class="actions">${state.mode==='night'?'<button class="btn" data-action="selection">Spill en ny runde</button>':'<button class="btn" data-action="new">Ny enkeltquiz</button>'}<button class="btn secondary" data-action="reset">Start helt på nytt</button></div>`;}
function render(){app.innerHTML=header()+(state.complete?results():!state.mode?home():state.quiz?(['fiveone','career'].includes(state.quiz)&&!state.category?categorySelection():play()):state.players.length&&state.started?selection():setup());}
function resetQuestion(){state.index=0;state.revealed=false;state.clue=0;state.selected=null;state.awarded={};state.locks={};state.category='';state.complete=false;}
function dispatch(action,el){switch(action){
 case 'home':update({mode:null,quiz:null,complete:false});break;
 case 'setmode':state=blank();update({mode:el.dataset.mode});break;
 case 'resume':render();break;
 case 'setup':update({started:false,quiz:null,complete:false});break;
 case 'start':update({started:true});break;
 case 'choose':resetQuestion();state.quiz=el.dataset.id;save();render();break;
 case 'category':state.category=el.dataset.id;state.index=0;state.clue=0;state.locks={};state.awarded={};state.revealed=false;save();render();break;
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
   if(state.index>=list().length){if(state.mode==='night'){state.rounds.push(state.quiz);state.quiz=null;state.started=true}else{state.complete=true;state.quiz=null;}}
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
