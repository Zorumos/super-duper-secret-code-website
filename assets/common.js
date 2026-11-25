"use strict";
window.App = (() => {
 const PREFIX="our-corner:v1:";
 function toast(message) {const el=document.getElementById("toast");if(el){el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),3500);}}
 function read(key,fallback){try{const raw=localStorage.getItem(PREFIX+key);return raw?JSON.parse(raw):fallback;}catch{return fallback;}}
 function save(key,value){try{localStorage.setItem(PREFIX+key,JSON.stringify(value));return true;}catch{toast("Could not save. Your browser storage may be full or unavailable.");return false;}}
 function player(){try{return localStorage.getItem("selected_player")||"Andrew";}catch{return "Andrew";}}
 function key(name){return encodeURIComponent(player())+":"+name;}
 function esc(text){return String(text??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
 function id(){return Date.now().toString(36)+Math.random().toString(36).slice(2,9);}
 async function imageData(file){if(!file.type.startsWith("image/"))throw new Error("Choose an image file.");if(file.size>20000000)throw new Error("Choose an image smaller than 20 MB.");return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=()=>reject(new Error("Could not read image."));reader.onload=()=>{const im=new Image();im.onload=()=>{const ratio=Math.min(1,1200/im.width,1200/im.height);const c=document.createElement("canvas");c.width=Math.max(1,Math.round(im.width*ratio));c.height=Math.max(1,Math.round(im.height*ratio));const ctx=c.getContext("2d");ctx.fillStyle="#ffffff";ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(im,0,0,c.width,c.height);resolve(c.toDataURL("image/jpeg",.78));};im.onerror=()=>reject(new Error("Image format not supported by this browser."));im.src=reader.result;};reader.readAsDataURL(file);});}
 function optionalImage(img){img.addEventListener("error",()=>{img.hidden=true;},{once:true});if(img.complete&&!img.naturalWidth)img.hidden=true;}
 document.querySelectorAll("[data-optional-image]").forEach(optionalImage);
 document.querySelectorAll(".site-header a").forEach(a=>{if(a.href===location.href)a.setAttribute("aria-current","page");});
 return {PREFIX,toast,read,save,player,key,esc,id,imageData,optionalImage};
})();
