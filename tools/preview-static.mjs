import http from 'node:http';
import {readFile,stat,realpath} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const portIndex=process.argv.indexOf('--port');const port=portIndex<0?4173:Number(process.argv[portIndex+1]);if(!Number.isInteger(port)||port<1024||port>65535)throw Error('Invalid local preview port');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.ttf':'font/ttf','.woff':'font/woff','.woff2':'font/woff2'};
http.createServer(async(request,response)=>{
 response.setHeader('X-Content-Type-Options','nosniff');response.setHeader('Cache-Control','no-store');
 if(!['GET','HEAD'].includes(request.method)){response.writeHead(405,{'Allow':'GET, HEAD'});response.end();return;}
 try{const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);let target=path.resolve(root,'.'+pathname);let rel=path.relative(root,target);if(rel.startsWith('..')||path.isAbsolute(rel)){response.writeHead(403);response.end();return;}if((await stat(target)).isDirectory())target=path.join(target,'index.html');const resolved=await realpath(target),realRoot=await realpath(root);rel=path.relative(realRoot,resolved);if(rel.startsWith('..')||path.isAbsolute(rel)){response.writeHead(403);response.end();return;}const body=await readFile(resolved);response.writeHead(200,{'Content-Type':types[path.extname(resolved)]||'application/octet-stream'});response.end(request.method==='HEAD'?undefined:body);
 }catch{try{const body=await readFile(path.join(root,'404.html'));response.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});response.end(request.method==='HEAD'?undefined:body);}catch{response.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});response.end('Bulunamadı');}}
}).listen(port,'127.0.0.1',()=>process.stdout.write('Yerel önizleme: http://127.0.0.1:'+port+'\nDurdurmak için Ctrl+C. Bu komut yayın yapmaz.\n'));
