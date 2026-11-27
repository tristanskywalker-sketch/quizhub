import {PUSH_VAPID_KEY} from './config.js';
const fields=[['challenges','Nye utfordringer'],['results','Ferdige resultater'],['friend_requests','Venneforespørsler'],['friend_accepted','Godtatte venneforespørsler']];
const key='quizhub-push-v1';
function stored(){try{return JSON.parse(localStorage.getItem(key)||'null');}catch{return null;}}
export function pushPanel(uid){
 const s=stored(), active=s?.uid===uid, enabled=active&&globalThis.Notification?.permission==='granted';
 return '<div class="panel"><h2>🔔 Push-varsler</h2><p>Velg varsler for denne enheten. På iPhone må QuizHub være lagt til på hjemskjermen.</p>'+fields.map(([k,label])=>'<label class="friend-choice"><input type="checkbox" data-push-kind="'+k+'" '+(!active||s.flags[k]?'checked':'')+'><span>'+label+'</span></label>').join('')+'<div class="actions"><button class="btn" data-ol="pushsave">'+(enabled?'Lagre varslingsvalg':'Aktiver varsler')+'</button>'+(active?'<button class="btn secondary" data-ol="pushremove">Deaktiver varsler</button>':'')+'</div></div>';
}
let listener=null;
async function sdk(app){
 const m=await import('https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging.js');
 if(!await m.isSupported())throw Error('Push støttes ikke på denne enheten eller nettleseren.');
 const messaging=m.getMessaging(app);
 if(!listener)listener=m.onMessage(messaging,async payload=>{
  const reg=await navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope');
  if(reg?.active&&Notification.permission==='granted')await reg.showNotification(payload.data?.title||'QuizHub',{body:payload.data?.body||'',icon:'/icon.svg',data:{path:payload.data?.path||'/?online=1'}});
 });
 return {m,messaging};
}
export async function savePush(app,uid,rpc){
 if(!globalThis.Notification||!navigator.serviceWorker)throw Error('Push støttes ikke. På iPhone: åpne QuizHub fra hjemskjermen.');
 const flags=Object.fromEntries(fields.map(([k])=>[k,!!document.querySelector('[data-push-kind="'+k+'"]')?.checked]));
 if(await Notification.requestPermission()!=='granted')throw Error('Varsler er ikke tillatt i telefonens innstillinger.');
 const {m,messaging}=await sdk(app);
 const registration=await navigator.serviceWorker.register('/firebase-messaging-sw.js',{scope:'/firebase-cloud-messaging-push-scope'});
 if(!registration.active)await new Promise((resolve,reject)=>{const w=registration.installing||registration.waiting; if(!w)return reject(Error('Push kunne ikke startes.'));const t=setTimeout(()=>reject(Error('Push kunne ikke startes. Prøv igjen.')),15000);const check=()=>{if(w.state==='activated'){clearTimeout(t);resolve();}if(w.state==='redundant'){clearTimeout(t);reject(Error('Push kunne ikke startes.'));}};w.addEventListener('statechange',check);check();});
 const token=await m.getToken(messaging,{vapidKey:PUSH_VAPID_KEY,serviceWorkerRegistration:registration});
 if(!token)throw Error('Kunne ikke hente push-token.');
 await rpc('push_save',{token,...flags});
 const old=stored();if(old?.uid===uid&&old.token!==token)await rpc('push_remove',{token:old.token}).catch(()=>{});
 localStorage.setItem(key,JSON.stringify({uid,token,flags}));
}
export async function removePush(app,uid,rpc){
 const s=stored();if(s?.uid!==uid)return;
 await rpc('push_remove',{token:s.token});
 localStorage.removeItem(key);
 try{const {m,messaging}=await sdk(app);await m.deleteToken(messaging);}catch{}
}
export async function refreshPush(app,uid,rpc){
 const s=stored();if(s?.uid!==uid)return;
 if(Notification.permission!=='granted'){await removePush(app,uid,rpc);return;}
 const {m,messaging}=await sdk(app);
 const registration=await navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope');
 if(!registration?.active)return;
 const token=await m.getToken(messaging,{vapidKey:PUSH_VAPID_KEY,serviceWorkerRegistration:registration});
 if(!token)return;
 await rpc('push_save',{token,...s.flags});
 if(token!==s.token)await rpc('push_remove',{token:s.token});
 localStorage.setItem(key,JSON.stringify({...s,token}));
}
