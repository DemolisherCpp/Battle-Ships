import {friendlygraph,enemygraph,directionsatisfier} from "./Calculations.js"

//getting elements from dom and declaring classes and making callback function variables
const screen = document.querySelector("body")
const text = document.querySelector(".ttext");
const phaseenclosure = document.querySelector(".phase");
const phasetype = document.querySelector(".t");
const slidingback = document.querySelector(".back");
const grid = document.querySelector(".grid");
const set = document.querySelector(".set");
const timer = document.querySelector(".timer");
const shipcolumn = document.querySelector(".shipbut");
const shipschildren = shipcolumn.querySelectorAll(":scope > .ships");
let allboxes;
let parda;
let playercurtain;
let aicurtain;

let boxhover;
let shipslide;
let resetship;
let interval1;
let grid2;

const mysidegraph = new friendlygraph();
const enemysidegraph = new enemygraph();

//timer setup and page appearing steadily


//main function for starting deployment
function startdeployementphase() {

    //setting audio
    const audio1 = new Audio("Resources/explosion.mp3");
    audio1.volume = 0.3;
    audio1.play();
    console.log("test");

    phasetype.classList.toggle("appear");
    screen.classList.toggle("appear");
    slidingback.classList.toggle("deploymentslider");
    




    let count = 0;
    interval1 = setInterval(() => {
        count++;
        if (count === 1) {
            set.style.display = "flex";
            timer.style.display = "block";
        }
        else if (count > 1 && count < 62) {
            let string = (parseInt(text.textContent) - 1).toString();
            text.textContent = string;
        }
        else if (count === 62) {
            //clearInterval(interval1);
            intermediaryphase();
        }
    }, 1000);

    //adding selection animation for ships
    let shipchoice = -1;
    let shipdiv;
    let boxesclicked = 0;


    shipslide = (event) => {
        //so if already choosing for a ship dont choose others
        if (boxesclicked > 0) {
            return;
        }
        //removing other toggled ships
        shipschildren.forEach(node => {
            node.classList.remove("selected");
        })
        //toggling this one
        event.currentTarget.classList.toggle("selected");
        shipdiv = event.currentTarget;

        //telling us which ship is toggled
        if (event.currentTarget.id === "carrier") {
            shipchoice = 0;
        }
        else if (event.currentTarget.id === "battleship") {
            shipchoice = 1;
        }
        else if (event.currentTarget.id === "cruiser") {
            shipchoice = 2;
        }
        else if (event.currentTarget.id === "submarine") {
            shipchoice = 3;
        }
        else if (event.currentTarget.id === "destroyer") {
            shipchoice = 4;
        }
    }

    shipschildren.forEach(node => {
        node.addEventListener("click", shipslide);
    })

    //adding newer divs and adding clicking property to select ships
    //event handler for clicking grid boxes during selection basically all the deployment logic required
    let startingdiv;
    let secondarydiv;
    boxhover = (event) => {
        // let index = parseInt(event.target.id);
        // let row = parseInt(index / 10);
        // let column = index % 10;

        if (count > 1 && shipchoice !== -1) {

            //CHECK TO SEE DIRECTION VALID
            if (boxesclicked === 1 && !(directionsatisfier(startingdiv, event.target.id))) {
                return;
            }

            if (boxesclicked > 1 && !(directionsatisfier(startingdiv, event.target.id, secondarydiv))) {
                return;
            }

            secondarydiv = event.target.id;

            if (boxesclicked === 0) {
                startingdiv = event.target.id;
            }

            if (!event.target.classList.contains("selected")) {
                event.target.classList.toggle("selected");
                boxesclicked++;
            }

            if (boxesclicked === mysidegraph.ships[shipchoice].hitpoints) {
                mysidegraph.markship(startingdiv, event.target.id, shipchoice);
                boxesclicked = 0;
                shipdiv.classList.remove("selected");
                shipdiv.classList.toggle("remove");
                shipchoice = -1;
                if (mysidegraph.alldeployed()) {
                    intermediaryphase();
                }

            }
        }
    };


    for (let i = 0; i < 100; i++) {
        const div1 = document.createElement("div");
        div1.className = "box";
        div1.id = i.toString();
        grid.appendChild(div1);
        div1.addEventListener("click", boxhover);
    }

    //as they are declared just now couldnt fetch them above :(
    allboxes = grid.querySelectorAll(".box");

    resetship = (event) => {
        event.preventDefault();
        boxesclicked = 0;

        allboxes.forEach(node => {
            let index = parseInt(node.id);
            let row = parseInt(index / 10);
            let column = index % 10;
            if (node.classList.contains("selected") && !mysidegraph.isanyhit(row, column))
                node.classList.toggle("selected");
        })
    }

    document.addEventListener("contextmenu", resetship);
    document.addEventListener("contextmenu",(e)=>{
        e.preventDefault();
    })

}

//end of deployment phase function

//intermediaryphase
function intermediaryphase() {
    //removing interval
     if (interval1) { // Check if an interval ID exists
        clearInterval(interval1);
     }
    //adding a transition
    parda = document.createElement("div");
    parda.className = "curtain"
    parda.style.height="100vh"
    parda.style.width="100vw"
    parda.style.backgroundColor = "#0a192f";
    parda.style.position = "fixed";
    parda.style.top="0px";
    parda.style.left="0px";
    parda.style.opacity = "0";
    parda.style.zIndex = "3";
    screen.appendChild(parda);

    parda.classList.toggle("appear");

    let count=0;
    let interval2 = setInterval(()=>{
      count++;
      if(count===3){
        clearInterval(interval2);
        parda.remove();
        battlephase();
      }
    },1000)



}

function battlephase() {
    //removing eventlisteners
    document.removeEventListener("contextmenu", resetship);
    allboxes.forEach(box => {
        box.removeEventListener("click", boxhover);
    });
    shipschildren.forEach(node => {
        node.removeEventListener("click", shipslide);
    })
    //removing elements
    shipcolumn.remove();
    //parda.remove();
    phasetype.textContent = "Battle Phase";

    //transition
    screen.classList.remove("appear");
    slidingback.classList.remove("deploymentslider");
    slidingback.style.animation = "none";
    timer.style.display = "none";
    set.style.display = "none";

    //animations
    phasetype.classList.remove("appear");
    phasetype.style.setProperty("font-size", "20vh");
    phasetype.style.display = "none";
    
    let count = 0;
    let interval3 = setInterval(() => {
        if (count === 1) {
            phasetype.style.display = "block";
            phasetype.classList.add("appear");
            screen.classList.add("appear");

            //setting audio
            const audio1 = new Audio("Resources/explosion.mp3");
            audio1.volume = 0.3;
            audio1.play();
        }
        else if(count === 2){
            timer.style.display = "block";
            text.textContent = "30";
            set.style.display = "flex";

        }
        count++;


    }, 1000)

    //creating another grid for enemy ships
    grid2 = document.createElement("div");
    grid2.className = "grid";
    
    for (let i = 0; i < 100; i++) {
        const div1 = document.createElement("div");
        div1.className = "box";
        div1.id = (i+100).toString();
        grid2.appendChild(div1);
        //div1.addEventListener("click", boxhover);
    }

    set.appendChild(grid2);
    set.style.justifyContent = "space-around";

    //creating two curtain thingys to indicate player and ai turn
    aicurtain = document.createElement("div");
    aicurtain.className = "turncurtain";
    aicurtain.style.right = "0%"

    let text1 = document.createElement("div");
    text1.className = "ct";
    let innertext1 =  document.createElement("h2");
    innertext1.innerText = "Algo's Turn";
    text1.appendChild(innertext1);
    aicurtain.appendChild(text1);

    let image1 = document.createElement("img");
    image1.className = "loadingsign";
    image1.src = "Resources/loaderlorg.apng";
    aicurtain.appendChild(image1);

    playercurtain = document.createElement("div");
    playercurtain.className = "turncurtain";

    let text2 = document.createElement("div");
    text2.className = "ct";
    let innertext2 =  document.createElement("h2");
    innertext2.innerText = "Player's Turn";
    text2.appendChild(innertext2);
    playercurtain.appendChild(text2);

    let image2 = document.createElement("img");
    image2.className = "loadingsign";
    image2.src = "Resources/loaderlorg.apng";
    playercurtain.appendChild(image2);
    
    screen.appendChild(playercurtain);
    screen.appendChild(aicurtain);

    playerturn();
}

function playerturn(){
    let count = 0;
    let interval4=setInterval(()=>{
        if(count === 4){
            playercurtain.classList.toggle("appear");
            aicurtain.classList.toggle("appear");
        }
        else if(count === 8){
            playercurtain.classList.toggle("appear");
            aicurtain.classList.toggle("appear");
        }
        count++;
    },1000);
}


//calling all functions
startdeployementphase();

