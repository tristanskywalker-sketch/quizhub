import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
http.createServer((req,res)=>{
 let raw;
 try {raw=decodeURIComponent((req.url||'/').split('?')[0]);}catch{res.writeHead(400);return res.end('Bad URL');}
 const safe=path.normalize(raw).replace(/^([/\\]|\.\.[/\\])+/g,'');
 const file=path.resolve(root,safe||'index.html');
 if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end('Forbidden');}
 fs.readFile(file,(err,data)=>{
   if(err){res.writeHead(404);return res.end('Not found');}
   res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);
 });
}).listen(process.env.PORT||3000,'0.0.0.0',()=>console.log('QuizHub started'));
