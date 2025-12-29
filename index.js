
//board logic
const board= document.getElementById("game-board");
const gridSize=1800;
for(let i=0;i<gridSize;i++){
    const cell = document.createElement("div");
    cell.classList.add("cell");
    board.appendChild(cell);
}

//game start logic
const startBtn= document.getElementById("game-start");
function gamesStart(isStarted){
    if (isStarted){
        console.log("GameStarted");
        startBtn.style.display="block";
        createSnake();
    }
    else{
        console.log("display startButton")
    }
}
 
function createSnake(){
    const cols=60
    const rows=30
    
    const centerRow=Math.floor(rows/2)
    const centerCol=Math.floor(cols/2)

    const centerIndex=centerRow*cols+centerCol
    const centerCell=board.children[centerIndex]

    snake= document.createElement("div");
    snake.classList.add("snake")
    centerCell.appendChild(snake)
    console.log("added in center")
    coreGame(centerIndex)
}

function coreGame(centerIndex){
    snakeArr=[centerIndex];
    let direction=1;
    const cols=60
    //collect key boiard events
    document.addEventListener("keydown",(e)=>{
        if (e.code=="ArrowUp")direction= -cols;
        if (e.code=="ArrowDown")direction= cols;
        if (e.code=="ArrowRight")direction= 1;
        if (e.code=="ArrowLeft")direction= -1;
    });
    function moveSnake(){
        const newHead=snakeArr[0]+direction;
        if (newHead<=0 || newHead>=1800 ){
            gameEnd(intervalID)
            return;
        }
        snakeArr.unshift(newHead);
        snakeArr.pop();

        document.querySelectorAll(".snake").forEach(s => s.remove());//remove the all current class with .snake

        snakeArr.forEach(element => {
            const s= document.createElement("div");
            s.classList.add("snake")
            board.children[element].appendChild(s);
        });

    }
    const intervalID=setInterval(moveSnake,90);

}

//game end logic
function gameEnd(intervalID){
    // display alert 
    alert("Game Failed")
    clearInterval(intervalID);
    //restart the game
    gamesStart(false)
}

