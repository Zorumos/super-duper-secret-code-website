"use strict";
(() => {
 const {read,esc}=App;
 const number=document.body.dataset.chapter,story=window.STORY;
 const list=story.pages;
 let current=0;
 const container=document.getElementById('page');
 function getPhoto(src){if(src.startsWith('data:image/'))return src;const name=src.split('/').pop().toLowerCase();return read('photo-library',{})[name]||src;}
 function photo(src,title){return `<figure class="story-photo"><img src="${esc(getPhoto(src))}" alt="${esc(title)}"><figcaption hidden>Photo unavailable.</figcaption></figure>`;}
 function readyImages(){container.querySelectorAll('img').forEach(im=>{function missing(){im.hidden=true;const caption=im.nextElementSibling;if(caption?.tagName==='FIGCAPTION')caption.hidden=false;}im.addEventListener('error',missing,{once:true});if(im.complete&&!im.naturalWidth)missing();});}
 function songsHTML(tracks){if(!Array.isArray(tracks))return '';const safe=tracks.filter(id=>/^[A-Za-z0-9]{10,40}$/.test(id));return `<div class="music-grid">${safe.map((id,i)=>`<section class="spotify-card"><p class="disc-title">Song ${i+1}</p><iframe title="Song ${i+1} that reminds me of you" src="https://open.spotify.com/embed/track/${id}" width="100%" height="152" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe><a href="https://open.spotify.com/track/${id}" target="_blank" rel="noopener noreferrer">Open in Spotify ↗</a></section>`).join('')}</div>`;}
 function render(){
  current=Math.max(0,Math.min(current,list.length-1));const p=list[current];
  document.getElementById('chapter-contents').innerHTML=list.map((item,i)=>!item.cover&&!item.toc?`<button type="button" data-page="${i}" ${i===current?'aria-current="page"':''}>${esc(item.title)}</button>`:'').join('');
  document.getElementById('cover-link').setAttribute('aria-current',current===0?'page':'false');
  document.getElementById('contents-link').setAttribute('aria-current',current===1?'page':'false');
  if(p.cover){container.innerHTML=p.image&&story.useArtwork?`<div class="chapter-cover has-art"><img class="chapter-artwork" src="${esc(p.image)}" alt="${esc(story.title)} cover artwork"></div>`:`<div class="chapter-cover"><span class="eyebrow">${esc(story.subtitle)}</span><span class="cover-flower" aria-hidden="true">✿</span><h1>${esc(story.title)}</h1><p>A few pages of our little world.</p></div>`;}
  else if(p.toc){container.innerHTML=`${p.image&&story.useArtwork?`<img class="chapter-artwork toc-artwork" src="${esc(p.image)}" alt="Chapter ${esc(number)} table of contents artwork"><h2 class="toc-jump-title">Choose a memory</h2>`:'<span class="eyebrow">A little look inside</span><h1>Contents</h1>'}<div class="toc-list">${list.map((item,i)=>!item.cover&&!item.toc?`<button type="button" data-page="${i}"><span>${String(i-1).padStart(2,'0')}</span><strong>${esc(item.title)}</strong><span>↗</span></button>`:'').join('')||'<p class="empty">This chapter is still being written.</p>'}</div>`;}
  else{container.innerHTML=`<div class="section-top"><span class="eyebrow">${esc(p.date||'Our story')}</span></div><h1>${esc(p.title)}</h1>${p.subtitle?`<p class="story-subtitle">${esc(p.subtitle)}</p>`:''}${p.text?String(p.text).trim().split(/\n\s*\n/).map(t=>`<p class="story-paragraph">${esc(t.trim())}</p>`).join(''):''}${p.reasons?`<ol class="reasons-list">${p.reasons.map(t=>`<li>${esc(t)}</li>`).join('')}</ol>`:''}<div class="story-photos">${(p.images||[]).map(src=>photo(src,p.title)).join('')}</div>${songsHTML(p.songs)}`;}
  readyImages();container.classList.remove('animate-page');void container.offsetWidth;container.classList.add('animate-page');
 }
 function jump(index){if(!Number.isInteger(index)||index<0||index>=list.length)return;current=index;render();}
 document.getElementById('cover-link').onclick=()=>jump(0);
 document.getElementById('contents-link').onclick=()=>jump(1);
 const selectPage=event=>{const button=event.target.closest('[data-page]');if(button)jump(Number(button.dataset.page));};
 container.onclick=selectPage;
 document.getElementById('chapter-contents').onclick=selectPage;
 render();
})();
