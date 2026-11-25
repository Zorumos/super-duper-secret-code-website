/* Original canvas templates. Add a preset here to extend the style picker. */
window.PhotoStripDesigns = (() => {
 'use strict';
 const presets=[
  {id:'classic',name:'Classic cream',paper:'#fffdf5',ink:'#344a3b',accent:'#8f9c7b',pattern:'plain'},
  {id:'noir',name:'Noir booth',paper:'#202020',ink:'#fffdf5',accent:'#dedbd2',pattern:'plain',finish:'mono'},
  {id:'film',name:'35mm film',paper:'#22251f',ink:'#f1ead6',accent:'#d6bb7f',pattern:'film'},
  {id:'sage',name:'Sage garden',paper:'#e6eddd',ink:'#354d37',accent:'#7d946c',pattern:'leaves'},
  {id:'rose',name:'Rose ribbons',paper:'#f9e4e9',ink:'#793f52',accent:'#bb718d',pattern:'bows'},
  {id:'cherry',name:'Cherry sweet',paper:'#8c303b',ink:'#fff5df',accent:'#e5bca0',pattern:'dots'},
  {id:'sunset',name:'Golden hour',paper:'#f9d6ad',ink:'#663c43',accent:'#c77974',pattern:'sunset',finish:'warm'},
  {id:'lavender',name:'Lavender dreams',paper:'#eae1f6',ink:'#59436e',accent:'#9d82ba',pattern:'stars'},
  {id:'scrapbook',name:'Little scrapbook',paper:'#eee1cb',ink:'#69563e',accent:'#b59668',pattern:'tape'},
  {id:'checker',name:'Weekend check',paper:'#f5f1d5',ink:'#394e52',accent:'#839f95',pattern:'checker'},
  {id:'midnight',name:'Midnight stars',paper:'#20283e',ink:'#fff3d7',accent:'#d6ba75',pattern:'stars'},
  {id:'sky',name:'Cloud nine',paper:'#dcecf5',ink:'#3c5669',accent:'#92b4ce',pattern:'clouds'},
  {id:'journal',name:'Love letters',paper:'#faf1e3',ink:'#69534a',accent:'#b99c8d',pattern:'lines'},
  {id:'polaroid',name:'Polaroid picnic',paper:'#dce5d6',ink:'#425c40',accent:'#96aa87',pattern:'polaroid',layout:'board'}
 ];
 function normalize(value){const x=value&&typeof value==='object'?value:{};const preset=presets.find(p=>p.id===x.style)||presets[0];return {style:preset.id,accent:/^#[0-9a-f]{6}$/i.test(x.accent||'')?x.accent:preset.accent,finish:['color','mono','warm'].includes(x.finish)?x.finish:(preset.finish||'color'),fit:x.fit==='fill'?'fill':'whole'};}
 function star(ctx,x,y,r,color){ctx.save();ctx.fillStyle=color;ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.4:r;const px=x+Math.cos(a)*rr,py=y+Math.sin(a)*rr;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.fill();ctx.restore();}
 function bow(ctx,x,y,color){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x,y);ctx.bezierCurveTo(x-100,y-70,x-80,y+60,x,y);ctx.bezierCurveTo(x+100,y-70,x+80,y+60,x,y);ctx.moveTo(x,y);ctx.lineTo(x-30,y+58);ctx.moveTo(x,y);ctx.lineTo(x+30,y+58);ctx.stroke();ctx.restore();}
 function background(ctx,w,h,p,a){
  ctx.fillStyle=p.paper;ctx.fillRect(0,0,w,h);
  if(p.pattern==='sunset'){const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,'#ffe5b2');g.addColorStop(.45,a);g.addColorStop(1,'#cbb7d7');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}
  if(p.pattern==='checker'){for(let y=0;y<h;y+=52)for(let x=0;x<w;x+=52)if((x/52+y/52)%2===0){ctx.fillStyle=a;ctx.globalAlpha=.38;ctx.fillRect(x,y,52,52);}ctx.globalAlpha=1;}
  if(p.pattern==='dots'){ctx.fillStyle=a;for(let y=25;y<h;y+=48)for(let x=20;x<w;x+=48){ctx.beginPath();ctx.arc(x,y,3.5,0,Math.PI*2);ctx.fill();}}
  if(p.pattern==='lines'||p.pattern==='tape'){ctx.strokeStyle=a;ctx.globalAlpha=.28;ctx.lineWidth=1;for(let y=25;y<h;y+=35){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}if(p.pattern==='lines'){ctx.strokeStyle='#d49393';ctx.beginPath();ctx.moveTo(41,0);ctx.lineTo(41,h);ctx.stroke();}ctx.globalAlpha=1;}
  if(p.pattern==='film'){ctx.fillStyle='#f1ead6';for(let y=18;y<h-10;y+=53){ctx.fillRect(13,y,19,29);ctx.fillRect(w-32,y,19,29);}}
  if(p.pattern==='stars'){for(let y=34;y<h;y+=173){star(ctx,26,y,11,a);star(ctx,w-26,y+72,8,a);}}
  if(p.pattern==='bows'){for(let y=440;y<h;y+=610)bow(ctx,w-37,y,a);}
  if(p.pattern==='leaves'){ctx.strokeStyle=a;ctx.fillStyle=a;ctx.lineWidth=2;for(let y=340;y<h;y+=160){for(const x of [20,w-20]){ctx.beginPath();ctx.moveTo(x,y+70);ctx.lineTo(x,y-40);ctx.stroke();for(let k=0;k<3;k++){ctx.beginPath();ctx.ellipse(x+(k%2?7:-7),y-k*22,7,17,k%2?.6:-.6,0,Math.PI*2);ctx.fill();}}}}
  if(p.pattern==='clouds'){ctx.fillStyle='#ffffffaa';for(let y=300;y<h;y+=300){for(const x of [15,w-15]){ctx.beginPath();ctx.ellipse(x,y,40,18,0,0,Math.PI*2);ctx.ellipse(x+10,y-13,22,21,0,0,Math.PI*2);ctx.fill();}}}
 }
 function text(ctx,value,x,y,max,size,color,italic=false){ctx.fillStyle=color;ctx.textAlign='center';ctx.font=`${italic?'italic ':''}${size}px Georgia`;while(ctx.measureText(value).width>max&&size>16){size--;ctx.font=`${italic?'italic ':''}${size}px Georgia`;}ctx.fillText(value,x,y,max);}
 function preparedImage(image,finish){if(finish==='color')return image;const canvas=document.createElement('canvas');const iw=image.naturalWidth||image.width,ih=image.naturalHeight||image.height;const ratio=Math.min(1,1100/Math.max(iw,ih));canvas.width=Math.round(iw*ratio);canvas.height=Math.round(ih*ratio);const c=canvas.getContext('2d');c.drawImage(image,0,0,canvas.width,canvas.height);const data=c.getImageData(0,0,canvas.width,canvas.height);for(let i=0;i<data.data.length;i+=4){const d=data.data,v=.299*d[i]+.587*d[i+1]+.114*d[i+2];if(finish==='mono'){d[i]=d[i+1]=d[i+2]=v;}else{d[i]=Math.min(255,d[i]*1.05+9);d[i+1]=Math.min(255,d[i+1]*1.01+4);d[i+2]=d[i+2]*.91;}}c.putImageData(data,0,0);return canvas;}
 function frame(ctx,image,x,y,w,h,fit,paper){const iw=image.naturalWidth||image.width,ih=image.naturalHeight||image.height;ctx.save();ctx.fillStyle=paper;ctx.fillRect(x,y,w,h);ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();const scale=fit==='fill'?Math.max(w/iw,h/ih):Math.min(w/iw,h/ih);const dw=iw*scale,dh=ih*scale;ctx.drawImage(image,x+(w-dw)/2,y+(h-dh)/2,dw,dh);ctx.restore();}
 async function render({images=[],loadImage,slots,title,date,design,isCurrent=()=>true}){
  if(!Array.isArray(slots)||slots.length<1||slots.length>5||(images.length!==slots.length&&!loadImage))throw new Error('Every keepsake for this strip is needed.');
  const count=slots.length;
  const d=normalize(design),p=presets.find(p=>p.id===d.style),board=p.layout==='board',w=board?1200:900,h=board?(count<=4?1490:2050):230+count*665+155;
  const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');if(!ctx)throw new Error('This browser cannot create a photo strip.');
  background(ctx,w,h,p,d.accent);
  if(!['film','checker'].includes(p.pattern)){ctx.strokeStyle=d.accent;ctx.globalAlpha=.5;ctx.lineWidth=2;ctx.strokeRect(15,15,w-30,h-30);ctx.globalAlpha=1;}
  text(ctx,'OUR LITTLE COLLECTION',w/2,68,w-100,20,p.ink);
  text(ctx,String(title||'end of chapter 2.').slice(0,40),w/2,137,w-110,board?55:49,p.ink);
  text(ctx,`${count===4?'four':'five'} memories, one favorite day`,w/2,181,w-110,22,p.ink,true);
  function checkCurrent(){if(!isCurrent()){canvas.width=canvas.height=1;const error=new Error('Preview replaced by a newer design.');error.name='AbortError';throw error;}}
  for(let i=0;i<count;i++){
   checkCurrent();
   const original=loadImage?await loadImage(i):images[i];
   checkCurrent();
   const image=preparedImage(original,d.finish);
   if(board){const hero=count%2===1&&i===count-1,x=hero?300:70+(i%2)*565,y=230+Math.floor(i/2)*560,pw=hero?600:495,ph=500;ctx.save();ctx.translate(x+pw/2,y+ph/2);ctx.rotate((i%2?1:-1)*.025);ctx.shadowColor='#27352725';ctx.shadowBlur=15;ctx.shadowOffsetY=6;ctx.fillStyle='#fffdf6';ctx.fillRect(-pw/2,-ph/2,pw,ph);ctx.shadowColor='transparent';frame(ctx,image,-pw/2+20,-ph/2+20,pw-40,ph-95,d.fit,'#ecebe5');text(ctx,slots[i].caption,0,ph/2-32,pw-35,25,p.ink,true);ctx.restore();}
   else{const x=52,y=230+i*665,pw=w-104,ph=580;ctx.fillStyle=d.accent;ctx.fillRect(x-4,y-4,pw+8,ph+8);frame(ctx,image,x,y,pw,ph,d.fit,p.paper);ctx.fillStyle=p.ink;ctx.font='18px Arial';ctx.textAlign='left';ctx.fillText(String(i+1).padStart(2,'0'),x,y+617);text(ctx,slots[i].caption,w/2,y+619,pw-100,25,p.ink,true);if(p.pattern==='tape'){ctx.save();ctx.globalAlpha=.75;ctx.fillStyle=d.accent;ctx.translate(x+80,y);ctx.rotate(-.13);ctx.fillRect(-60,-15,120,34);ctx.restore();}if(p.pattern==='bows'&&i===0)bow(ctx,w/2,y-17,d.accent);}
   // Yield between frames to keep mobile controls responsive.
   await new Promise(resolve=>setTimeout(resolve,0));
  }
  const parsed=new Date((date||'')+'T12:00:00'),dateLabel=Number.isNaN(parsed.getTime())?'our little day':parsed.toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'});
  text(ctx,dateLabel,w/2,h-64,w-100,26,p.ink,true);
  if(p.pattern==='stars')star(ctx,w/2,h-119,15,d.accent);
  return canvas;
 }
 return Object.freeze({presets,normalize,render});
})();
