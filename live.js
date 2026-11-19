import {FIREBASE_CONFIG} from './config.js';
import {questions} from './data.js';
import {checkOpenAnswer} from './answer-check.js';
import {initializeApp,getApps,getApp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {getFirestore,doc,collection,setDoc,getDoc,updateDoc,onSnapshot,runTransaction,writeBatch,serverTimestamp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

const root=document.querySelector('#app');
const app=getApps().length?getApp():initializeApp(FIREBASE_CONFIG);
const auth=getAuth(app),db=getFirestore(app);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const code=()=>Array.from(crypto.getRandomValues(new Uint8Array(8)),v=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[v%32]).join('');
const pools={general:questions.general,geography:questions.geography,sports:questions.sports};
const modeNames={general:'Blandet quiz',geography:'Geografi',sports:'Sport'};
let uid=null, roomCode='',room=null, players=[],responses=[],secret=null,user=null,unsubs=[],error='',draft='',mode='landing';
const cleanup=()=>{unsubs.forEach(fn=>fn());unsubs=[];};
const roomRef=()=>doc(db,'liveRooms',roomCode);
const members=()=>collection(db,'liveRooms',roomCode,'players');
const answers=()=>collection(db,'liveRooms',roomCode,'answers');
const answersRef=(i,id)=>doc(answers(),i+'_'+id);
const secretRef=i=>doc(db,'liveRooms',roomCode,'keys',String(i));
const short=s=>String(s||'').trim().slice(0,36);
function layout(inner){
 root.innerHTML='<header class="top"><div class="logo">QUIZ<b>HUB</b><div class="tag">Live quiz · alle på hver sin mobil</div></div><button class="btn ghost" data-live="leave">Hjem</button></header><main class="online-layout">'+(error?'<div class="notice" role="alert">'+esc(error)+'</div>':'')+inner+'</main>';
}
function btn(label,act,attr=''){return '<button class="btn" type="button" data-live="'+act+'" '+attr+'>'+label+'</button>';}
function link(){return location.origin+location.pathname+'?live='+encodeURIComponent(roomCode);}
function roomHeader(){return '<div class="eyebrow">Live flerspiller</div><h1 class="heading">'+esc(modeNames[room.type]||'Quiz')+'</h1><p class="sub">Romkode: <strong>'+esc(roomCode)+'</strong> · '+players.length+' spillere</p>';}
function sortPlayers(){return [...players].sort((a,b)=>(b.score||0)-(a.score||0));}
function playerTable(){return '<table class="board"><thead><tr><th>Spiller</th><th>Poeng</th></tr></thead><tbody>'+sortPlayers().map((p,i)=>'<tr><td>'+(i+1)+'. '+esc(p.name)+(p.uid===room.owner?' 👑':'')+'</td><td>'+Number(p.score||0)+'</td></tr>').join('')+'</tbody></table>';}
function render(){
 if(mode==='landing'){
  layout('<h1 class="heading">Spill samtidig</h1><p class="sub">Alle får spørsmålene på sin egen mobil og skriver fritekstsvar. Quizmaster deltar også. Ingen fasit på skjermen før svarrunden avsluttes.</p>'+
   (!user?'<div class="panel"><h2>Logg inn først</h2><p>Du må være logget inn på QuizHub med en bekreftet e-postadresse. Gå til «Utfordre venner» for å logge inn eller registrere deg.</p>'+btn('Gå til innlogging','login')+'</div>':
   '<div class="panel"><h2>Opprett et rom</h2><form id="live-create" class="ol-form"><label>Ditt spillernavn<input name="name" maxlength="36" required value="'+esc(user.displayName||localStorage.getItem('qh-live-name')||user.email.split('@')[0])+'"></label><label>Quiztype<select name="type"><option value="general">Blandet quiz</option><option value="geography">Geografi</option><option value="sports">Sport</option></select></label><label>Antall spørsmål<select name="count"><option>10</option><option>20</option><option>5</option></select></label><button class="btn" type="submit">Opprett live-quiz</button></form></div><div class="panel"><h2>Bli med i en quiz</h2><form id="live-join" class="ol-form"><label>Romkode<input name="code" maxlength="8" required value="'+esc(new URL(location.href).searchParams.get('live')||'')+'"></label><label>Ditt spillernavn<input name="name" maxlength="36" required value="'+esc(localStorage.getItem('qh-live-name')||user.email.split('@')[0])+'"></label><button class="btn secondary" type="submit">Bli med</button></form></div>'));
  return;
 }
 if(!room){layout('<div class="panel">Kobler til rommet …</div>');return;}
 const host=room.owner===uid, idx=room.index;
 if(room.phase==='lobby'){
  layout(roomHeader()+'<div class="panel"><h2>Venter på spillere</h2><p>Del romkoden eller lenken. Quizmaster spiller på samme måte som alle andre.</p><div class="actions">'+btn('Del invitasjonslenke','share')+btn('Kopier lenke','copy','class="btn secondary"')+'</div><h3>Påmeldte</h3>'+players.map(p=>'<p>✓ '+esc(p.name)+'</p>').join('')+(host?'<div class="actions">'+btn('Start quiz ('+room.total+' spørsmål)','start')+'</div>':'<p class="muted">Quizmaster starter når alle er med.</p>')+'</div>');
  return;
 }
 if(room.phase==='finished'){
  layout(roomHeader()+'<div class="panel"><h2>🏆 Sluttresultat</h2>'+playerTable()+'</div>');
  return;
 }
 const q=room.prompts[idx],mine=players.find(p=>p.uid===uid),submitted=mine?.submitted===idx;
 const allReady=players.length>0&&players.every(p=>p.submitted===idx);
 const current=responses.filter(r=>r.position===idx);
 const respByUid=new Map(current.map(r=>[r.uid,r]));
 const listHtml=players.map(p=>{
  const r=respByUid.get(p.uid),status=p.graded?.[String(idx)];
  const verdict=status===1?'✓ Riktig':status===0?'✗ Feil':'? Til vurdering';
  return '<div class="ol-answer"><span><strong>'+esc(p.name)+':</strong> '+esc(r?.value||'–')+' · '+verdict+'</span>'+
   (host&&r?'<span class="ol-manual">'+btn('Godkjenn','approve','data-player="'+esc(p.uid)+'"')+btn('Avvis','reject','data-player="'+esc(p.uid)+'" class="btn secondary"')+'</span>':'')+'</div>';
 }).join('');
 layout(roomHeader()+'<div class="panel"><div class="eyebrow">Spørsmål '+(idx+1)+' av '+room.total+'</div><h2 class="open-question">'+esc(q.question)+'</h2>'+
  (q.yearClues?.length?'<ol>'+q.yearClues.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol>':'')+
  (!room.revealed?
   '<p class="muted">'+players.filter(p=>p.submitted===idx).length+' av '+players.length+' har levert.</p>'+
   (submitted?'<p class="notice">✓ Svaret ditt er levert. Fasit vises når runden er avsluttet.</p>':
    '<form id="live-answer-form" class="ol-form"><label>Ditt svar<textarea name="answer" id="live-answer" maxlength="500" required rows="3" placeholder="Skriv svaret her …">'+esc(draft)+'</textarea></label><button class="btn" type="submit">Lever svar</button></form>')+
   (host?'<div class="actions">'+btn(allReady?'Vis fasit og rett svar':'Avslutt svarrunden og vis fasit','reveal','class="btn secondary"')+'</div>':'<p class="tiny">Venter på at alle svarer og quizmaster avslutter runden.</p>'):
   '<div class="answer">Fasit: '+esc(secret?.answer||'Henter fasit …')+'</div><h3>Alle svar</h3>'+listHtml+
   (host?'<p class="tiny">Du kan rette alle svar manuelt. Poengene oppdateres for alle.</p><div class="actions">'+btn(idx===room.total-1?'Vis sluttresultat':'Neste spørsmål →','next')+'</div>':'<p class="muted">Venter på neste spørsmål.</p>'))+
  '</div><div class="panel"><h3>Poengtavle</h3>'+playerTable()+'</div>');
}
function listenRoom(id){
 cleanup();roomCode=id;mode='room';error='';draft='';room=null;responses=[];secret=null;render();
 unsubs.push(onSnapshot(roomRef(),s=>{
  if(!s.exists()){error='Rommet finnes ikke.';mode='landing';cleanup();render();return;}
  const oldIndex=room?.index,oldReveal=room?.revealed;
  room=s.data();
  if(oldIndex!==room.index){draft='';secret=null;responses=[];}
  if(room.revealed&&(!oldReveal||oldIndex!==room.index)){getDoc(secretRef(room.index)).then(s=>{secret=s.data();render();}).catch(e=>{error=e.message;render();});}
  if(!room.revealed)secret=null;
  if(room.revealed&&(!oldReveal||oldIndex!==room.index)){
    const off=onSnapshot(answers(),s=>{responses=s.docs.map(d=>d.data());render();},e=>{error=e.message;render();});unsubs.push(off);
  }
  render();
 },e=>{error=e.message;render();}));
 unsubs.push(onSnapshot(members(),s=>{players=s.docs.map(d=>d.data());render();},e=>{error=e.message;render();}));
}
async function create(form){
 const data=Object.fromEntries(new FormData(form)),type=data.type,count=Number(data.count),pool=pools[type]||[];
 if(!pool.length)throw new Error('Spørsmålsbanken er tom.');
 const shuffled=[...pool].sort(()=>Math.random()-.5).slice(0,Math.min(count,pool.length));
 const id=code(),prompts=shuffled.map(q=>({question:q.question,yearClues:q.yearClues||[]}));
 const name=short(data.name);localStorage.setItem('qh-live-name',name);
 const batch=writeBatch(db);const base=doc(db,'liveRooms',id);
 batch.set(base,{owner:uid,type,total:prompts.length,prompts,phase:'lobby',index:0,revealed:false,createdAt:serverTimestamp()});
 batch.set(doc(db,'liveRooms',id,'players',uid),{uid,name,score:0,submitted:-1,graded:{}});
 shuffled.forEach((q,i)=>batch.set(doc(db,'liveRooms',id,'keys',String(i)),{answer:q.answer,acceptedAnswers:q.acceptedAnswers||[],yearRange:q.yearRange||null,question:q.question}));
 await batch.commit();listenRoom(id);
}
async function join(form){
 const data=Object.fromEntries(new FormData(form));const id=String(data.code).toUpperCase().trim();
 if(!/^[A-Z2-9]{8}$/.test(id))throw new Error('Romkoden skal ha åtte tegn.');
 const existing=await getDoc(doc(db,'liveRooms',id));if(!existing.exists())throw new Error('Fant ikke rommet.');
 const name=short(data.name);localStorage.setItem('qh-live-name',name);
 const member=doc(db,'liveRooms',id,'players',uid);
 if(!(await getDoc(member)).exists()){
  if(existing.data().phase!=='lobby')throw new Error('Quizen har allerede startet. Nye spillere kan ikke bli med.');
  await setDoc(member,{uid,name,score:0,submitted:-1,graded:{}});
 }
 listenRoom(id);
}
async function submit(value){
 const idx=room.index;const name=short(value);
 if(!name)return;
 await runTransaction(db,async t=>{
  const member=doc(db,'liveRooms',roomCode,'players',uid),snap=await t.get(member);
  if(!snap.exists()||snap.data().submitted===idx)throw new Error('Svaret er allerede levert.');
  t.set(answersRef(idx,uid),{uid,position:idx,value:name,createdAt:serverTimestamp()});
  t.update(member,{submitted:idx});
 });
 draft='';render();
}
async function reveal(){
 if(room.owner!==uid)return;
 const allReady=players.every(p=>p.submitted===room.index);
 if(!allReady&&!confirm('Ikke alle har levert. Vil du likevel avslutte svarrunden?'))return;
 await updateDoc(roomRef(),{revealed:true});
 const idx=room.index;
 const ss=await getDoc(secretRef(idx));const key=ss.data();
 const entries=await Promise.all(players.map(async p=>({p,s:await getDoc(answersRef(idx,p.uid))})));
 for(const {p,s} of entries){
  if(!s.exists())continue;
  const graded=checkOpenAnswer(key,s.data().value).status==='correct'?1:0;
  await grade(p.uid,graded,idx);
 }
}
async function grade(player,verdict,idx=room.index){
 if(room.owner!==uid)throw new Error('Bare quizmaster kan rette.');
 const ref=doc(db,'liveRooms',roomCode,'players',player),k=String(idx);
 await runTransaction(db,async t=>{
  const snap=await t.get(ref);if(!snap.exists())throw new Error('Ukjent spiller.');
  const d=snap.data(),previous=d.graded?.[k];
  t.update(ref,{score:Math.max(0,Number(d.score||0)+verdict-(previous===1?1:0)),['graded.'+k]:verdict});
 });
}
function leave(){cleanup();const u=new URL(location.href);u.searchParams.delete('live');history.replaceState(null,'',u);location.assign('/');}
async function handle(a,el){
 if(a==='leave'){leave();return;}
 if(a==='login'){location.assign('/?online=1');return;}
 if(a==='copy'||a==='share'){
  const url=link();
  if(a==='share'&&navigator.share){try{await navigator.share({title:'QuizHub live',text:'Bli med i live-quizen min!',url});return;}catch(e){if(e.name==='AbortError')return;}}
  if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url);alert('Invitasjonslenken er kopiert.');}else prompt('Kopier lenken',url);
 }
 if(a==='start'&&room.owner===uid)await updateDoc(roomRef(),{phase:'playing'});
 if(a==='reveal')await reveal();
 if(a==='approve')await grade(el.dataset.player,1);
 if(a==='reject')await grade(el.dataset.player,0);
 if(a==='next'&&room.owner===uid){
  if(room.index+1>=room.total)await updateDoc(roomRef(),{phase:'finished'});
  else await updateDoc(roomRef(),{index:room.index+1,revealed:false});
 }
}
root.addEventListener('click',async e=>{
 const el=e.target.closest('[data-live]');if(!el)return;e.preventDefault();
 try{await handle(el.dataset.live,el);}catch(ex){error=ex.message;render();}
});
root.addEventListener('submit',async e=>{
 if(!['live-create','live-join','live-answer-form'].includes(e.target.id))return;e.preventDefault();
 try{error='';if(e.target.id==='live-create')await create(e.target);else if(e.target.id==='live-join')await join(e.target);else await submit(new FormData(e.target).get('answer'));}
 catch(ex){error=ex.message;render();}
});
root.addEventListener('input',e=>{if(e.target.id==='live-answer')draft=e.target.value;});
export function startLive(){
 onAuthStateChanged(auth,u=>{user=u;uid=u?.uid||null;if(mode==='landing'){render();const requested=new URL(location.href).searchParams.get('live');if(requested&&u){const inp=document.querySelector('#live-join [name=code]');if(inp)inp.value=requested;}}});
 render();
}
