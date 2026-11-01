// Customer discovery: visitors answer a few questions and send them to the RobotLab team.
// GitHub Pages has no server, so answers go to one of these (fill in exactly one):
//  - FEEDBACK_ENDPOINT: a form service URL that accepts a POST (Formspree, or a Google Apps Script web app writing to a Sheet).
//  - FEEDBACK_EMAIL: opens the visitor's email app with the answers filled in (shows this address publicly).
// With neither set, visitors can still download their answers.
const FEEDBACK_ENDPOINT='';
const FEEDBACK_EMAIL='marinedenolle@gmail.com';

(() => {
 const form=$('feedback-form');
 if(!form)return;
 const ROLES={kid:'I’m a kid who builds',parent:'I’m a parent',teacher:'I’m a teacher or club leader',other:'Something else'};
 $('f-role').innerHTML=Object.entries(ROLES).map(([k,label])=>`<label class="chip"><input type="radio" name="role" value="${k}" required><span>${esc(label)}</span></label>`).join('');
 const grownup=()=>['parent','teacher'].includes((form.querySelector('input[name=role]:checked')||{}).value);
 form.addEventListener('change',()=>{$('f-contact').hidden=!grownup();});
 const QUESTIONS=[['built','Have you built a robot before? What happened?'],['hardest','What is the hardest part about building robots?'],['dream','If you could build any robot, what would it do?'],['more','Anything else you want to tell us?']];

 function answers(){
  const role=(form.querySelector('input[name=role]:checked')||{}).value||'';
  const a={role:ROLES[role]||'',page:location.pathname.split('/').pop()||'index.html'};
  for(const [k] of QUESTIONS)a[k]=$('f-'+k).value.trim();
  a.email=grownup()?$('f-email').value.trim():'';
  return a;
 }
 const asText=a=>['ROBOTLAB FEEDBACK','Who: '+(a.role||'not given'),...QUESTIONS.map(([k,q])=>`\n${q}\n${a[k]||'-'}`),a.email?'\nOK to follow up: '+a.email:''].join('\n');
 const say=(msg,ok)=>{$('f-status').textContent=msg;$('f-status').className=ok?'f-ok':'';};

 form.addEventListener('submit',async e=>{
  e.preventDefault();
  const a=answers();
  if(!QUESTIONS.some(([k])=>a[k])){say('Type an answer to at least one question first.');return;}
  if(form.elements._gotcha.value)return; // bots fill hidden fields; people never see it
  if(FEEDBACK_ENDPOINT){
   $('f-send').disabled=true;say('Sending…');
   try{
    const res=await fetch(FEEDBACK_ENDPOINT,{method:'POST',headers:{Accept:'application/json'},body:new URLSearchParams({...a,_subject:'RobotLab feedback'})});
    if(!res.ok)throw new Error(res.status);
    form.reset();$('f-contact').hidden=true;say('Thank you! We got your message.',true);
   }catch{say('Sending didn’t work. Check your internet and try again, or download your answers below.');}
   finally{$('f-send').disabled=false;}
  }else if(FEEDBACK_EMAIL){
   location.href=`mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent('RobotLab feedback')}&body=${encodeURIComponent(asText(a))}`;
   say(`Your email app should open with your answers. Press send there. If nothing opens, download your answers and email them to ${FEEDBACK_EMAIL}.`,true);
  }else say('Sending isn’t switched on yet. You can download your answers instead.');
 });
 $('f-download').onclick=()=>download(asText(answers()),'robotlab-feedback.txt');
})();
