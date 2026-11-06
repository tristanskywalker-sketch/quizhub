import {quizzes,questions} from './data.js';
const KEY='quizhub-save-v1';
const blank=()=>({mode:null,players:[],scores:{},rounds:[],quiz:null,index:0,revealed:false,clue:0,selected:null,awarded:{},complete:false});
let state;
try{state={...blank(),...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{state=blank()}
const app=document.querySelector('#app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){localStorage.setItem(KEY,JSON.stringify(state));}
function update(obj){Object.assign(state,obj);save();render();}
const quiz=id=>quizzes.find(x=>x.id===id);
const list=()=>questions[state.quiz]||[];
const active=()=>list()[state.index];
const header=()=>`<header class="top"><div class="logo">QUIZ<b>HUB</b><div class="tag">Én app. Uendelig med quizglede.</div></div><button class="btn ghost" data-action="home">Hjem</button></header>`;
const back=(action='home')=>`<button class="back" data-action="${action}">← Tilbake</button>`;
const quizzTiles=()=>`<div class="grid">${quizzes.map(q=>`<button class="tile" data-action="choose" data-id="${q.id}"><div class="em">${q.emoji}</div><strong>${esc(q.name)}</strong><small>${esc(q.subtitle)}</small></button>`).join('')}</div>`;
const board=()=>`<table class="board"><thead><tr><th>Spiller</th><th>Poeng</th></tr></thead><tbody>${[...state.players].sort((a,b)=>(state.scores[b]||0)-(state.scores[a]||0)).map((p,i)=>`<tr><td>${i+1}. ${esc(p)}</td><td><strong>${state.scores[p]||0}</strong></td></tr>`).join('')}</tbody></table>`;
function home(){return `<div class="eyebrow">Velkommen til QuizHub</div><h1 class="heading">Hva skal vi spille<br>i dag?</h1><p class="sub">Spill én quiz, eller samle gjengen til en hel quizkveld med felles poengtavle.</p><div class="modes"><button class="mode" data-action="setmode" data-mode="single"><div>🎯</div><strong>Enkeltquiz</strong><small>Spill én quiz med separat resultat.</small></button><button class="mode" data-action="setmode" data-mode="night"><div>🏆</div><strong>Quizkveld</strong><small>Flere quizrunder – samme poengtavle.</small></button></div><div class="banner"><strong>Fire quiztyper er klare!</strong><p>Gjett landet, fotballkarriere, musikk og allmennquiz. Eksempelspørsmål følger med.</p></div>${state.mode?`<button class="btn secondary" data-action="resume">Fortsett forrige spill</button>`:''}`;}
function setup(){return `${back()}<div class="eyebrow">${state.mode==='night'?'Quizkveld':'Enkeltquiz'}</div><h1 class="heading">Hvem er med?</h1><p class="sub">Registrer spillerne. Quizmaster kan også delta, og fasiten forblir skjult til dere åpner den.</p><div class="panel"><h2>Spillere</h2><form id="addplayer" class="field"><input id="playername" placeholder="Skriv navn" maxlength="30" autocomplete="off" aria-label="Spillernavn" required><button class="btn" type="submit">Legg til</button></form><div>${state.players.map(p=>`<span class="pill">${esc(p)} <button data-action="remove" data-id="${encodeURIComponent(p)}" aria-label="Fjern ${esc(p)}">×</button></span>`).join('')||'<p class="empty">Ingen spillere lagt til ennå.</p>'}</div></div><div class="actions"><button class="btn" data-action="start" ${!state.players.length?'disabled':''}>Velg quiz →</button></div><p class="notice">Poeng lagres på denne enheten. Dette er laget for én felles skjerm, ikke direkte synkronisering mellom ulike telefoner.</p>`;}
function selection(){return `${back('setup')}<div class="eyebrow">${state.mode==='night'?'Quizkveld':'Enkeltquiz'}</div><h1 class="heading">Velg quiz</h1>${state.mode==='night'?`<div class="panel"><div class="roundhead"><h2>🏆 Samlet poengtavle</h2><span class="tiny">${state.rounds.length} fullførte runder</span></div>${board()}<button class="btn ghost" data-action="finish">Avslutt quizkvelden</button></div>`:''}${quizzTiles()}<p class="notice">Startbanken er et utvalg demonstrasjonsspørsmål. De gamle prosjektenes komplette data er ikke importert ennå.</p>`;}
function play(){let q=active();if(!q)return `<h2>Ingen flere spørsmål</h2><button class="btn" data-action="done">Se resultat</button>`;
 const type=state.quiz, count=list().length;
 let content='';
 if(type==='country'||type==='career'){
  const current=type==='country'?Math.min(state.clue,q.clues.length-1):q.clues.length-1;
  content+=`<p class="muted">${type==='country'?'Gjett landet ut fra ledetrådene':'Hvilken spiller har denne karrieren?'}</p>`;
  if(type==='career'&&q.category)content+=`<span class="pill">${esc(q.category)}</span>`;
  content+=q.clues.slice(0,current+1).map((c,i)=>`<div class="clue">${type==='country'?`${3-i} poeng · `:`${i+1}. `}${esc(c)}</div>`).join('');
  if(type==='country'&&!state.revealed&&state.clue<q.clues.length-1)content+=`<button class="btn secondary" data-action="clue">Neste ledetråd (lavere poeng)</button>`;
  if(type==='country')content+=`<p class="tiny">Maks poeng for dette spørsmålet: ${3-state.clue}</p>`;
 }else if(type==='general'){
 content+=`<h2>${esc(q.question)}</h2>${q.options.map((o,i)=>`<button class="option ${state.selected===i?'selected':''}" data-action="option" data-id="${i}">${String.fromCharCode(65+i)}. ${esc(o)}</button>`).join('')}`;
 }else{
 content+=`<p class="sub">Spill låten uten å vise tittelen til deltakerne. Fasit ligger bak knappen.</p><a class="btn secondary" href="${esc(q.spotify)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;text-decoration:none">🎵 Åpne låten i Spotify</a><h2>Bonusspørsmål (1 poeng)</h2><p>${esc(q.question)}</p>${q.options.map((o,i)=>`<button class="option ${state.selected===i?'selected':''}" data-action="option" data-id="${i}">${String.fromCharCode(65+i)}. ${esc(o)}</button>`).join('')}<p class="tiny">1 poeng for artist + låt og 1 poeng for bonusspørsmålet (maks 2).</p>`;
 }
 content+=`<div class="actions"><button class="btn ${state.revealed?'good':''}" data-action="reveal">${state.revealed?'✓ Fasit vises':'👁 Vis fasit'}</button></div>`;
 if(state.revealed){
 content+=`<div class="answer">${esc(q.answer||q.options[q.correct])}</div>`;
 if(type==='music')content+=`<p class="muted">Bonusfasit: <strong>${esc(q.options[q.correct])}</strong></p>`;
 if(type==='general'&&state.selected!==null)content+=`<p>${state.selected===q.correct?'✅ Riktig valgt':'❌ Ikke riktig valgt'}</p>`;
 content+=`<h3>Gi poeng</h3><p class="tiny">Quizmaster registrerer poeng manuelt etter at alle har svart.</p>`;
 for(const p of state.players){const max=type==='country'?3-state.clue:type==='music'?2:1;
 content+=`<div class="scoreops"><strong style="min-width:105px">${esc(p)}</strong><select data-award-player="${encodeURIComponent(p)}" aria-label="Poeng til ${esc(p)}">${Array.from({length:max+1},(_,v)=>`<option value="${v}" ${(state.awarded[p]||0)===v?'selected':''}>${v} poeng</option>`).join('')}</select></div>`;
 }
 }
 return `${back('selection')}<div class="roundhead"><div><div class="eyebrow">${esc(quiz(type).name)}</div><h2>Spørsmål ${state.index+1} av ${count}</h2></div><span class="pill">${state.mode==='night'?'🏆 Quizkveld':'🎯 Enkeltquiz'}</span></div><div class="panel">${content}</div><div class="actions"><button class="btn" data-action="next" ${!state.revealed?'disabled':''}>${state.index===count-1?'Fullfør quiz':'Lagre poeng og neste →'}</button><button class="btn ghost" data-action="selection">Til quizoversikt</button></div>`;
}
function results(){return `${back('selection')}<div class="eyebrow">${state.mode==='night'?'Quizkveld':'Enkeltquiz'}</div><h1 class="heading">${state.mode==='night'?'Quizkveldens resultat':'Resultat'}</h1><div class="panel">${board()}${state.mode==='night'?`<h3>Fullførte runder</h3>${state.rounds.map((r,i)=>`<p>${i+1}. ${esc(quiz(r)?.name||r)}</p>`).join('')||'<p class="muted">Ingen fullførte runder.</p>'}`:''}</div><div class="actions">${state.mode==='night'?'<button class="btn" data-action="selection">Spill en ny runde</button>':'<button class="btn" data-action="new">Ny enkeltquiz</button>'}<button class="btn secondary" data-action="reset">Start helt på nytt</button></div>`;}
function render(){app.innerHTML=header()+(state.complete?results():!state.mode?home():state.quiz?play():state.players.length&&state.started?selection():setup());}
function resetQuestion(){state.index=0;state.revealed=false;state.clue=0;state.selected=null;state.awarded={};state.complete=false;}
function dispatch(action,el){switch(action){
 case 'home':update({mode:null,quiz:null,complete:false});break;
 case 'setmode':state=blank();update({mode:el.dataset.mode});break;
 case 'resume':render();break;
 case 'setup':update({started:false,quiz:null,complete:false});break;
 case 'start':update({started:true});break;
 case 'choose':state.quiz=el.dataset.id;resetQuestion();save();render();break;
 case 'selection':update({quiz:null,complete:false,started:true});break;
 case 'remove':{const p=decodeURIComponent(el.dataset.id);state.players=state.players.filter(x=>x!==p);delete state.scores[p];save();render();break;}
 case 'clue':update({clue:Math.min(state.clue+1,active().clues.length-1)});break;
 case 'option':update({selected:Number(el.dataset.id)});break;
 case 'reveal':update({revealed:!state.revealed});break;
 case 'next':{
   if(!state.revealed)return;
   state.players.forEach(p=>state.scores[p]=(state.scores[p]||0)+Number(state.awarded[p]||0));
   state.index++;state.revealed=false;state.clue=0;state.selected=null;state.awarded={};
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
