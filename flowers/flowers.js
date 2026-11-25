"use strict";
// Normal links work without JavaScript. Arrow keys offer an extra way to browse.
document.addEventListener('keydown',event=>{
 if(event.defaultPrevented||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
 const rel=event.key==='ArrowLeft'?'prev':event.key==='ArrowRight'?'next':null;
 if(!rel)return;
 const link=document.querySelector('.bouquet-navigation a[rel="'+rel+'"]');
 if(link){event.preventDefault();window.location.href=link.href;}
});
