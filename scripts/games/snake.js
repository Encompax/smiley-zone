
const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = "RIGHT";
let food = {
  x: Math.floor(Math.random() * 19 + 1) * box,
  y: Math.floor(Math.random() * 19 + 1) * box
};

document.addEventListener("keydown", changeDirection);
canvas.addEventListener("touchstart", startTouch, false);
canvas.addEventListener("touchmove", moveTouch, false);

let xStart = null;
let yStart = null;
let game = null; // Declare this at the top globally

function startGame() {
  document.getElementById("startBtn").style.display = "none";
  resetGame();
  game = setInterval(draw, 100);  // Restart the game loop
}

function resetGame() {
  snake = [{ x: 9 * box, y: 10 * box }]; // Reset snake to initial state
  direction = "RIGHT";
  food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
  };
}

function gameOver() {
  clearInterval(game);
  alert("Game Over!");
  showStartButton();
}

function showStartButton() {
  document.getElementById("startBtn").style.display = "inline-block";
}


function startTouch(e) {
  xStart = e.touches[0].clientX;
  yStart = e.touches[0].clientY;
}

function moveTouch(e) {
  if (!xStart || !yStart) return;
  let xEnd = e.touches[0].clientX;
  let yEnd = e.touches[0].clientY;
  let xDiff = xStart - xEnd;
  let yDiff = yStart - yEnd;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0 && direction !== "RIGHT") direction = "LEFT";
    else if (xDiff < 0 && direction !== "LEFT") direction = "RIGHT";
  } else {
    if (yDiff > 0 && direction !== "DOWN") direction = "UP";
    else if (yDiff < 0 && direction !== "UP") direction = "DOWN";
  }
  xStart = null;
  yStart = null;
}

function changeDirection(event) {
  if (event.keyCode === 37 && direction !== "RIGHT") direction = "LEFT";
  else if (event.keyCode === 38 && direction !== "DOWN") direction = "UP";
  else if (event.keyCode === 39 && direction !== "LEFT") direction = "RIGHT";
  else if (event.keyCode === 40 && direction !== "UP") direction = "DOWN";
}

function draw() {
  ctx.fillStyle = "lightyellow";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "green" : "lime";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "white";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  if (headX === food.x && headY === food.y) {
    food = {
      x: Math.floor(Math.random() * 19 + 1) * box,
      y: Math.floor(Math.random() * 19 + 1) * box
    };
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };

  if (headX < 0 || headX >= canvas.width || headY < 0 || headY >= canvas.height || collision(newHead, snake)) {
    gameOver();
  }
  

  snake.unshift(newHead);
}

function collision(head, array) {
  return array.some(segment => head.x === segment.x && head.y === segment.y);
}

const game = setInterval(draw, 100);
