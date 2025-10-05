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

    #comparearrays(array1,array2){
        for(let [y1,x1] of array1){
            for(let [y2,x2] of array2){
                if(y1===y2&&x1===x2){
                    return true;
                }
            }
        }
        return false;
    }

    #generatecoords(y1,y2,x1,x2){
        let coords = [];
        if(y1===y2){
            let start = Math.min(x1,x2);
            let end = Math.max(x1,x2);
            for(let i=start;i<=end;i++){
                coords.push([y1,i]);
            }

        }
        else if(x1===x2){
            let start = Math.min(y1,y2);
            let end = Math.max(y1,y2);
            for(let i=start;i<=end;i++){
                coords.push([i,x1]);
            }

        }
        return coords;
    }

    lineintersect(y1,y2,x1,x2){
        let placement = this.#generatecoords(y1,y2,x1,x2);
        let ship = this.#generatecoords(this.startrow,this.endrow,this.startcolumn,this.endcolumn);
        return this.#comparearrays(placement,ship);
      
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

class enemygraph extends graph {
    constructor() {
        super();
        this.#automate(5,0);
        this.#automate(4,1);
        this.#automate(3,2);
        this.#automate(3,3);
        this.#automate(2,4);
    }

    #allshipintersect(y1, y2, x1, x2) {
        return this.ships.some(node => (node.lineintersect(y1, y2, x1, x2)));
    }

    #automate(size, shipindex) {
        //choosing random row and column values

        let startrow;
        let endrow;
        let startcolumn;
        let endcolumn;
        while (true) {
            let row = Math.floor(Math.random() * 10);
            let column = Math.floor(Math.random() * 10);
            let direction = Math.floor(Math.random() * 4);
            switch (direction) {
                case 0:
                    startrow = row;
                    endrow = row;
                    startcolumn = column;
                    endcolumn = column + (size - 1);
                    break;
                case 1:
                    startrow = row;
                    endrow = row + (size - 1);
                    startcolumn = column;
                    endcolumn = column;
                    break;
                case 2:
                    startrow = row;
                    endrow = row;
                    startcolumn = column;
                    endcolumn = column - (size - 1);
                    break;
                case 3:
                    startrow = row;
                    endrow = row - (size - 1);
                    startcolumn = column;
                    endcolumn = column;
                    break;
            }

            if (!(Math.max(startrow, endrow, startcolumn, endcolumn) > 9 || Math.min(startrow, endrow, startcolumn, endcolumn) < 0 || (this.#allshipintersect(startrow, endrow, startcolumn, endcolumn)))) {
                this.ships[shipindex].startrow = startrow;
                this.ships[shipindex].endrow = endrow;
                this.ships[shipindex].startcolumn = startcolumn;
                this.ships[shipindex].endcolumn = endcolumn;
                console.log("startrow : " + startrow + " endrow : " + endrow + " startcolumn : " + startcolumn + " endcolumn : " + endcolumn);
                break;
            }

        }

    }

};

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

export {friendlygraph,enemygraph,directionsatisfier};