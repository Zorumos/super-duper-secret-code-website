"use strict";
(() => {
 const notes=window.HARDCODED_NOTES;
 if(!Array.isArray(notes)||notes.length!==100||notes.some(n=>typeof n!=="string"||!n.trim()))throw new Error("The notes file must contain exactly 100 messages.");
 const KEY="our-corner:notes-read:v1",UNDO_KEY="our-corner:notes-reset:v1";
 const grid=document.getElementById("envelopeGrid"),modal=document.getElementById("noteModal"),progress=document.getElementById("readingProgress"),undoButton=document.getElementById("undoReset");
 let lastTrigger=null;
 function validIds(value){return Array.isArray(value)?[...new Set(value.map(Number).filter(n=>Number.isInteger(n)&&n>=1&&n<=notes.length))]:[];}
 function storageWarning(){const el=document.getElementById("storageMessage");el.textContent="Your browser could not save reading progress. You can still read every note; progress will last for this visit.";el.hidden=false;}
 function load(name,fallback){try{const raw=localStorage.getItem(name);return raw===null?fallback:JSON.parse(raw);}catch{storageWarning();return fallback;}}
 function write(name,value){try{localStorage.setItem(name,JSON.stringify(value));return true;}catch{storageWarning();return false;}}
 // Preserve reading progress from the previous envelope page, if it exists.
 const restored=load(KEY,null);
 let opened=new Set(validIds(restored===null?load("openedEnvelopes",[]):restored));
 const previousReset=load(UNDO_KEY,null);
 let resetSnapshot=previousReset===null?null:validIds(previousReset);
 const buttons=new Map();
 function renderProgress(){const count=opened.size,percent=Math.round(count/notes.length*100);document.getElementById("progressFill").style.width=percent+"%";document.getElementById("progressPercent").textContent=`${percent}% read · ${count} of ${notes.length} notes`;progress.setAttribute("aria-valuenow",String(percent));progress.setAttribute("aria-valuetext",`${count} of ${notes.length} notes read`);undoButton.disabled=resetSnapshot===null;}
 function updateButton(number){const button=buttons.get(number),read=opened.has(number);button.classList.toggle("opened",read);button.setAttribute("aria-label",`Note ${number}, ${read?"read":"unread"}. Open note.`);}
 function persist(){write(KEY,[...opened].sort((a,b)=>a-b));}
 function openNote(number,button){lastTrigger=button;document.getElementById("modalTitle").textContent="Note "+number;document.getElementById("modalText").textContent=notes[number-1];if(!opened.has(number)){opened.add(number);persist();updateButton(number);renderProgress();}if(!modal.open)modal.showModal();document.body.style.overflow="hidden";}
 function closeModal(){if(modal.open)modal.close();}
 const fragment=document.createDocumentFragment();
 notes.forEach((note,index)=>{const number=index+1;const li=document.createElement("li");li.className="envelope-item";const button=document.createElement("button");button.type="button";button.className="envelope";button.dataset.id=String(number);button.setAttribute("aria-haspopup","dialog");button.setAttribute("aria-controls","noteModal");const imageFrame=document.createElement("span");imageFrame.className="envelope-images";imageFrame.setAttribute("aria-hidden","true");for(const [name,src] of [["image-closed","../images/closed.png"],["image-open","../images/open.png"]]){const image=document.createElement("img");image.className=name;image.src=src;image.alt="";image.draggable=false;image.decoding="async";imageFrame.appendChild(image);}const label=document.createElement("span");label.className="label";label.setAttribute("aria-hidden","true");label.textContent=String(number);const check=document.createElement("span");check.className="read-mark";check.textContent="✓";label.appendChild(check);button.append(imageFrame,label);button.addEventListener("click",()=>openNote(number,button));buttons.set(number,button);li.appendChild(button);fragment.appendChild(li);updateButton(number);});
 grid.appendChild(fragment);
 document.getElementById("closeNote").addEventListener("click",closeModal);
 modal.addEventListener("click",event=>{if(event.target!==modal)return;const rect=modal.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeModal();});
 modal.addEventListener("close",()=>{document.body.style.overflow="";if(lastTrigger)lastTrigger.focus({preventScroll:true});});
 document.getElementById("resetRead").addEventListener("click",()=>{if(opened.size===0)return;resetSnapshot=[...opened];write(UNDO_KEY,resetSnapshot);opened=new Set();persist();buttons.forEach((button,number)=>updateButton(number));renderProgress();});
 undoButton.addEventListener("click",()=>{if(resetSnapshot===null)return;opened=new Set([...opened,...resetSnapshot]);resetSnapshot=null;write(UNDO_KEY,null);persist();buttons.forEach((button,number)=>updateButton(number));renderProgress();});
 window.addEventListener("storage",event=>{if(event.key!==KEY&&event.key!==UNDO_KEY&&event.key!==null)return;opened=new Set(validIds(load(KEY,[])));const raw=load(UNDO_KEY,null);resetSnapshot=raw===null?null:validIds(raw);buttons.forEach((button,number)=>updateButton(number));renderProgress();});
 renderProgress();
})();
