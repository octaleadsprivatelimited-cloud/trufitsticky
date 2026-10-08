import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root=resolve('dist');const port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.jpg':'image/jpeg','.webp':'image/webp','.png':'image/png','.xml':'application/xml','.txt':'text/plain','.mp4':'video/mp4'};
createServer(async(req,res)=>{
 try{
  const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let file=resolve(root,'.'+path);if(file!==root&&!file.startsWith(root+sep))throw new Error('path');
  let exists=await stat(file).catch(()=>null);
  if(exists?.isDirectory()){file=resolve(file,'index.html');exists=await stat(file).catch(()=>null)}
  if(!exists&&!extname(path)){file=resolve(root,'.'+path+'.html');exists=await stat(file).catch(()=>null)}
  if(!exists && /^\/coaches\/[a-z0-9_-]+$/i.test(path)){file=resolve(root,'index.html');exists=await stat(file)}
  if(!exists){res.writeHead(404,{'Content-Type':'text/plain'});res.end('Page not found');return}
  const data=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream',...(path.startsWith('/payment')||path==='/survey'?{'X-Robots-Tag':'noindex, nofollow'}:{})});res.end(data);
 }catch{res.writeHead(400);res.end('Invalid request')}
}).listen(port,'127.0.0.1',()=>console.log(`Production preview: http://localhost:${port}`));
