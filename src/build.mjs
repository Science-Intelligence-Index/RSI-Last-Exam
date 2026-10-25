import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {locales,routes} from './content.mjs';
import {render} from './views.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
// Recreate only this checkout's build directory so removed files cannot remain public.
if(path.relative(root,dist)!=='dist')throw new Error('Unexpected build directory');
fs.rmSync(dist,{recursive:true,force:true});
fs.mkdirSync(dist,{recursive:true});
fs.cpSync(path.join(root,'public'),dist,{recursive:true});
let count=0;
for(const lang of locales)for(const route of routes){
 const folder=path.join(dist,lang,route);fs.mkdirSync(folder,{recursive:true});
 fs.writeFileSync(path.join(folder,'index.html'),render(route,lang));count++;
}
fs.writeFileSync(path.join(dist,'index.html'),'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=/en/"><title>SII · Scientific Intelligence Index</title></head><body><p><a href="/en/">SII · English</a> · <a href="/zh/">中文</a></p></body></html>');
fs.writeFileSync(path.join(dist,'404.html'),'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found · SII</title><link rel="stylesheet" href="/assets/site.css"></head><body><main class="shell page-hero"><p class="eyebrow">SII · 404</p><h1>That page is not here.</h1><p class="page-deck">这个页面不存在。请返回首页。</p><div class="actions"><a class="button primary" href="/en/">Home</a><a class="button secondary" href="/zh/">中文首页</a></div></main></body></html>');
console.log(`Built ${count} localized pages + entry and 404 pages → dist/`);
