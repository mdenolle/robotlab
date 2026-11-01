// Discover your robot: the builder says what they want and what they have,
// we rank the five starter robots and explain the match. Answers stay in this browser.
(() => {
 const form=$('discover-form');
 if(!form)return;
 const DOES={move:'Move around',draw:'Draw pictures',race:'Race',lights:'Light up and beep',company:'Keep me company',avoid:'Dodge obstacles',follow:'Follow a track'};
 const HAVE={markers:'Markers',cup:'Paper cup',brush:'Small scrub brush',tape:'Tape',cardboard:'Cardboard',batteries:'AA batteries and holder',motor:'Small vibration motor',arduino:'Arduino board, LEDs and wires',kit:'Robot car kit',computer:'A computer'};
 // What each robot does and the main things it needs (the full parts list is in its build guide).
 const FIT={
  brush:{does:['move','race'],needs:['brush','motor','batteries','tape'],minutes:40},
  artist:{does:['draw','move'],needs:['cup','markers','motor','batteries','tape'],minutes:60},
  desk:{does:['lights','company'],needs:['arduino','computer','cardboard','tape'],minutes:90},
  rover:{does:['move','avoid','race'],needs:['kit','arduino','computer','batteries'],minutes:240},
  line:{does:['move','follow','race'],needs:['kit','arduino','computer','tape'],minutes:240}
 };
 const STORE='robotlab-discovery-v1';
 const list=items=>items.map(i=>`<li>${esc(i)}</li>`).join('');
 const nameFor=(want,r)=>want.name?`${want.name}, your ${r.title.replace(/^The /,'')}`:r.title.replace(/^The /,'the ');

 const chips=(id,options,group)=>{$(id).innerHTML=Object.entries(options).map(([k,label])=>`<label class="chip"><input type="checkbox" name="${group}" value="${k}"><span>${esc(label)}</span></label>`).join('')};
 chips('d-does',DOES,'does');chips('d-have',HAVE,'have');

 function readForm(){
  const picked=g=>[...form.querySelectorAll(`input[name=${g}]:checked`)].map(i=>i.value);
  return {does:picked('does'),have:picked('have'),minutes:Number($('d-time').value),code:$('d-code').value,name:$('d-name').value.trim(),idea:$('d-idea').value.trim()};
 }
 function fillForm(want){
  form.querySelectorAll('input[name=does]').forEach(i=>i.checked=want.does.includes(i.value));
  form.querySelectorAll('input[name=have]').forEach(i=>i.checked=want.have.includes(i.value));
  if([60,180,600].includes(want.minutes))$('d-time').value=String(want.minutes);if(['no','maybe','yes'].includes(want.code))$('d-code').value=want.code;$('d-name').value=want.name||'';$('d-idea').value=want.idea||'';
 }

 function score(k,want){
  const f=FIT[k],r=recipes[k],why=[],heads=[];let s=0;
  const hits=f.does.filter(d=>want.does.includes(d));
  if(hits.length){s+=3*hits.length;why.push('It can '+hits.map(d=>DOES[d].toLowerCase()).join(' and ')+'.');}
  if(want.idea&&matchIdea(want.idea.toLowerCase())===k){s+=3;why.push('It matches your idea.');}
  const got=f.needs.filter(n=>want.have.includes(n)),missing=f.needs.filter(n=>!want.have.includes(n));
  s+=got.length;if(got.length)why.push('You already have: '+got.map(n=>HAVE[n].toLowerCase()).join(', ')+'.');
  if(f.minutes>want.minutes){s-=3;heads.push(`It takes about ${r.time}, more than the time you picked.`);}else why.push(`It fits your time: about ${r.time}.`);
  if(want.code==='no'&&r.code){s-=4;heads.push('It needs some coding on a computer.');}
  else if(want.code==='yes'&&!r.code){s-=1;heads.push('There is no coding in this one.');}
  else if(want.code==='yes'&&r.code){s+=1;why.push('You get to write code.');}
  else if(!r.code)why.push('No coding needed.');
  return {k,s,why,heads,missing:missing.map(n=>HAVE[n])};
 }
 const rank=want=>projectOrder.map(k=>score(k,want)).sort((a,b)=>b.s-a.s);

 function card(m,want){
  const r=recipes[m.k];
  return `<div class="d-top"><div class="d-picture"><img src="images/${m.k}.svg" alt="Illustration of ${esc(r.title)}" width="640" height="460"></div><div>
   <div class="eyebrow">${m===lastRanked[0]?'YOUR BEST MATCH':'ANOTHER GOOD MATCH'}</div>
   <h3>Meet ${esc(nameFor(want,r))}</h3><p>${esc(r.desc)}</p>
   <h4>Why it fits you</h4><ul>${list(m.why.length?m.why:['It is a good place to start.'])}</ul>
   ${m.heads.length?`<h4>Good to know</h4><ul>${list(m.heads)}</ul>`:''}
   <h4>You still need</h4>${m.missing.length?`<ul>${list(m.missing)}</ul>`:'<p>Nothing from our list. You have the main things already!</p>'}<p class="tiny">The full parts list is in the build guide.</p>
   <h4>Cool things to try</h4><ul>${list(r.cool)}</ul>
   <div class="guide-actions"><button type="button" class="primary" data-d-build="${m.k}">Start building <span>→</span></button><button type="button" class="secondary" id="d-save">Save my discovery ↓</button></div>
  </div></div>`;
 }
 let lastRanked=[],lastWant=null,shown=null;
 function render(want,pick){
  lastWant=want;lastRanked=rank(want);shown=lastRanked.find(m=>m.k===pick)||lastRanked[0];
  const others=lastRanked.filter(m=>m!==shown).slice(0,2);
  $('discover-result').innerHTML=card(shown,want)+`<h4 class="d-others-title">${shown===lastRanked[0]?'Other good matches':'More matches'}</h4><div class="d-others">${others.map(m=>`<article><img src="images/${m.k}.svg" alt="" width="120" height="86"><div><h3>${esc(recipes[m.k].title)}</h3><p>${esc(m.why[0]||recipes[m.k].desc)}</p><button type="button" class="secondary" data-d-show="${m.k}">See this one →</button></div></article>`).join('')}</div>`;
  $('discover-result').hidden=false;
 }
 function saveText(){
  const m=shown,r=recipes[m.k],w=lastWant;
  return `MY ROBOTLAB DISCOVERY\n\nMeet ${nameFor(w,r)}\n${r.desc}\n\nWHAT I WANT IT TO DO\n${w.does.map(d=>DOES[d]).join(', ')||'Anything fun'}\n${w.idea?'My idea: '+w.idea+'\n':''}\nWHY IT FITS\n${m.why.map(x=>'- '+x).join('\n')}\n${m.heads.length?'\nGOOD TO KNOW\n'+m.heads.map(x=>'- '+x).join('\n')+'\n':''}\nI STILL NEED\n${m.missing.map(x=>'- '+x).join('\n')||'- Nothing from the list'}\n\nCOOL THINGS TO TRY\n${r.cool.map(x=>'- '+x).join('\n')}\n\nBuild guide: ${location.href.split('#')[0]}\n`;
 }

 form.addEventListener('submit',e=>{
  e.preventDefault();const want=readForm();render(want);
  try{localStorage.setItem(STORE,JSON.stringify(want))}catch{}
  $('discover-result').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
 });
 $('discover-result').addEventListener('click',e=>{
  const show=e.target.closest('[data-d-show]'),build=e.target.closest('[data-d-build]');
  if(show){render(lastWant,show.dataset.dShow);$('discover-result').scrollIntoView({block:'start'});}
  else if(build){const k=build.dataset.dBuild;resetDiscovery();selectProject(k);$('idea').value=[lastWant.name&&'Robot name: '+lastWant.name,lastWant.idea].filter(Boolean).join('. ');openGuide(savedBuilds[k]||null);}
  else if(e.target.closest('#d-save'))download(saveText(),'my-robot-discovery.txt');
 });
 $('d-reset').onclick=()=>{form.reset();$('discover-result').hidden=true;try{localStorage.removeItem(STORE)}catch{}};
 try{const saved=JSON.parse(localStorage.getItem(STORE)||'null');if(saved&&Array.isArray(saved.does)&&Array.isArray(saved.have)){fillForm(saved);render(saved);}}catch{}
})();
