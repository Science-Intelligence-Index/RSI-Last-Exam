import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {routes,locales,resources,domains,resourceHref} from '../src/content.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const pages=walk(dist).filter(f=>f.endsWith('.html'));
const errors=[];let references=0;
const resourceIds=new Set();
for(const resource of resources){
 if(resourceIds.has(resource.id))errors.push(`Duplicate resource: ${resource.id}`);
 resourceIds.add(resource.id);
 if(!['task','resource','tool','platform'].includes(resource.type))errors.push(`Unknown resource type: ${resource.id}`);
 for(const id of resource.domainIds)if(!domains.some(domain=>domain.id===id))errors.push(`Unknown resource domain: ${resource.id}/${id}`);
 if(resource.path&&!routes.includes(resource.path))errors.push(`Unknown resource route: ${resource.id}`);
 if(!resource.path&&!resource.externalUrl)errors.push(`Resource needs a destination: ${resource.id}`);
 if(resource.externalUrl){try{if(new URL(resource.externalUrl).protocol!=='https:')throw new Error();}catch{errors.push(`Invalid external resource URL: ${resource.id}`);}}
}
// Exact output inventory also catches stale or accidentally copied attachments.
const relative=file=>path.relative(dist,file).split(path.sep).join('/');
const expected=new Set(['index.html','404.html']);
for(const language of locales)for(const route of routes)expected.add([language,route,'index.html'].filter(Boolean).join('/'));
const publicRoot=path.join(root,'public');
for(const file of walk(publicRoot))expected.add(path.relative(publicRoot,file).split(path.sep).join('/'));
const actual=new Set(walk(dist).map(relative));
for(const file of actual)if(!expected.has(file))errors.push(`Unexpected build file: ${file}`);
for(const file of expected)if(!actual.has(file))errors.push(`Missing build file: ${file}`);
function checkLink(raw,file){
 if(/^(https?:|mailto:|data:)/.test(raw))return;
 references++;
 const decoded=decodeURIComponent(raw.replaceAll('&amp;','&'));
 const [location,anchor]=decoded.split('#');
 const pathname=location.split('?')[0];
 let target=pathname.startsWith('/')?path.join(dist,pathname):path.resolve(path.dirname(file),pathname||path.basename(file));
 if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
 if(!fs.existsSync(target)){errors.push(`${path.relative(dist,file)}: missing ${raw}`);return;}
 if(anchor&&target.endsWith('.html')){const source=fs.readFileSync(target,'utf8');if(![...source.matchAll(/\bid="([^"]+)"/g)].some(m=>m[1]===anchor))errors.push(`Missing anchor ${raw}`);}
}
for(const file of pages){
 const html=fs.readFileSync(file,'utf8'),relative=path.relative(dist,file);
 if(relative!=='index.html'&&(html.match(/<h1\b/g)||[]).length!==1)errors.push(`${relative}: expected one h1`);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);if(ids.length!==new Set(ids).size)errors.push(`${relative}: duplicate IDs`);
 for(const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g))checkLink(m[1],file);
 for(const m of html.matchAll(/<img\b[^>]*>/g))if(!/\balt="[^"]+"/.test(m[0]))errors.push(`${relative}: image needs alt`);
 if(/<script[^>]+src="https?:/.test(html))errors.push(`${relative}: unexpected external script`);
}
for(const language of locales)for(const route of routes)if(!fs.existsSync(path.join(dist,language,route,'index.html')))errors.push(`Missing ${language}/${route}`);
for(const language of locales){
 const catalog=fs.readFileSync(path.join(dist,language,'explore/index.html'),'utf8');
 for(const resource of resources){
  if(!catalog.includes(`data-resource-id="${resource.id}"`))errors.push(`Missing catalog resource: ${language}/${resource.id}`);
  if(!catalog.includes(`href="${resourceHref(resource,language)}"`))errors.push(`Missing resource destination: ${language}/${resource.id}`);
 }
 const material=fs.readFileSync(path.join(dist,language,'domains/materials/index.html'),'utf8');
 const scoped=material.match(/<div class="resource-links">([\s\S]*?)<\/div>/)?.[1]||'';
 for(const resource of resources){
  const present=scoped.includes(`href="${resourceHref(resource,language)}"`);
  if(present!==resource.domainIds.includes('materials'))errors.push(`Material resource scope mismatch: ${language}/${resource.id}`);
 }
}
const data=JSON.parse(fs.readFileSync(path.join(dist,'downloads/teaching-pair.json'),'utf8'));
if(data.observations.length!==2||data.observations[0].target_index!==1||data.observations[1].target_index!==0)errors.push('Teaching reference mismatch');
if(!data.notice.includes('Third-party public teaching records')||!data.notice.includes('does not represent SII Bench'))errors.push('Missing third-party teaching scope');
if(!fs.readFileSync(path.join(dist,'downloads/DATA-NOTICE.md'),'utf8').includes('QM9S'))errors.push('Missing teaching source notice');
for(const file of ['public/assets/site.js','src/views.mjs','src/ecosystem.mjs','scripts/dev.mjs'])execFileSync(process.execPath,['--check',file],{cwd:root,stdio:'inherit'});
const jsBytes=fs.statSync(path.join(dist,'assets/site.js')).size;
if(jsBytes>102400)errors.push('Initial JS exceeds 100 KB budget');
console.log(JSON.stringify({passed:errors.length===0,pages:pages.length,localizedPages:routes.length*locales.length,localReferences:references,initialJavaScriptBytes:jsBytes,errors},null,2));
if(errors.length)process.exitCode=1;
