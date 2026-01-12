//board logic
const board= document.getElementById("game-board");
const gridSize=1800;
for(let i=0;i<gridSize;i++){
    const cell = document.createElement("div");
    cell.classList.add("cell");
    board.appendChild(cell);
}
let score=0
const cols=60
const rows=30
let intervalID=null;
let prev_direction=null
const centerRow=Math.floor(rows/2)
const centerCol=Math.floor(cols/2)

const centerIndex=centerRow*cols+centerCol

snakeArr=[centerIndex];
let direction=1;
leftWall=[]
rightWall=[]
let i=0

let speeed=90
while (i<1800){
    leftWall.push(i);
    i=i+60
    rightWall.push(i);
}
console.log(leftWall);

isGameStarted=false


//collect key boiard events
    document.addEventListener("keydown",(e)=>{
        if (e.code=="ArrowUp")direction= -cols;
        if (e.code=="ArrowDown")direction= cols;
        if (e.code=="ArrowRight")direction= 1;
        if (e.code=="ArrowLeft")direction= -1;
        if (e.code=="Enter" && !isGameStarted ) gamesStart() ;
    });

//game start logic
function gamesStart(){
        if (isGameStarted) return
        isGameStarted=true
        document.getElementById("stat").innerHTML=``;
        createFood();
        coreGame();
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
        //snake flip logic
        
        if( (prev_direction==-1 && direction==1)|| 
         (prev_direction==1 && direction==-1)||
         (prev_direction==-cols&&direction==cols )||
        (prev_direction==cols&&direction==-cols )){
            direction=prev_direction
        }
        prev_direction=direction
        const newHead=snakeArr[0]+direction;
        if (snakeArr[0]==food_index){
            //snake increase
            snakeArr.push(newHead)
            //score increase
            updateScore();
            //food reporoduce 
            createFood();
            // increase spped
            increaseSpeed();

        }
        if (newHead<0 || newHead>=gridSize){
            isGameStarted=false

            gameEnd(intervalID)
            return;
        }
        if ((direction==-1 && leftWall.includes(snakeArr[0]))|| (direction==1 && rightWall.includes(snakeArr[0]+1))){
            isGameStarted=false
            gameEnd(intervalID);
            return;
        }
        snakeArr.unshift(newHead);
        snakeArr.pop();

        removeSnake();
        let head=0
        snakeArr.forEach(element => {
            const s= document.createElement("div");
            if (head==0) {
                s.style.backgroundColor="#006400" ;
                s.classList.add(".snake-head")
                head+=1;
            }
            s.classList.add("snake")
            board.children[element].appendChild(s);
        });

    }
    intervalID=setInterval(moveSnake,speeed);
    function increaseSpeed(){
    clearInterval(intervalID)
    speeed-=1.5
    if (speeed<20) speeed=20;
    console.log(speeed)
    intervalID=setInterval(moveSnake,speeed);
}
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
    return food_index
}

function removeSnake(){
    document.querySelectorAll(".snake").forEach(s => s.remove());//remove the all current class with .snake
}

function resetGame(){
    direction=1;
    speeed=90;
    snakeArr=[centerIndex]
    updateScore();
    removeSnake();
    createSnake();

}

function updateScore(){
    if (isGameStarted){
        score=snakeArr.length-1
        document.getElementById("stat").innerHTML=`Score: ${score}`;
    }
}

//game end logic
function gameEnd(intervalID){
    clearInterval(intervalID);
    intervalID=null;
    isGameStarted=false;

    // display alert 
    document.getElementById("stat").innerHTML=`Game Finished !! Score: ${snakeArr.length-1}`;
    //restart the game
    resetGame();
}

