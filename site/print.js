// Picture to 3D print: turn a photo or screenshot of a drawing into a printable STL, entirely in the browser.
// It makes flat (2.5D) parts: a raised drawing on a plate, the drawing's cut-out shape, or a plate with holes.
// It cannot rebuild a full 3D object from one photo. The picture never leaves the device.

const PRINT_GRID=160; // cells along the longest side of the picture

// Darkness of each pixel, after scaling the picture so its longest side is PRINT_GRID cells.
function pictureLuminance(img){
 const scale=PRINT_GRID/Math.max(img.naturalWidth,img.naturalHeight);
 const w=Math.max(1,Math.round(img.naturalWidth*scale)),h=Math.max(1,Math.round(img.naturalHeight*scale));
 const c=document.createElement('canvas');c.width=w;c.height=h;
 const ctx=c.getContext('2d',{willReadFrequently:true});
 ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.drawImage(img,0,0,w,h);
 const px=ctx.getImageData(0,0,w,h).data,lum=new Float32Array(w*h);
 for(let i=0;i<w*h;i++)lum[i]=0.299*px[4*i]+0.587*px[4*i+1]+0.114*px[4*i+2];
 return {w,h,lum};
}

// Otsu's threshold: the grey level that best separates drawing from paper.
function otsu(lum){
 const hist=new Float64Array(256);for(const v of lum)hist[Math.min(255,v|0)]++;
 let sum=0;for(let i=0;i<256;i++)sum+=i*hist[i];
 let sumB=0,wB=0,best=0,thr=128;
 for(let t=0;t<256;t++){wB+=hist[t];if(!wB)continue;const wF=lum.length-wB;if(!wF)break;sumB+=t*hist[t];
  const mB=sumB/wB,mF=(sum-sumB)/wF,between=wB*wF*(mB-mF)**2;if(between>best){best=between;thr=t;}}
 return thr;
}

// Label 4-connected groups of drawing cells; returns labels and the size of each group.
function components(mask,w,h){
 const label=new Int32Array(w*h).fill(-1),sizes=[],stack=[];
 for(let s=0;s<w*h;s++){if(!mask[s]||label[s]>=0)continue;const id=sizes.length;let n=0;stack.push(s);label[s]=id;
  while(stack.length){const p=stack.pop();n++;const x=p%w,y=(p/w)|0;
   for(const q of [x>0?p-1:-1,x<w-1?p+1:-1,y>0?p-w:-1,y<h-1?p+w:-1])if(q>=0&&mask[q]&&label[q]<0){label[q]=id;stack.push(q);}}
  sizes.push(n);}
 return {label,sizes};
}

// Drawing mask: 1 where the picture is drawing. darkness: 0.6 (only the darkest) to 1.4 (lighter marks too).
function drawingMask({w,h,lum},{darkness=1,invert=false,thicken=true}={}){
 // Otsu's level, moved by the slider; for light drawings on dark paper, count bright pixels instead.
 const base=otsu(lum),cut=invert?255-(255-base)*darkness:base*darkness;let mask=new Uint8Array(w*h);
 for(let i=0;i<w*h;i++)mask[i]=(invert?lum[i]>cut:lum[i]<cut)?1:0;
 // Drop specks (dust, paper texture) smaller than 0.1% of the picture.
 const {label,sizes}=components(mask,w,h),min=Math.max(4,Math.round(w*h*0.001));
 for(let i=0;i<w*h;i++)if(mask[i]&&sizes[label[i]]<min)mask[i]=0;
 if(thicken){const grown=mask.slice();
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(mask[y*w+x]){if(x>0)grown[y*w+x-1]=1;if(x<w-1)grown[y*w+x+1]=1;if(y>0)grown[(y-1)*w+x]=1;if(y<h-1)grown[(y+1)*w+x]=1;}
  mask=grown;}
 // Squares that touch only at a corner make an edge slicers must repair; join them by filling one neighbour.
 for(let pass=0,changed=true;changed&&pass<4;pass++){changed=false;
  for(let y=0;y<h-1;y++)for(let x=0;x<w-1;x++){const a=y*w+x,b=a+1,c=a+w,d=c+1;
   if(mask[a]&&mask[d]&&!mask[b]&&!mask[c]){mask[b]=1;changed=true;}
   else if(mask[b]&&mask[c]&&!mask[a]&&!mask[d]){mask[a]=1;changed=true;}}}
 return mask;
}

// Height of every cell in mm for the chosen kind of part, cropped to the drawing plus a margin.
// Returns null when there is no drawing.
function partHeights(mask,w,h,{kind='raised',sizeMM=70,heightMM=2,baseMM=2}={}){
 let x0=w,y0=h,x1=-1,y1=-1;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(mask[y*w+x]){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
 if(x1<0)return null;
 // A plate gets a border around the drawing; a face plate with holes needs a wider one.
 const margin=kind==='cutout'?0:Math.max(3,Math.round(Math.max(x1-x0,y1-y0)*(kind==='holes'?0.25:0.08)));
 const gx0=x0-margin,gy0=y0-margin,gw=x1-x0+1+2*margin,gh=y1-y0+1+2*margin;
 const cell=sizeMM/Math.max(gw,gh),hf=new Float32Array(gw*gh);
 for(let j=0;j<gh;j++)for(let i=0;i<gw;i++){
  const x=gx0+i,y=gy0+j,inside=x>=0&&y>=0&&x<w&&y<h,on=inside&&mask[y*w+x]===1;
  hf[j*gw+i]=kind==='raised'?(on?baseMM+heightMM:baseMM):kind==='holes'?(on?0:heightMM):(on?heightMM:0);}
 const pieces=kind==='raised'?1:components(hf.map(v=>v>0?1:0),gw,gh).sizes.length;
 return {hf,gw,gh,cell,pieces,widthMM:gw*cell,depthMM:gh*cell,tallMM:Math.max(...hf)};
}

// Watertight binary STL from a height field: a top and bottom face per filled cell,
// and a wall wherever a cell is taller than its neighbour (walls are added by the taller cell only).
function heightfieldToSTL(hf,gw,gh,cell){
 const tris=[];
 const quad=(a,b,c,d,n)=>{tris.push(n,a,b,c,n,a,c,d);};
 const at=(i,j)=>i<0||j<0||i>=gw||j>=gh?0:hf[j*gw+i];
 for(let j=0;j<gh;j++)for(let i=0;i<gw;i++){
  const z=hf[j*gw+i];if(z<=0)continue;
  const x0=i*cell,x1=(i+1)*cell,y0=(gh-1-j)*cell,y1=(gh-j)*cell; // image row 0 is the back (largest y), so the print is not mirrored
  quad([x0,y0,z],[x1,y0,z],[x1,y1,z],[x0,y1,z],[0,0,1]);
  quad([x0,y0,0],[x0,y1,0],[x1,y1,0],[x1,y0,0],[0,0,-1]);
  let lo=at(i+1,j);if(lo<z)quad([x1,y0,lo],[x1,y1,lo],[x1,y1,z],[x1,y0,z],[1,0,0]);
  lo=at(i-1,j);if(lo<z)quad([x0,y1,lo],[x0,y0,lo],[x0,y0,z],[x0,y1,z],[-1,0,0]);
  lo=at(i,j-1);if(lo<z)quad([x1,y1,lo],[x0,y1,lo],[x0,y1,z],[x1,y1,z],[0,1,0]);
  lo=at(i,j+1);if(lo<z)quad([x0,y0,lo],[x1,y0,lo],[x1,y0,z],[x0,y0,z],[0,-1,0]);
 }
 const count=tris.length/4,buf=new ArrayBuffer(84+50*count),view=new DataView(buf);
 const header='RobotLab picture-to-print STL';for(let i=0;i<header.length;i++)view.setUint8(i,header.charCodeAt(i));
 view.setUint32(80,count,true);let o=84;
 for(let t=0;t<tris.length;t+=4){for(let k=0;k<4;k++)for(const v of tris[t+k]){view.setFloat32(o,v,true);o+=4;}o+=2;}
 return buf;
}

(() => {
 const form=$('print-form');
 if(!form)return;
 let picture=null,part=null;
 const say=msg=>{$('p-status').textContent=msg;};
 const values=()=>({kind:form.querySelector('input[name=kind]:checked').value,sizeMM:Number($('p-size').value),heightMM:Number($('p-height').value),darkness:Number($('p-dark').value)/100,invert:$('p-invert').checked,thicken:$('p-thicken').checked});
 const HEIGHT_LABEL={raised:'How tall the drawing stands up',cutout:'How thick the shape is',holes:'How thick the plate is'};

 function update(){
  const v=values();
  $('p-size-out').textContent=v.sizeMM+' mm';$('p-height-out').textContent=v.heightMM+' mm';$('p-height-label').firstChild.textContent=HEIGHT_LABEL[v.kind]+' ';
  if(!picture){$('p-download').disabled=true;return;}
  const mask=drawingMask(picture,v);
  part=partHeights(mask,picture.w,picture.h,v);
  $('p-download').disabled=!part;
  if(!part){draw(null);say('We couldn’t find a drawing. Try moving “How dark counts as drawing” to the right, or use a darker marker.');return;}
  draw(part);
  const many=part.pieces<2?'':v.kind==='cutout'?` It will print as ${part.pieces} separate pieces; choose “Raised drawing on a plate” to keep them together.`
   :` Careful: it will fall apart into ${part.pieces} pieces, because a drawn line goes all the way around. For holes, only color in the holes (like eyes) and don’t draw outlines.`;
  say(`Your part: ${part.widthMM.toFixed(0)} × ${part.depthMM.toFixed(0)} mm, ${part.tallMM.toFixed(1)} mm tall.${many}`);
 }
 // Top view of the part: darker green is taller.
 function draw(p){
  const c=$('p-preview'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  if(!p)return;
  const s=Math.min(c.width/p.gw,c.height/p.gh),ox=(c.width-p.gw*s)/2,oy=(c.height-p.gh*s)/2,top=p.tallMM||1;
  for(let j=0;j<p.gh;j++)for(let i=0;i<p.gw;i++){const z=p.hf[j*p.gw+i];if(z<=0)continue;
   const k=z/top;ctx.fillStyle=k>0.99?'#245b42':'#a8c48a';ctx.fillRect(ox+i*s,oy+j*s,Math.ceil(s),Math.ceil(s));}
 }
 $('p-file').addEventListener('change',e=>{
  const file=e.target.files[0];if(!file)return;
  const url=URL.createObjectURL(file),img=new Image();
  img.onload=()=>{picture=pictureLuminance(img);const shown=$('p-photo');shown.onload=()=>URL.revokeObjectURL(url);shown.src=url;shown.hidden=false;update();};
  img.onerror=()=>{URL.revokeObjectURL(url);say('We can’t read that file. Try a JPG or PNG picture.');};
  img.src=url;
 });
 form.addEventListener('input',e=>{if(e.target.id!=='p-file')update();});
 form.addEventListener('submit',e=>{
  e.preventDefault();if(!part)return;
  download(heightfieldToSTL(part.hf,part.gw,part.gh,part.cell),'robotlab-print.stl','model/stl');
  say('Downloaded robotlab-print.stl. Open it in your 3D printer’s app, then slice and print.');
 });
 update();
})();
