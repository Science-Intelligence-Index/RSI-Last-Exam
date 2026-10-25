import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
const port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.json':'application/json; charset=utf-8','.md':'text/markdown; charset=utf-8','.txt':'text/plain; charset=utf-8','.woff2':'font/woff2'};
const build=()=>execFileSync(process.execPath,['src/build.mjs'],{cwd:root,stdio:'inherit'});
build();
const server=http.createServer((req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});res.end();return;}
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end('Bad request');return;}
 let file=path.resolve(dist,'.'+pathname);
 if(file!==dist&&!file.startsWith(dist+path.sep)){res.writeHead(403);res.end();return;}
 try{if(fs.statSync(file).isDirectory()){
   if(!pathname.endsWith('/')){res.writeHead(308,{'Location':pathname+'/'+new URL(req.url,'http://localhost').search});res.end();return;}
   file=path.join(file,'index.html');
 }}catch{}
 let status=200;if(!fs.existsSync(file)||!fs.statSync(file).isFile()){status=404;file=path.join(dist,'404.html');}
 res.writeHead(status,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Content-Security-Policy':"default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"});
 if(req.method==='HEAD')res.end();else fs.createReadStream(file).pipe(res);
});
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}/zh/`));
server.on('error',err=>{console.error(err.message);process.exitCode=1;});
const watchers=[];let timer;
if(!process.argv.includes('--no-watch'))for(const folder of ['src','public'])watchers.push(fs.watch(path.join(root,folder),{recursive:true},()=>{clearTimeout(timer);timer=setTimeout(()=>{try{build();console.log('Updated. Refresh the browser.');}catch{console.error('Build failed; previous preview remains available.');}},150);}));
function shutdown(){watchers.forEach(w=>w.close());clearTimeout(timer);server.close(()=>process.exit(0));}
process.on('SIGINT',shutdown);process.on('SIGTERM',shutdown);
