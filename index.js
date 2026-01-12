const GAME_CONFIG ={
    GROWTH_SIZE:3,
    MIN_SPEED: 20,
    ROWS:30,
    COLS:60,
    INITIAL_SPEED:90
}

const ROWS=GAME_CONFIG.ROWS
const COLS=GAME_CONFIG.COLS

//board logic
const board = document.getElementById("game-board");
const gridSize = COLS*ROWS;
for (let i = 0; i < gridSize; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  board.appendChild(cell);
}

let intervalID = null;
const centerRow = Math.floor(ROWS / 2);
const centerCol = Math.floor(COLS / 2);
const centerIndex = centerRow * COLS + centerCol;

const gameState = {
  snake: [centerIndex],
  direction: 1,
  prev_direction: 1,
  food: null,
  speed: GAME_CONFIG.INITIAL_SPEED,
  running: false,
  score: 0,
  growthPending:0,
};

//collect key boiard events when user presses it starts game
document.addEventListener("keydown", (e) => {
  if (e.code == "Enter" && !gameState.running){ 
    gamesStart();
    return;}
  if (!gameState.running)return;
  if (e.code === "ArrowUp") gameState.direction = -COLS;
  if (e.code === "ArrowDown") gameState.direction = COLS;
  if (e.code === "ArrowRight") gameState.direction = 1;
  if (e.code === "ArrowLeft") gameState.direction = -1;
  
});

//game start logic
function gamesStart() {
  if (gameState.running) return;
  gameState.running = true;
  document.getElementById("stat").innerHTML = ``;
  spawnFood();
  coreGame();
}

function moveSnake() {
  //snake flip logic
  const snake = gameState.snake;
  const dir = gameState.direction;
  const prev = gameState.prev_direction;
  if (
    (prev == -1 && dir == 1) ||
    (prev == 1 && dir == -1) ||
    (prev == -COLS && dir == COLS) ||
    (prev == COLS && dir == -COLS)
  ) {
    gameState.direction = gameState.prev_direction;
  }
  gameState.prev_direction = gameState.direction;

  const newHead = snake[0] + gameState.direction;
  const headCol = snake[0] % COLS;

  const bodyToCheck =
    newHead === gameState.food ? snake.slice(1) : snake.slice(1, -1);
  if (bodyToCheck.includes(newHead)) {
    gameEnd();
    return;
  }
  if (newHead < 0 || newHead >= gridSize) {
    gameEnd();
    return;
  }
  if (
    (gameState.direction === -1 && headCol === 0) ||
    (gameState.direction === 1 && headCol === COLS - 1)
  ) {
    gameEnd();
    return;
  }
  if (newHead == gameState.food) {
    snake.unshift(newHead);
    gameState.growthPending+=GAME_CONFIG.GROWTH_SIZE//growthSize
    updateScore();
    spawnFood();
    increaseSpeed();
    return;
  }

  snake.unshift(newHead);
  if (gameState.growthPending>0)gameState.growthPending--;
  else snake.pop();
}

function coreGame() {
    if (intervalID) clearInterval(intervalID)
    intervalID = setInterval(gameLoop, gameState.speed);
}

function gameLoop() {
  moveSnake();
  Renderer.render(gameState);
}

function increaseSpeed() {
  clearInterval(intervalID);
  gameState.speed = Math.max(GAME_CONFIG.MIN_SPEED, gameState.speed - 1.5);
  intervalID = setInterval(gameLoop, gameState.speed);
}

const Renderer = {
  board: document.getElementById("game-board"),

  render() {
    this.clear();
    this.renderSnake(gameState.snake);
    this.renderFood(gameState.food);
  },
  clear() {
    this.board.querySelectorAll(".snake, .food").forEach((s) => s.remove());
  },
  renderSnake(snake) {
    snake.forEach((index, i) => {
      const el = document.createElement("div");
      el.classList.add("snake");
      if (i === 0) el.classList.add("snake-head");
      this.board.children[index].appendChild(el);
    });
  },
  renderFood(index) {
    if (index == null) return;
    const food = document.createElement("div");
    food.classList.add("food");
    this.board.children[index].appendChild(food);
  },
};

function spawnFood() {
  let rand_cell;
  do {
    rand_cell = Math.floor(Math.random() * gridSize);
  } while (gameState.snake.includes(rand_cell));
  gameState.food = rand_cell;
}

function resetGame() {
  gameState.snake = [centerIndex];
  gameState.direction = 1;
  gameState.prev_direction = 1;
  gameState.speed = GAME_CONFIG.INITIAL_SPEED;
  gameState.food = null;
  gameState.score = 0;
}

function updateScore() {
  if (gameState.running) {
    gameState.score = gameState.snake.length - 1;
    document.getElementById("stat").innerHTML = `Score: ${gameState.score}`;
  }
}

//game end logic
function gameEnd() {
  clearInterval(intervalID);
  intervalID = null;
  gameState.running = false;

  // display alert
  document.getElementById("stat").innerHTML = `Game Finished !! Score: ${
    gameState.snake.length - 1
  } Press Enter to Start`;
  //restart the game
  resetGame();
}
