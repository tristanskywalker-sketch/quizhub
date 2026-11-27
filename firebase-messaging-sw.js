self.addEventListener('notificationclick',event=>{
 event.stopImmediatePropagation();event.notification.close();
 const path=event.notification.data?.path||'/?online=1';
 const url=new URL(path,self.location.origin);
 if(url.origin!==self.location.origin)return;
 event.waitUntil(self.clients.openWindow(url.href));
});
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js','https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js');
firebase.initializeApp({
  apiKey: "AIzaSyCchppJmZTfhmx9C8DX_Zo0mmJtUMXdvoA",
  authDomain: "quizhub-9d92a.firebaseapp.com",
  projectId: "quizhub-9d92a",
  messagingSenderId: "536167800112",
  appId: "1:536167800112:web:05ba0d1807510cbe247cf5"
});
firebase.messaging().onBackgroundMessage(payload=>self.registration.showNotification(payload.data?.title||'QuizHub',{body:payload.data?.body||'',icon:'/icon.svg',data:{path:payload.data?.path||'/?online=1'}}));
