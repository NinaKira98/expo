let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");



const wind = new Image();
wind.src = 'c42bfb43f8245411e097d18bd57afbe1.png';

const nobomb = new Image();
nobomb.src = 'Large_Transparent_Christmas_Candy_Canes.png';

const bomb = new Image(); ///the image of the "bomb"
bomb.src = '3-2-birthday-present-png-thumb.png';

const flagpic = new Image(); ///the image of a flag 
flagpic.src = 'SantaTransparent.png';

const onepic = new Image(); ///the image of 1 
onepic.src = '1.png';

const twopic = new Image(); ///the image of 2
twopic.src = '2.png';

const threepic = new Image(); ///the image of 3 
threepic.src = '3.png';

const fourpic = new Image(); ///the image of 4 
fourpic.src = '4.png';

const fivepic = new Image(); ///the image of 5 
fivepic.src = '5.png';

const sixpic = new Image(); ///the image of 6 
sixpic.src = '6.png';

const sevenpic = new Image(); ///the image of 7 
sevenpic.src = '7.png';

const eightpic = new Image(); ///the image of 8 
eightpic.src = '8.png';


const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
let gameStarted = false;
let totalSeconds = 0;
let gameover = false;

////SETTIG UP THE CANVAS AND THE GRID//////////////////////////

let cols;
let rows;
let numbombs;
let width;
let height;
let widthCell;
let heightCell;
let bombsleft;


const level = function(lvl) {
    function setProperties(width, height, c, r, n) {
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        cols = c;
        rows = r;
        numbombs = n;
        bombsleft = n;
        console.log("Called " + lvl);
        //console.log(bombsleft);
    }

    return function() {
        switch (lvl) {
            case 1:
                setProperties(400, 400, 9, 9, 10);
                break;
            case 2:
                setProperties(490, 490, 13, 13, 30);
                break;
            case 3:
                setProperties(1050, 490, 30, 14, 99);
                break;
        }
    };

};

/////////////////////////DRAWING THE GRID/////////////////////////


const drawGrid = function(w, h, wc, hc) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x <= w; x += wc) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        for (let y = 0; y <= h; y += hc) {
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
        }
    }
    ctx.strokeStyle = '#03628C';
    ctx.stroke();
};

///////////////////CREATING THE 2D ARRAY- BOARD///////////////////////

let board = new Array(rows);
for (let i = 0; i < board.length; i++) {
    board[i] = new Array(cols);
}

//////////////////GIVING BOMBS AND ZEROS////////////////////////////
/*const rand = function(num) {
    return Math.floor(Math.random() * num);
}; */

const rand = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const constructor = function() {

    for (let k = 0; k < numbombs; k++) {
        let i = rand(0, rows - 1);
        let j = rand(0, cols - 1);
        if (board[i][j] === -10) {
            k--;
            continue;
        }
        board[i][j] = -10;

        //bombsleft++;

    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j] !== -10) {
                board[i][j] = 0;
            }
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(width, height, widthCell, heightCell);
    console.log(bombsleft);
};


/////////////////////CHEKING THE NEIGHBORS//////////////////////

const neighbors = function() {

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {

            if (board[i][j] === -10) {
                continue;
            }
            let total = 0;
            for (let x = -1; x <= 1; x++) {
                let k = i + x;
                if (k < 0 || k >= rows) continue;

                for (let y = -1; y <= 1; y++) {
                    let m = j + y;
                    if (m < 0 || m >= cols) continue;

                    let neighbor = board[k][m];
                    if (neighbor === -10) {
                        total++;
                        board[i][j] = total;
                    }
                }
            }
        }
    }
    console.log(board);
}


///////Making an object to add the opened tile coordintes


let visit = new Array(rows);
for (let i = 0; i < visit.length; i++) {
    visit[i] = new Array(cols);
}

const setvisit = function() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            visit[i][j] = 0;
        }
    }
};

/////MAKING THE MIRROR OF THE BOARD//////////////////////////
const with0 = function(time) {
    const timeString = time + "";
    return timeString.length < 2 ? "0" + timeString : timeString
}



let dupl = new Array(rows);
for (let i = 0; i < dupl.length; i++) {
    dupl[i] = new Array(cols);
}

const setdupl = function() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            dupl[i][j] = board[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////
let mytime = function() {
    setInterval(function() {
        if (gameStarted) {
            totalSeconds++;
            seconds.innerHTML = with0(totalSeconds % 60);
            minutes.innerHTML = with0(parseInt(totalSeconds / 60));
        }
    }, 1000);
};
let id = mytime();


canvas.addEventListener('click', function(evt) {
    if (bombsleft === 0) {
        alert("you won");
    }
    let x1 = Math.floor(evt.offsetX / (canvas.height / rows));
    let y1 = Math.floor(evt.offsetY / (canvas.width / cols));
    gameStarted = true;
    draw(y1, x1);
    floodfill(y1, x1);
    // clickbeep();
    document.getElementById("audioclick").play();

}, false);


canvas.addEventListener('contextmenu', function(evt) {
    let j = Math.floor(evt.offsetX / (canvas.height / rows));
    let i = Math.floor(evt.offsetY / (canvas.width / cols));
    evt.preventDefault();

    const rightclc = function(i, j) {
        if (dupl[j][i] === -1 || dupl[j][i] === -5) {
            dupl[j][i] = board[j][i];
            ctx.clearRect(i * widthCell + 5, j * widthCell + 2, widthCell - 9, widthCell - 5);

        } else {
            if (dupl[j][i] === -10) {
                bombsleft--;
                console.log(bombsleft);
                if (bombsleft === 0) {
                    gameover = true;
                    document.getElementById("win").play();
                }
                dupl[j][i] = -5;
                ctx.clearRect(i * widthCell + 5, j * widthCell + 2, widthCell - 9, widthCell - 5);
                ctx.drawImage(flagpic, i * widthCell + 5, j * widthCell + 2, widthCell - 9, widthCell - 5);
                visit[i][j] = 1;
            } else if (dupl[j][i] !== -2 && visit[j][i] !== 1) {
                dupl[j][i] = -1;
                ctx.drawImage(flagpic, i * widthCell + 5, j * widthCell + 2, widthCell - 9, widthCell - 5);
            }
        }
    };

    rightclc(j, i);


}, false);

////////////DRAWING THE SANTAS AND NUMBERS/////////////////////////////////

const draw = function(i, j) {
    if (!gameover) {
        const numbers = function(i, j) {
            if (board[i][j] === 1) {
                ctx.drawImage(onepic, j * widthCell + 5, i * widthCell + 2, widthCell - 9, widthCell - 5);
                visit[i][j] = 1;
            }
            if (board[i][j] === 2) {
                ctx.drawImage(twopic, j * widthCell + 5, i * widthCell + 2, widthCell - 7, widthCell - 11);
                visit[i][j] = 1;
            }
            if (board[i][j] === 3) {
                ctx.drawImage(threepic, j * widthCell + 5, i * widthCell + 2, widthCell - 9, widthCell - 5);
                visit[i][j] = 1;
            }
            if (board[i][j] === 4) {
                ctx.drawImage(fourpic, j * widthCell + 5, i * widthCell + 2, widthCell - 9, widthCell - 5);
                visit[i][j] = 1;
            }
            if (board[i][j] === 5) {
                ctx.drawImage(fivepic, j * widthCell + 5, i * widthCell + 2, widthCell - 9, widthCell - 5);
                visit[i][j] = 1;
            }
            if (board[i][j] === 6) {
                ctx.drawImage(sixpic, j * widthCell + 5, i * widthCell + 2, widthCell - 9, widthCell - 5);
                visit[i][j] = 1;
            }
            if (board[i][j] === 7) {
                ctx.drawImage(sevenpic, j * widthCell + 5, i * widthCell + 2, widthCell - 9, widthCell - 5);
                visit[i][j] = 1;
            }
            if (board[i][j] === 8) {
                ctx.drawImage(eightpic, j * widthCell + 5, i * widthCell + 2, widthCell - 9, widthCell - 5);
                visit[i][j] = 1;
            }
        };
        numbers(i, j);


        if (board[i][j] === -10) {

            gameStarted = false;
            gameover = true;

            const santas = function(i, j) {
                for (let i = 0; i < rows; i++) {
                    for (let j = 0; j < cols; j++) {
                        if (board[i][j] === -10 && dupl[i][j] !== -5) {

                            ctx.drawImage(bomb, j * widthCell + 5, i * widthCell + 2, widthCell - 9, widthCell - 5);

                            visit[i][j] = 1;
                            document.getElementById("gameoverclick").play();

                        } else if (board[i][j] !== -10 && dupl[i][j] === -1) {
                            ctx.clearRect(j * widthCell + 5, i * widthCell + 2, widthCell - 9, widthCell - 5);
                            ctx.drawImage(nobomb, j * widthCell + 5, i * widthCell + 2, widthCell - 9, widthCell - 5);
                            visit[i][j] = 1;

                        }
                    }
                }
            };

            santas(i, j);

        } else if (board[i][j] === 0) {

            ctx.drawImage(wind, j * widthCell + 5, i * widthCell + 2, widthCell - 9, widthCell - 5);
            visit[i][j] = 1;
        }
    }
};
const floodfill = function(i, j) {
    if (dupl[i][j] === 0) {
        for (let yoff = -1; yoff <= 1; yoff++) {
            let f = i + yoff;
            if (f < 0 || f >= rows) {
                continue;
            }
            for (let xoff = -1; xoff <= 1; xoff++) {
                let c = j + xoff;
                if (c < 0 || c >= cols || (f === i && c === j)) {
                    continue;
                }
                if (!visit[f][c]) {
                    draw(f, c);
                    floodfill(f, c);
                }
            }
        }
    } else if (dupl[i][j] > 0) {
        let countRightBomb = 0;
        let countWrongBomb = 0;
        for (let yoff = -1; yoff <= 1; yoff++) {
            let f = i + yoff;
            if (f < 0 || f >= rows) {
                continue;
            }
            for (let xoff = -1; xoff <= 1; xoff++) {
                let c = j + xoff;
                if (c < 0 || c >= cols || (f === i && c === j)) {
                    continue;
                }
                if (dupl[f][c] === -5) {
                    countRightBomb++;
                } else if (dupl[f][c] === -1) {
                    countWrongBomb++;
                }
            }
        }
        if (countRightBomb + countWrongBomb >= dupl[i][j]) {
            for (let yoff = -1; yoff <= 1; yoff++) {
                let f = i + yoff;
                if (f < 0 || f >= rows) {
                    continue;
                }
                for (let xoff = -1; xoff <= 1; xoff++) {
                    let c = j + xoff;
                    if (c < 0 || c >= cols || (f === i && c === j)) {
                        continue;
                    }
                    if (dupl[f][c] !== -5 && countWrongBomb === 0) {
                        draw(f, c);
                    } else if (countWrongBomb !== 0) {
                        draw(f, c);
                        document.getElementById("gameoverclick").play();
                    }
                }
            }
        }
    }
}


let audio = document.getElementById("audio");
document.addEventListener('keydown', function(event) {


    if (event.keyCode === 32) {
        document.getElementById('audio').pause();

    }
    if (event.keyCode === 13) {
        document.getElementById('audio').play();
    }

}, false);


const reset = function() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            board[i][j] = 0;
        }
    }
    totalSeconds = 0;
    gameStarted = false;
    gameover = false;

    constructor();
    neighbors();
    setvisit();
    setdupl();
};

const start = function() {
    totalSeconds = 0;
    gameStarted = false;
    seconds.innerHTML = "00";
    minutes.innerHTML = "00";
    width = ctx.canvas.width;
    height = ctx.canvas.height;
    widthCell = width / cols;
    heightCell = height / rows;
    drawGrid(width, height, widthCell, heightCell);
    board = new Array(rows);
    for (let i = 0; i < board.length; i++) {
        board[i] = new Array(cols);
    }
    visit = new Array(rows);
    for (let i = 0; i < visit.length; i++) {
        visit[i] = new Array(cols);
    }
    constructor();
    neighbors();
    setvisit();

    dupl = new Array(rows);
    for (let i = 0; i < dupl.length; i++) {
        dupl[i] = new Array(cols);
    }
    setdupl();
}
document.getElementById("one").onclick = function() {
    //gameStarted = true;
    level(1)();
    start();
}
document.getElementById("two").onclick = function() {
    //gameStarted = true;
    level(2)();
    start();
};
document.getElementById("three").onclick = function() {
    //gameStarted = true;
    level(3)();
    start();
};