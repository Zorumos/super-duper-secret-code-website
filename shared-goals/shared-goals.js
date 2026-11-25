"use strict";
(() => {
 const items=Array.from(document.querySelectorAll('#goal-list .goal'));
 const storageKey='shared-goals:completed';
 let saved=App.read(storageKey,null);
 if(!Array.isArray(saved)){
  let legacy=[];try{legacy=JSON.parse(localStorage.getItem('completedGoals'))||[];}catch{}
  const oldGoals=App.read(App.key('goals'),[]);
  saved=[...(Array.isArray(legacy)?legacy:[]),...(Array.isArray(oldGoals)?oldGoals.filter(g=>g.done).map(g=>g.title):[])];
 }
 const titles=items.map(item=>item.querySelector('span').textContent.trim());
 const completed=new Set(saved.filter(title=>titles.includes(title)));
 function render(){
  items.forEach((item,i)=>{const checked=completed.has(titles[i]);item.classList.toggle('completed',checked);item.querySelector('input').checked=checked;});
  const done=completed.size,percent=items.length?Math.round(done/items.length*100):0;
  document.getElementById('goal-progress').textContent=`${done} of ${items.length} completed · ${percent}%`;
  const meter=document.getElementById('goal-meter');meter.max=items.length||1;meter.value=done;
 }
 items.forEach((item,i)=>item.querySelector('input').addEventListener('change',event=>{
  if(event.target.checked)completed.add(titles[i]);else completed.delete(titles[i]);
  App.save(storageKey,Array.from(completed));render();
 }));
 render();
})();
