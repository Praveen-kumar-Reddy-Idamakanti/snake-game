
//board logic
const board= document.getElementById("game-board");
const gridSize=1800;
for(let i=0;i<gridSize;i++){
    const cell = document.createElement("div");
    cell.classList.add("cell");
    board.appendChild(cell);
}

const cols=60
const rows=30

const centerRow=Math.floor(rows/2)
const centerCol=Math.floor(cols/2)

const centerIndex=centerRow*cols+centerCol

snakeArr=[centerIndex];
let direction=1;
leftWall=[]
rightWall=[]
let i=0
while (i<1800){
    leftWall.push(i);
    i=i+60
    rightWall.push(i);
}
console.log(leftWall);



//collect key boiard events
    document.addEventListener("keydown",(e)=>{
        if (e.code=="ArrowUp")direction= -cols;
        if (e.code=="ArrowDown")direction= cols;
        if (e.code=="ArrowRight")direction= 1;
        if (e.code=="ArrowLeft")direction= -1;
        if (e.code=="Enter")gamesStart(true);
    });

//game start logic
const startBtn= document.getElementById("game-start");
function gamesStart(isStarted){

    if (isStarted){
        console.log("GameStarted");
        startBtn.style.display="none";
        resetGame();
        createFood();
        coreGame();
    }
    else{ //if game is not started
        startBtn.style.display="block"
        console.log("display startButton")
    }
}
 
function createSnake(){
    const centerCell=board.children[centerIndex]
    snake= document.createElement("div");
    snake.classList.add("snake")
    centerCell.appendChild(snake)
    console.log("added in center")
}

function coreGame(){
    
    function moveSnake(){
        const newHead=snakeArr[0]+direction;
        if (newHead in leftWall) console.log(newHead);
        if (newHead<0 || newHead>=1800){
            console.log(newHead+1);
            gameEnd(intervalID)
            return;
        }
        if ((direction==-1 && leftWall.includes(snakeArr[0]))|| (direction==1 && rightWall.includes(snakeArr[0]+1))){
            gameEnd(intervalID);
            return;
        }
        snakeArr.unshift(newHead);
        snakeArr.pop();

        removeSnake();
        snakeArr.forEach(element => {
            const s= document.createElement("div");
            s.classList.add("snake")
            board.children[element].appendChild(s);
        });

    }
    const intervalID=setInterval(moveSnake,90);
    
}
function createFood(){
    document.querySelectorAll(".food").forEach(f => f.remove());
    min=0
    max=1799
    let rand_cell;
    do{
        rand_cell=Math.floor(Math.random()*(max-min)+min);

    }while (snakeArr.includes(rand_cell));
    const cell=board.children[rand_cell]
    food=document.createElement("div");
    food.classList.add("food");
    cell.appendChild(food);

    food_index=rand_cell;
    
    console.log("added food");
}

function removeSnake(){
    document.querySelectorAll(".snake").forEach(s => s.remove());//remove the all current class with .snake
}

function resetGame(){
    direction=1;
    snakeArr=[centerIndex]
    removeSnake();
    createSnake();
    gamesStart(false)
}

//game end logic
function gameEnd(intervalID){
    // display alert 
    alert("Game Failed")
    clearInterval(intervalID);
    //restart the game
    gamesStart(true);
}

