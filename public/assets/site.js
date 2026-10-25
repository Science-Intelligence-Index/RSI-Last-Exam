const zh = document.body.dataset.language === 'zh';
const t = (a,b) => zh ? a : b;
document.documentElement.classList.add('has-js');

const menu = document.querySelector('.menu-toggle');
const navigation = document.getElementById('main-navigation');
const mobile = window.matchMedia('(max-width: 900px)');
function closeMenu(returnFocus=false) {
  navigation.classList.remove('is-open');
  menu.setAttribute('aria-expanded','false');
  menu.setAttribute('aria-label',t('展开导航','Open navigation'));
  if(returnFocus)menu.focus();
}
function updateMenu(){menu.hidden=!mobile.matches;if(!mobile.matches)closeMenu();}
menu.addEventListener('click',()=>{
  const open=menu.getAttribute('aria-expanded')==='true';
  if(open)closeMenu();else{navigation.classList.add('is-open');menu.setAttribute('aria-expanded','true');menu.setAttribute('aria-label',t('收起导航','Close navigation'));}
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true')closeMenu(true);});
mobile.addEventListener('change',updateMenu);updateMenu();

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('[data-process]').forEach(container=>{
  const steps=[...container.querySelectorAll('[data-step]')];
  const caption=container.querySelector('[data-process-caption]');
  const control=container.querySelector('[data-play-process]');
  const text=[
    t('从真实研究出发，关注有意义的科学问题。','Start with real research and meaningful scientific questions.'),
    t('与领域研究者共同交流知识、经验与科学挑战。','Exchange knowledge, experience and scientific challenges with domain researchers.'),
    t('尊重科学证据，清楚表达结论的依据与局限。','Respect scientific evidence and explain the basis and limits of conclusions.'),
    t('探索经验如何帮助 AI 面对新的科学问题。','Explore how experience can help AI face new scientific questions.'),
  ];
  let index=0, timer=null, playing=false, seen=false;
  function select(next){index=next;steps.forEach((s,i)=>{s.classList.toggle('is-active',i===index);s.setAttribute('aria-pressed',String(i===index));});caption.textContent=text[index];}
  function stop(){clearTimeout(timer);timer=null;playing=false;control.textContent=t('重播示意 ↻','Replay the illustration ↻');control.setAttribute('aria-label',t('重播研究愿景示意','Replay the research vision'));}
  function tick(){if(!playing)return;if(index>=3){stop();return;}select(index+1);timer=setTimeout(tick,850);}
  function play(){if(reduced.matches)return;clearTimeout(timer);select(0);playing=true;control.textContent=t('暂停示意 Ⅱ','Pause the illustration Ⅱ');control.setAttribute('aria-label',t('暂停研究愿景示意','Pause the research vision'));timer=setTimeout(tick,850);}
  steps.forEach((step,i)=>step.addEventListener('click',()=>{stop();select(i);}));
  control.addEventListener('click',()=>playing?stop():play());
  function preference(){stop();control.disabled=reduced.matches;if(reduced.matches){select(3);control.textContent=t('静态示意 · 减少动态效果','Static view · Reduced motion');}}
  reduced.addEventListener('change',preference);preference();
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting&&!seen){seen=true;play();}else if(!entry.isIntersecting&&playing)stop();}},{threshold:.35});observer.observe(container);}
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing)stop();});
});

const catalog = document.querySelector('[data-catalog]');
if(catalog){
 const search=catalog.querySelector('[data-catalog-search]');
 const type=catalog.querySelector('[data-catalog-type]');
 const entries=[...catalog.querySelectorAll('[data-catalog-item]')];
 function readUrl(){const params=new URL(location.href).searchParams;search.value=params.get('q')||'';type.value=['task','resource','tool'].includes(params.get('type'))?params.get('type'):'all';filter(false);}
 function filter(write=true){
   const query=search.value.trim().toLocaleLowerCase();let count=0;
   entries.forEach(entry=>{const match=(!query||entry.dataset.search.toLocaleLowerCase().includes(query))&&(type.value==='all'||entry.dataset.type===type.value);entry.hidden=!match;if(match)count++;});
   catalog.querySelector('[data-catalog-count]').textContent=t(`${count} 项公开阅读与教学入口`,`${count} public reading and teaching ${count===1?'entry':'entries'}`);
   catalog.querySelector('[data-catalog-empty]').hidden=count>0;
   if(write){const address=new URL(location.href);if(query)address.searchParams.set('q',search.value.trim());else address.searchParams.delete('q');if(type.value!=='all')address.searchParams.set('type',type.value);else address.searchParams.delete('type');history.replaceState(null,'',address);}
 }
 search.addEventListener('input',()=>filter());type.addEventListener('change',()=>filter());
 catalog.querySelector('[data-clear-filters]').addEventListener('click',()=>{search.value='';type.value='all';filter();search.focus();});
 window.addEventListener('popstate',readUrl);readUrl();
}

const demo=document.querySelector('[data-demo]');
if(demo){
 const form=demo.querySelector('form');
 const feedback=demo.querySelector('[data-demo-feedback]');
 const progress=demo.querySelector('[data-demo-progress]');
 const submit=form.querySelector('[type=submit]');
 let generation=0;
 function update(){const chosen=[0,1].filter(i=>form.querySelector(`input[name="observation-${i}"]:checked`)).length;submit.disabled=chosen!==2;progress.textContent=t(`已选择 ${chosen}/2`,`${chosen}/2 choices made`);if(!feedback.hidden){feedback.hidden=true;generation++;}}
 form.addEventListener('change',update);
 form.addEventListener('reset',()=>{generation++;feedback.hidden=true;submit.disabled=true;progress.textContent=t('请完成两次选择','Complete both choices');});
 form.addEventListener('submit',async event=>{
   event.preventDefault();if(!form.reportValidity())return;
   const ticket=++generation;submit.disabled=true;progress.textContent=t('读取公开参考…','Reading public references…');
   try{
     const response=await fetch('/downloads/teaching-pair.json');if(!response.ok)throw new Error('Data unavailable');
     const pair=await response.json();if(ticket!==generation)return;
     const choices=[0,1].map(i=>Number(form.querySelector(`input[name="observation-${i}"]:checked`).value));
     const references=pair.observations.map(o=>o.target_index);
     if(references.length!==2||references.some(x=>x!==0&&x!==1))throw new Error('Invalid teaching data');
     const correct=choices.filter((v,i)=>v===references[i]).length;
     feedback.replaceChildren();
     const heading=document.createElement('h2');heading.textContent=t(`参考已揭示 · 本次 ${correct}/2`, `References revealed · ${correct}/2 this time`);feedback.append(heading);
     const list=document.createElement('ul');choices.forEach((choice,i)=>{const li=document.createElement('li');li.textContent=t(`观测 ${i===0?'A':'B'}：你选择了候选 ${choice}，公开参考为候选 ${references[i]}。`,`Observation ${i===0?'A':'B'}: you selected candidate ${choice}; the public reference is candidate ${references[i]}.`);list.append(li);});feedback.append(list);
     const note=document.createElement('p');note.textContent=t('这只是当前教学记录的选择结果。两条观测属于同一族，未测量学习增益，也不能据此推断一般化学机制。','This is a result on the teaching records only. Both observations belong to one family; this does not measure learning gains or establish a general chemical mechanism.');feedback.append(note);
     feedback.hidden=false;progress.textContent=t('公开参考已显示，可重新选择。','Public references are visible. You can try again.');feedback.focus();
   }catch{if(ticket===generation)progress.textContent=t('参考读取失败。可重试，或下载教学 JSON。','Could not read references. Try again or download the teaching JSON.');}
   finally{if(ticket===generation)submit.disabled=false;}
 });
 const fields=form.querySelector('[data-demo-fields]');if(fields)fields.disabled=false;submit.disabled=true;
}

const draft=document.getElementById('contribution-form');
if(draft){
 const fields=draft.querySelector('[data-draft-fields]');
 const result=draft.querySelector('[data-draft-result]');
 const status=draft.querySelector('[data-draft-status]');
 const output=draft.querySelector('[data-draft-text]');
 const download=draft.querySelector('[data-draft-download]');
 let objectUrl=null, draftText='';
 const domain=new URL(location.href).searchParams.get('domain');
 if(domain&&[...draft.elements.domain.options].some(o=>o.value===domain))draft.elements.domain.value=domain;
 function release(){if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl=null;}download.removeAttribute('href');}
 draft.addEventListener('input',()=>{result.hidden=true;draftText='';release();status.textContent='';});
 draft.addEventListener('submit',event=>{
   event.preventDefault();
   for(const field of draft.querySelectorAll('[required]'))field.setCustomValidity(field.value.trim()?'':t('请填写有效内容，不能只有空格。','Please enter content rather than whitespace.'));
   if(!draft.reportValidity())return;
   const value=name=>draft.elements[name].value;
   const label=name=>draft.elements[name].selectedOptions[0].textContent;
   draftText=`# ${t('SII 合作意向','SII contribution enquiry')}\n\n${t('状态：本地草稿，尚未发送。','Status: local draft, not sent.')}\n\n${t('贡献类型','Contribution type')}: ${label('kind')}\n${t('科学领域','Scientific domain')}: ${label('domain')}\n${t('姓名','Name')}: ${value('name').trim()||'—'}\n\n## ${t('科学问题','Scientific question')}\n\n${value('question')}\n\n## ${t('验证依据','Validation criteria')}\n\n${value('validation')}\n\n## ${t('可提供的经验与资源','Experience and resources')}\n\n${value('resources')}\n`;
   output.textContent=draftText;release();objectUrl=URL.createObjectURL(new Blob([draftText],{type:'text/markdown;charset=utf-8'}));download.href=objectUrl;result.hidden=false;status.textContent=t('草稿已在本地生成，尚未发送。请下载或复制保存。','Draft generated locally, not sent. Download or copy it to keep a copy.');
 });
 draft.querySelectorAll('[required]').forEach(field=>field.addEventListener('input',()=>field.setCustomValidity('')));
 draft.querySelector('[data-draft-copy]').addEventListener('click',async()=>{if(!draftText)return;try{await navigator.clipboard.writeText(draftText);status.textContent=t('已复制。草稿尚未发送。','Copied. The draft has not been sent.');}catch{status.textContent=t('无法自动复制，请从预览中选择文字，或下载草稿。','Automatic copying is unavailable. Select text from the preview or download the draft.');output.focus();}});
 window.addEventListener('pagehide',release);fields.disabled=false;
}
