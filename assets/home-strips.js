/* Small previews of the saved strips on Home. */
(() => {
 const host=document.getElementById('home-strips');if(!host)return;
 let urls=[];
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function dispose(){urls.forEach(url=>URL.revokeObjectURL(url));urls=[];}
 async function render(){try{const records=(await PhotoStripStore.list()).filter(r=>!r.deletedAt);dispose();host.hidden=records.length===0;host.innerHTML=records.map(record=>{const url=URL.createObjectURL(record.blob);urls.push(url);return `<a class="home-strip-preview" href="photostrips/photostrips.html#${encodeURIComponent(record.id)}"><img src="${url}" alt="${esc(record.title)}" loading="lazy"><span>${esc(record.title)}</span></a>`;}).join('');}catch{host.hidden=true;}}
 window.addEventListener('pagehide',dispose);window.addEventListener('pageshow',()=>void render());
})();
