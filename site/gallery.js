(() => {
 const dialog=document.getElementById('robot-dialog');
 if(!dialog)return;
 let preview='rover';
 function showRobot(type){
  if(!Object.prototype.hasOwnProperty.call(recipes,type))return;
  preview=type;const r=recipes[type];
  const picture=document.getElementById('robot-dialog-image');
  picture.src='images/'+type+'.svg';picture.alt='Illustration of '+r.title;
  document.getElementById('robot-dialog-title').textContent=r.title;
  document.getElementById('robot-dialog-description').textContent=r.desc;
  document.getElementById('robot-dialog-limit').textContent='What it can do: '+r.limit;
  const meta=document.getElementById('robot-dialog-meta');meta.replaceChildren();
  for(const label of [r.level,r.time+' · estimate',r.code?'Coding project':'No coding needed']){const span=document.createElement('span');span.textContent=label;meta.append(span);}
  dialog.showModal();
 }
 document.addEventListener('click',event=>{const button=event.target.closest('[data-preview]');if(button)showRobot(button.dataset.preview)});
 document.getElementById('close-robot-dialog').onclick=()=>dialog.close();
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 document.getElementById('build-preview-robot').onclick=()=>{dialog.close();resetDiscovery();selectProject(preview);openGuide(savedBuilds[preview]||null);};
})();
