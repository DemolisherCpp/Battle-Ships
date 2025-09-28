//classes definition
class ship {
    hitpoints;
    #name;
    #alive;
    startrow;
    endrow;
    startcolumn;
    endcolumn;

    constructor(string = "default name", hp = 2) {
        this.#name = string;
        this.hitpoints = hp;
        this.#alive = true;
        this.startrow = -1;
        this.endrow = -1;
        this.startcolumn = -1;
        this.endcolumn = -1;
    }

    hit() {
        if (this.hitpoints > 0) {
            this.hitpoints--;
        }
    }

    isdestroyed() {
        if (this.hitpoints === 0) {
            return true;
        }
        else {
            return false;
        }
    }

    fieldoffire(row, column) {
        if (this.startrow === -1 || this.startcolumn === -1 || this.endrow === -1 || this.endcolumn === -1) {
            return false;
        }
        if (this.startrow === this.endrow && row === this.startrow && (column >= Math.min(this.startcolumn, this.endcolumn) && column <= Math.max(this.startcolumn, this.endcolumn))) {
            return true;
        }
        else if (this.startcolumn === this.endcolumn && column === this.startcolumn && (row >= Math.min(this.startrow, this.endrow) && row <= Math.max(this.startrow, this.endrow))) {
            return true;
        }
        return false;
    }
}

class graph {
    matrix;
    ships;
    constructor() {
        this.matrix = [];
        for (let i = 0; i < 10; i++) {
            this.matrix[i] = new Array(10).fill(0);
        }
        this.ships = [];
        this.ships[0] = new ship("Aircraft Carrier", 5)
        this.ships[1] = new ship("Battle Ship", 4)
        this.ships[2] = new ship("Cruiser", 3)
        this.ships[3] = new ship("Submarine", 3)
        this.ships[4] = new ship("Destroyer", 2)
    }

    lost() {
        this.ships.forEach(shoop => {
            if (!shoop.isdestroyed()) {
                return false;
            }
        })
        return true;
    }

    isanyhit(row, column) {
        return this.ships.some(shoop => {
            return shoop.fieldoffire(row, column);
        });
    }

    checkhit(str) {
        let index = parseInt(str);
        let row = parseInt(index / 10);
        let column = index % 10;
    }

}

class friendlygraph extends graph {

    constructor() {
        super();
    }

    alldeployed() {
        return this.ships.every(ship => ship.startrow !== -1);
    }

    markship(str, str2, shipnumber) {
        let index = parseInt(str);
        let index2 = parseInt(str2);
        let row = parseInt(index / 10);
        let column = index % 10;
        let row2 = parseInt(index2 / 10);
        let column2 = index2 % 10;

        this.ships[shipnumber].startrow = row;
        this.ships[shipnumber].endrow = row2;
        this.ships[shipnumber].startcolumn = column;
        this.ships[shipnumber].endcolumn = column2;
    }
}

//helper function to find out if ship direction is satisfied
function directionsatisfier(str, clicked, str2 = -1) {
    let index = parseInt(str);
    let row = parseInt(index / 10);
    let column = index % 10;

    let index2 = parseInt(clicked);
    let clickedrow = parseInt(index2 / 10);
    let clickedcolumn = index2 % 10;

    if (str2 === -1 && ((row === clickedrow && (Math.abs(column - clickedcolumn) === 1)) || (column === clickedcolumn && (Math.abs(row - clickedrow) === 1)))) {
        return true;
    }

    let index3 = parseInt(str2);
    let secondrow = parseInt(index3 / 10);
    let secondcolumn = index3 % 10;

    if (str2 !== -1 && (row === secondrow && secondrow === clickedrow && (Math.abs(secondcolumn - clickedcolumn) === 1))) {
        return true;
    }

    if (str2 !== -1 && (column === secondcolumn && secondcolumn === clickedcolumn && (Math.abs(secondrow - clickedrow) === 1))) {
        return true;
    }

    return false;
}

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

let boxhover;
let shipslide;
let resetship;
let interval1;
let grid2;

const mysidegraph = new friendlygraph();

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
}


//calling all functions
startdeployementphase();

