//initial audio setting
const audio1 = new Audio ('Resources/ghostship.mp3');
audio1.loop = true;
audio1.play();

//event handler functions
let audiochecker = ()=>{
   if(document.visibilityState==="hidden"){
    audio1.muted=true;
   }
   else if(document.visibilityState==="visible"){
    audio1.muted=false;
   }
}

let switchtoplay = ()=>{
    window.location.href="play.html";
}

//getting elements from DOM
const t1 = document.querySelector("#t1");

//setting up event listeners
document.addEventListener("visibilitychange" , audiochecker);
t1.addEventListener("click",switchtoplay);
