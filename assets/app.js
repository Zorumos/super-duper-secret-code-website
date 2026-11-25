"use strict";
const {read,save,key,esc,id,toast,imageData}=App;
const mode=document.body.dataset.page;
if(mode==="select"){
 document.querySelectorAll("[data-player]").forEach(btn=>btn.addEventListener("click",()=>{try{localStorage.setItem("selected_player",btn.dataset.player);location.href="home.html";}catch{toast("Enable browser storage to select a player.");}}));
}
if(mode==="home"){
 document.getElementById("welcomeText").textContent=`Welcome home, ${App.player()}.`;
 const homeImage=document.getElementById("home-player-image");
 homeImage.src=App.player()==="Minh Anh"?"images/minh-anh.jpeg":"images/Andrew.jpg";
 homeImage.alt=App.player();
 document.getElementById("home-player-name").textContent=App.player();
}
