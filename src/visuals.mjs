export const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
export function icon(name, className='') {
  const paths = {
    check:'<path d="m6 12 4 4 8-9"/><circle cx="12" cy="12" r="10"/>',
    network:'<path d="M5 6 12 4l7 5-3 10-10-2L5 6l11 13M12 4 6 17m13-8L5 6"/><circle cx="5" cy="6" r="2"/><circle cx="16" cy="19" r="2"/>',
    loop:'<path d="M19 7a8 8 0 0 0-14 1M5 17a8 8 0 0 0 14-1M19 3v5h-5M5 21v-5h5"/>',
    file:'<path d="M6 3h8l4 4v14H6ZM14 3v5h4M9 12h6M9 16h6"/>',
    layers:'<path d="m3 7 9-4 9 4-9 4ZM3 12l9 4 9-4M3 17l9 4 9-4"/>',
    link:'<path d="m9 15 6-6M8 17l-1 1a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m0 10a4 4 0 0 0 6 0l5-5a4 4 0 0 0-6-6l-1 1" transform="translate(1 0) scale(.9)"/>',
  };
  return `<svg class="icon ${className}" viewBox="0 0 24 24" aria-hidden="true">${paths[name]||paths.network}</svg>`;
}
export function motif(id, className='') {
 const shapes = {
  materials:'<path d="m-65-21 35-20 35 20v41l-35 20-35-20Zm70 0 35-20 35 20v41L40 40 5 20M75-21h30M75 20l25 15"/><circle cx="-30" cy="-41" r="5"/><circle cx="40" cy="40" r="5"/><path d="m-53-14 23-13 23 13v27"/>',
  omics:'<path d="M-100-32-45 0 0-34 45 0 100-32M-100 32-45 0 0 34 45 0 100 32M0-34v68"/><circle cx="-45" r="7"/><circle cx="45" r="7"/><circle cy="-34" r="6"/><circle cy="34" r="6"/>',
  physics:'<path d="M-110 0q27-65 55 0T0 0T55 0T110 0M-110 0h220"/><circle cx="-55" r="5"/>',
  math:'<path d="M0-45-60 0-95 42M-60 0-25 42M0-45 60 0 95 42M60 0 25 42"/><circle cy="-45" r="6"/><circle cx="-60" r="6"/><circle cx="60" r="6"/>',
  ai:'<rect x="-108" y="-23" width="48" height="46" rx="7"/><rect x="-24" y="-23" width="48" height="46" rx="7"/><rect x="60" y="-23" width="48" height="46" rx="7"/><path d="M-60 0h36m48 0h36"/>',
  climate:'<ellipse rx="108" ry="43"/><ellipse rx="77" ry="31"/><ellipse rx="43" ry="17"/><path d="M-90-55q90 30 180 0M-90 55q90-30 180 0"/>',
  social:'<path d="m-75-30 75 64 75-64M-75-30H75M0 34v-78"/><circle cx="-75" cy="-30" r="10"/><circle cx="75" cy="-30" r="10"/><circle cy="34" r="10"/><circle cy="-44" r="8"/>',
 };
 return `<svg class="domain-motif ${className}" viewBox="0 0 320 180" aria-hidden="true"><g transform="translate(160 90)">${shapes[id]||shapes.materials}</g></svg>`;
}
export function scienceField() {
 const points=[];
 for(let row=0;row<7;row++)for(let col=0;col<13;col++){
   const x=40+col*102+Math.sin(row*4+col*2)*26;
   const y=24+row*88+Math.cos(col*2+row)*24;
   if(x>360&&x<960&&y<420)continue;
   points.push([x,y]);
 }
 const edges=points.flatMap((a,i)=>points.slice(i+1).flatMap((b,j)=>Math.hypot(a[0]-b[0],a[1]-b[1])<145?[`<path d="M${a[0].toFixed(1)} ${a[1].toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}"/>`]:[])).join('');
 return `<svg class="science-field" viewBox="0 0 1360 620" aria-hidden="true"><g class="field-edges">${edges}</g><g class="field-dots">${points.map(([x,y],i)=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i%9===0?3.2:1.8}" class="${i%9===0?'warm-node':''}"/>`).join('')}</g><ellipse cx="680" cy="300" rx="625" ry="290"/><ellipse cx="680" cy="300" rx="575" ry="260"/></svg>`;
}
export function processVisual(lang) {
 const zh=lang==='zh';
 const labels=zh?['科学问题','领域协作','证据与理解','持续探索']:['Scientific questions','Domain collaboration','Evidence & understanding','Continued exploration'];
 return `<div class="process-visual" data-process><div class="process-track">${labels.map((label,i)=>`<button type="button" class="process-step${i===0?' is-active':''}" data-step="${i}" aria-pressed="${i===0}"><span class="step-orb"><span>${String(i+1).padStart(2,'0')}</span></span><span>${label}</span></button>`).join('')}</div><div class="process-caption"><span class="concept-label">${zh?'研究愿景示意':'Research vision'}</span><p data-process-caption aria-live="polite">${zh?'从真实研究出发，关注有意义的科学问题。':'Start with real research and meaningful scientific questions.'}</p><button class="motion-button" type="button" data-play-process aria-label="${zh?'播放研究愿景示意':'Play the research vision'}">${zh?'播放示意':'Play the illustration'} <span aria-hidden="true">↻</span></button></div></div>`;
}
