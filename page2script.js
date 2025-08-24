//classes
class graph {
    #matrix;
    #clicked;
    constructor() {
        this.#matrix = [];
        for (let i = 0; i < 10; i++) {
            this.#matrix[i] = new Array(10).fill(0);
        }
        this.#clicked=0;
    }

    linechecker(i,j,pi,pj,direction){
        //right
       if((direction===0&&i===pi&&j-pj===1)||(direction===-1)){
        return true;
       }
       //down
       else if ((direction===1&&i-pi===1&&j===pj)||(direction===-1)){
        return true;
       }
       //left
       else if((direction===2&&i===pi&&j-pj===-1)||(direction===-1)){
        return true;
       }
       //up
       else if ((direction===3&&i-pi===-1&&j===pj)||(direction===-1)){
        return true;
       }
       return false;
    } 

    finddirection(i,j,pi,pj){
        //right
        if(i===pi&&j-pj===1){
            return 0;
        }
        //down
        else if (i-pi===1&&j===pj){
         return 1;
        }
        //left
        else if(i===pi&&j-pj===-1){
         return 2;
        }
       //up
        else if (i-pi===-1&&j===pj){
         return 3;
        }
    } 
}

class ship{
    #hitpoints;
    #name;

    constructor(string="default name",hp=2){
        this.#name=string;
        this.#hitpoints=hp;
    }

    hit(){
        if(this.#hitpoints>0){
           this.#hitpoints--;
        }
    }

    isdestroyed(){
        if(this.#hitpoints==0){
            return true;
        }
        else{
            return false;
        }
    }
}





//setting audio
const audio1 = new Audio("Resources/explosion.mp3");
audio1.volume = 0.3;
audio1.play();
console.log("test");

//getting elements from dom
const text = document.querySelector(".ttext");
const grid = document.querySelector(".grid");
const set = document.querySelector(".set");
const timer = document.querySelector(".timer");
const shipcolumn = document.querySelector(".shipbut");

//timer setup and page appearing steadily
let count=0;
let interval1 = setInterval(() => {
    count++;
    if(count === 1){
        set.style.display = "flex";
        timer.style.display="block";
    }
    else if(count>1&&count<62){
       let string = (parseInt(text.textContent)-1).toString();
       text.textContent=string;
    }
    else if(count === 62){
        clearInterval(interval1);
    } 
}, 1000);

//adding selection animation for ships
let shipchoice =-1;
const shipschildren = shipcolumn.querySelectorAll(":scope > .ships");
const shipslide = (event)=>{
    //removing other toggled ships
    shipschildren.forEach(node=>{
        node.classList.remove("selected");
    })
    //toggling this one
    event.currentTarget.classList.toggle("selected");
    //telling us which is toggled
    shipchoice = event.currentTarget.id;
}
shipschildren.forEach(node=>{
    node.addEventListener("click",shipslide);
})
// detecting mouse clicks

// let clicked=false
// const downer = (event)=>{
//     if(event.button===0){
//         clicked=true;
//         console.log("down");
//     }
// }

// const upper = (event)=>{
//     if(event.button===0){
//         clicked = false;
//         console.log("up");
//     }
// }

// document.addEventListener("mousedown",downer);
// document.addEventListener("mouseup",upper);



//adding newer divs and adding hover property
const allboxes = grid.querySelectorAll("scope > .box");
const obj=new graph();
let boxesclicked=0;
let direction=-1;
const boxhover = (event) => {
    if (count > 1) {
        event.target.classList.toggle("selected");
        boxesclicked++;
    }
};


for(let i=0;i<100;i++){
    const div1 = document.createElement("div");
    div1.className="box";
    div1.id = i.toString();
    grid.appendChild(div1);
    div1.addEventListener("click",boxhover);

}


