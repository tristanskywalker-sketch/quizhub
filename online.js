import {FIREBASE_CONFIG,ONLINE_API_URL} from './config.js';
import {initializeApp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut,sendEmailVerification,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
let auth;

const root=document.querySelector('#app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let session=null,profile=null,screen='home',active=null,questionIndex=0,answers=[],busy=false,notice='';
const fromHash=()=>{const u=new URL(window.location.href);return u.searchParams.get('join')||''};
function shell(content){root.innerHTML=`<header class="top"><div class="logo">QUIZ<b>HUB</b><div class="tag">Utfordre venner – spill når det passer</div></div><button class="btn ghost" data-ol="exit">Hjem</button></header><main class="online-layout">${notice?`<div class="notice" role="status">${esc(notice)}</div>`:''}${content}</main>`;}
function button(text,act,props=''){return `<button type="button" class="btn" data-ol="${act}" ${props}>${text}</button>`;}
function err(e){let t=e?.message||String(e);return t.replace(/duplicate key[^.]+/i,'Brukernavnet er allerede opptatt.').replace('Invalid login credentials','Feil e-post eller passord.').replace('Email not confirmed','Bekreft e-postadressen før du logger inn.');}
function note(text){notice=text;console.warn(text);}
function configured(){return Boolean(FIREBASE_CONFIG.apiKey&&FIREBASE_CONFIG.projectId&&FIREBASE_CONFIG.authDomain&&FIREBASE_CONFIG.appId&&/^https:\/\/[^/]+\.workers\.dev\/?$/.test(ONLINE_API_URL));}
async function rpc(name,params={}){
 const user=auth?.currentUser;if(!user)throw new Error('Du må logge inn.');
 const actions={qh_list:'list',qh_set_username:'set_username',qh_create:'create',qh_join:'join',qh_detail:'detail',qh_submit:'submit',qh_review:'review'};
 const map={p_username:'username',p_mode:'mode',p_count:'count',p_hours:'hours',p_invitees:'invitees',p_code:'code',p_id:'id',p_answers:'answers',p_position:'position',p_accept:'accept',p_username_review:'username'};
 const mapped={};for(const [k,v] of Object.entries(params))mapped[map[k]||k]=v;
 const response=await fetch(ONLINE_API_URL.replace(/\/$/,'')+'/api',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+await user.getIdToken()},body:JSON.stringify({action:actions[name]||name,params:mapped})});
 const body=await response.json().catch(()=>({error:'Ugyldig serversvar'}));if(!response.ok)throw new Error(body.error||'Serverfeil');return body.data;
}
async function getProfile(){if(!auth?.currentUser){profile=null;return;}profile=await rpc('profile');}
async function init(){
 if(!configured()){shell(`<h1 class="heading">Online-utfordringer</h1><div class="panel"><h2>Firebase-oppsett mangler</h2><p>Fyll ut Firebase-verdiene og Cloudflare Worker-adressen i <code>config.js</code>.</p><p>Se <code>README.md</code> i v26-pakken for stegvis oppsett av Firebase Authentication og Cloudflare D1.</p>${button('Tilbake til QuizHub','exit')}</div>`);return;}
 try{
  const app=initializeApp(FIREBASE_CONFIG);auth=getAuth(app);
  await new Promise(resolve=>onAuthStateChanged(auth,()=>resolve(),()=>resolve()));
  if(auth.currentUser&&!auth.currentUser.emailVerified){await signOut(auth);note('Bekreft e-posten din før du logger inn.');}
  session=auth.currentUser?{user:{id:auth.currentUser.uid}}:null;
  await getProfile();await showHome();
 }catch(e){note('Kunne ikke starte Firebase: '+err(e));shell(`${button('Prøv igjen','refresh')} ${button('Hjem','exit')}`);}
}
function authView(){shell(`<h1 class="heading">Utfordre venner</h1><p class="sub">Opprett konto én gang, og spill mot venner på hver deres mobil – når det passer.</p><div class="panel"><h2>Logg inn</h2><form id="ol-login" class="ol-form"><label>E-post<input name="email" type="email" autocomplete="email" required></label><label>Passord<input name="password" type="password" autocomplete="current-password" minlength="6" required></label><button class="btn" type="submit">Logg inn</button></form><div class="ol-divider">Ny spiller?</div><h3>Opprett konto</h3><form id="ol-signup" class="ol-form"><label>E-post<input name="email" type="email" autocomplete="email" required></label><label>Passord (minst 6 tegn)<input name="password" type="password" autocomplete="new-password" minlength="6" required></label><button class="btn secondary" type="submit">Registrer konto</button></form><p class="tiny">For å bruke samme profil på flere enheter logger du inn med samme e-post. Du får en bekreftelseslenke fra Firebase på e-post. Bekreft adressen før du spiller.</p></div>`);}
function usernameView(){shell(`<h1 class="heading">Velg brukernavn</h1><p class="sub">Vennene dine kan invitere deg med dette navnet.</p><div class="panel"><form id="ol-username" class="ol-form"><label>Brukernavn<input name="username" pattern="[a-zA-Z0-9_]{3,24}" maxlength="24" placeholder="ola" autocomplete="off" required></label><button class="btn" type="submit">Lagre brukernavn</button></form></div>${button('Logg ut','logout')}`);}
async function showHome(){screen='home';active=null;questionIndex=0;if(!session){authView();return;}if(!profile){usernameView();return;}const listing=await rpc('qh_list');const current=Array.isArray(listing)?listing:[];shell(`<div class="eyebrow">Pålogget som ${esc(profile.username)}</div><h1 class="heading">Spill med venner</h1><p class="sub">Lag en quiz, inviter Ola eller flere venner, og svar innen fristen – uten å være pålogget samtidig.</p><div class="actions">${button('⚔️ Ny utfordring','new')}${button('🔗 Bli med med kode','join','class="btn secondary"')}${button('Oppdater','refresh','class="btn ghost"')}</div><h2>Mine utfordringer</h2>${current.length?current.map(c=>`<button class="ol-challenge" data-ol="open" data-id="${esc(c.id)}"><span><strong>${c.mode==='sports'?'🏆 Sport':c.mode==='geography'?'🌍 Geografi':'🧠 Allmenn'}</strong><small>Fra ${esc(c.owner)} · ${c.player_count} spillere · ${new Date(c.expires_at).toLocaleString('nb-NO')}</small></span><span class="pill">${c.closed?'Ferdig':c.submitted?'Levert':'Svar nå'}</span></button>`).join(''):'<div class="panel"><p class="muted">Ingen utfordringer ennå. Opprett en eller bli invitert av en venn.</p></div>'}<div class="actions">${button('Logg ut','logout','class="btn ghost"')}</div>`);
 if(fromHash()){const code=fromHash();history.replaceState(null,'',window.location.pathname);await joinCode(code);}
}
function createView(){screen='new';shell(`${button('← Tilbake','home','class="btn ghost"')}<h1 class="heading">Ny utfordring</h1><div class="panel"><form id="ol-create" class="ol-form"><label>Quiztype<select name="mode"><option value="sports">🏆 Sport</option><option value="geography">🌍 Geografi</option><option value="general">🧠 Allmennquiz</option></select></label><label>Antall spørsmål<select name="count"><option value="20">20</option><option value="15">15</option><option value="10">10</option><option value="5">5</option></select></label><label>Svarfrist<select name="hours"><option value="24">24 timer</option><option value="48">48 timer</option><option value="72">3 døgn</option></select></label><label>Inviter brukernavn (valgfritt)<input name="invitees" placeholder="ola, thomas" autocomplete="off"><small>Brukerne må ha registrert seg i QuizHub. Du kan også dele en lenke etterpå.</small></label><button class="btn" type="submit">Opprett utfordring</button></form><p class="tiny">Alle får samme spørsmål. Fasit og poeng skjules til alle har svart eller fristen er ute. Du deltar selv i utfordringen.</p></div>`);}
function joinView(){screen='join';shell(`${button('← Tilbake','home','class="btn ghost"')}<h1 class="heading">Bli med</h1><div class="panel"><form id="ol-join" class="ol-form"><label>Invitasjonskode<input name="code" maxlength="8" placeholder="A1B2C3D4" required></label><button class="btn" type="submit">Bli med i utfordringen</button></form></div>`);}
async function joinCode(code){try{const id=await rpc('qh_join',{p_code:code});await openChallenge(id);}catch(e){note(err(e));joinView();}}
function draftKey(id){return `quizhub-online-draft-${session?.user?.id}-${id}`;}
function loadDraft(detail){try{const x=JSON.parse(localStorage.getItem(draftKey(detail.id)));return Array.isArray(x)&&x.length===detail.questions.length?x:Array(detail.questions.length).fill('');}catch{return Array(detail.questions.length).fill('');}}
async function openChallenge(id){const data=await rpc('qh_detail',{p_id:id});active=data;screen='challenge';answers=loadDraft(data);questionIndex=0;challengeView();}
function challengeView(){const d=active;if(!d){showHome();return;}const dt=new Date(d.expires_at).toLocaleString('nb-NO');const players=d.players||[],q=d.questions[questionIndex];let html=`${button('← Mine utfordringer','home','class="btn ghost"')}<h1 class="heading">${d.mode==='sports'?'🏆 Sportsquiz':d.mode==='geography'?'🌍 Geografi':'🧠 Allmennquiz'}</h1><p class="sub">${d.questions.length} spørsmål · Frist: ${esc(dt)}</p><div class="panel"><strong>Invitasjonskode: <span class="ol-code">${esc(d.code)}</span></strong><div class="actions">${button('Kopier invitasjon','copy','class="btn secondary"')}</div><p class="tiny">Del lenken med venner. De kan registrere seg og bli med før quizfristen, så lenge utfordringen ikke er avsluttet.</p><h3>Deltagere</h3>${players.map(p=>`<span class="pill">${esc(p.username)} · ${p.submitted?'Levert':'Venter'}</span>`).join(' ')}</div>`;
 if(d.closed){const ranking=[...players].sort((a,b)=>(b.score??-1)-(a.score??-1));html+=`<div class="panel"><h2>Resultater</h2><table class="board"><thead><tr><th>Spiller</th><th>Poeng</th></tr></thead><tbody>${ranking.map((p,i)=>`<tr><td>${i+1}. ${esc(p.username)}</td><td>${p.submitted?`${p.score}/${d.questions.length}`:'Ikke levert'}</td></tr>`).join('')}</tbody></table><h3>Spørsmål og svar</h3>${d.questions.map((item,i)=>`<div class="ol-review"><strong>${i+1}. ${esc(item.question)}</strong><div class="ol-key">Fasit: ${esc(item.answer)}</div>${players.map(p=>{const ans=(p.responses||[]).find(a=>a.position===item.position);return `<div class="ol-answer"><span>${esc(p.username)}: ${esc(ans?.response||'–')} · ${ans?.verdict==='correct'?'✓ Riktig':ans?.verdict==='review'?'? Trenger vurdering':ans?.verdict==='incorrect'?'✗ Feil':'Ikke levert'}</span>${ans?.verdict==='review'&&d.owner_username===profile.username?`<span>${button('Godkjenn','approve',`data-username="${esc(p.username)}" data-pos="${item.position}"`)} ${button('Avvis','reject',`class="btn secondary" data-username="${esc(p.username)}" data-pos="${item.position}"`)}</span>`:''}</div>`}).join('')}</div>`).join('')}</div>`;
 }else if(d.submitted){html+=`<div class="panel"><h2>Du har levert ✓</h2><p>Resultatene blir tilgjengelige når alle har levert, eller når svarfristen går ut.</p>${button('Oppdater status','reload','class="btn secondary"')}</div>`;
 }else {if(q){html+=`<div class="panel"><div class="eyebrow">Spørsmål ${questionIndex+1} av ${d.questions.length}</div><div class="ol-progress"><div style="width:${((questionIndex+1)/d.questions.length)*100}%"></div></div><h2>${esc(q.question)}</h2><label class="ol-answer-label">Ditt svar<textarea id="ol-answer" rows="3" maxlength="500" placeholder="Skriv et åpent svar…">${esc(answers[questionIndex])}</textarea></label><p class="tiny">Du kan skrive bare etternavn ved personspørsmål. Små skrivefeil kan godkjennes. Ikke skriv flere alternative svar.</p><div class="actions">${button('← Forrige','prev',questionIndex===0?'disabled':'')}${button(questionIndex===d.questions.length-1?'Se gjennom svar →':'Neste →','next')}</div></div>`;
 }
 if(questionIndex===d.questions.length){html+=`<div class="panel"><h2>Se gjennom svarene</h2><p>Du har fylt ut ${answers.filter(x=>x.trim()).length} av ${answers.length} svarfelt.</p>${answers.map((a,i)=>`<button class="ol-challenge" data-ol="goto" data-index="${i}"><span>${i+1}. ${esc(d.questions[i].question)}</span><strong>${esc(a||'Ikke besvart')}</strong></button>`).join('')}<div class="actions">${button('← Tilbake','prev')}${button('Lever endelige svar','submit')}</div><p class="tiny">Innleveringen er endelig. Du kan ikke endre svar etterpå.</p></div>`;}
 }
 shell(html);
}
function saveAnswer(){if(!active||active.submitted||active.closed)return;const el=document.getElementById('ol-answer');if(el&&questionIndex<answers.length){answers[questionIndex]=el.value;localStorage.setItem(draftKey(active.id),JSON.stringify(answers));}}
async function doAction(el){if(busy)return;const a=el.dataset.ol;notice='';try{
 if(a==='exit'){window.location.assign('/');return;}
 if(a==='refresh'){await showHome();return;}
 if(a==='home'){await showHome();return;}
 if(a==='new'){createView();return;}
 if(a==='join'){joinView();return;}
 if(a==='open'){await openChallenge(el.dataset.id);return;}
 if(a==='reload'){await openChallenge(active.id);return;}
 if(a==='goto'){saveAnswer();questionIndex=Number(el.dataset.index);challengeView();return;}
 if(a==='next'){saveAnswer();questionIndex=Math.min(answers.length,questionIndex+1);challengeView();return;}
 if(a==='prev'){saveAnswer();questionIndex=Math.max(0,questionIndex-1);challengeView();return;}
 if(a==='copy'){const url=`${window.location.origin}${window.location.pathname}?join=${encodeURIComponent(active.code)}`;await navigator.clipboard.writeText(url);note('Invitasjonslenke kopiert!');challengeView();return;}
 if(a==='logout'){await signOut(auth);session=null;profile=null;await showHome();return;}
 if(a==='submit'){saveAnswer();const blank=answers.filter(x=>!x.trim()).length;if(!confirm(`Levere ${answers.length} svar nå${blank?` (${blank} tomme svar)`:''}? Du kan ikke endre dem senere.`))return;busy=true;await rpc('qh_submit',{p_id:active.id,p_answers:answers});localStorage.removeItem(draftKey(active.id));busy=false;await openChallenge(active.id);return;}
 if(a==='approve'||a==='reject'){busy=true;await rpc('qh_review',{p_id:active.id,username:el.dataset.username,p_position:Number(el.dataset.pos),p_accept:a==='approve'});busy=false;await openChallenge(active.id);return;}
 }catch(e){busy=false;note(err(e));if(active&&screen==='challenge')challengeView();else if(screen==='new')createView();else if(screen==='join')joinView();else await showHome();}}
async function doForm(form){if(busy)return;busy=true;notice='';const data=Object.fromEntries(new FormData(form));try{
 if(form.id==='ol-login'||form.id==='ol-signup'){
  if(form.id==='ol-signup'){
    const cred=await createUserWithEmailAndPassword(auth,data.email,data.password);
    await sendEmailVerification(cred.user);
    await signOut(auth);session=null;profile=null;note('Konto opprettet. Bekreft e-posten din og logg deretter inn.');
    busy=false;authView();return;
  }
  const cred=await signInWithEmailAndPassword(auth,data.email,data.password);
  if(!cred.user.emailVerified){await sendEmailVerification(cred.user).catch(()=>{});await signOut(auth);throw new Error('E-post må bekreftes. Vi har sendt en ny bekreftelseslenke.');}
  session={user:{id:cred.user.uid}};
  await getProfile();busy=false;await showHome();return;
 }
 if(form.id==='ol-username'){await rpc('qh_set_username',{p_username:data.username});await getProfile();busy=false;await showHome();return;}
 if(form.id==='ol-create'){const invitees=data.invitees.split(',').map(v=>v.trim().toLowerCase()).filter(Boolean);const id=await rpc('qh_create',{p_mode:data.mode,p_count:Number(data.count),p_hours:Number(data.hours),p_invitees:invitees});busy=false;await openChallenge(id);return;}
 if(form.id==='ol-join'){const id=await rpc('qh_join',{p_code:data.code});busy=false;await openChallenge(id);return;}
 }catch(e){busy=false;note(err(e));if(form.id==='ol-username')usernameView();else if(form.id==='ol-create')createView();else if(form.id==='ol-join')joinView();else authView();}}
root.addEventListener('click',e=>{const el=e.target.closest('[data-ol]');if(el){e.preventDefault();doAction(el);}});
root.addEventListener('submit',e=>{if(e.target.id.startsWith('ol-')){e.preventDefault();doForm(e.target);}});
root.addEventListener('input',e=>{if(e.target.id==='ol-answer')saveAnswer();});
init();
