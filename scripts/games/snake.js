let canvas, ctx, box = 20;
let snake, direction, food, game = null;

// ✅ Reset game state
window.resetGame = function () {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = "RIGHT";
  food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
  };
};

// ✅ Main game loop
window.draw = function () {
  ctx.fillStyle = "lightyellow";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "green" : "white";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "black";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  if (
    headX < 0 || headX >= canvas.width ||
    headY < 0 || headY >= canvas.height ||
    collision({ x: headX, y: headY }, snake)
  ) {
    gameOver();
    return;
  }

  if (headX === food.x && headY === food.y) {
    food = {
      x: Math.floor(Math.random() * 19 + 1) * box,
      y: Math.floor(Math.random() * 19 + 1) * box
    };
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };
  snake.unshift(newHead);

  const scoreDisplay = document.getElementById("scoreboard");
  if (scoreDisplay) scoreDisplay.textContent = "Score: " + (snake.length - 1);
};

// ✅ Collision detection
function collision(head, array) {
  return array.some(segment => head.x === segment.x && head.y === segment.y);
}

// ✅ Handle direction change
window.changeDirection = function (event) {
  if (event.keyCode === 37 && direction !== "RIGHT") direction = "LEFT";
  else if (event.keyCode === 38 && direction !== "DOWN") direction = "UP";
  else if (event.keyCode === 39 && direction !== "LEFT") direction = "RIGHT";
  else if (event.keyCode === 40 && direction !== "UP") direction = "DOWN";
};

// ✅ Game over logic
window.gameOver = function () {
  clearInterval(game);
  alert("Game Over!");
  const btn = document.getElementById("startBtn");
  if (btn) btn.style.display = "inline-block";
};

// ✅ Start game
window.startGame = function () {
  const btn = document.getElementById("startBtn");
  if (btn) btn.style.display = "none";
  resetGame();
  game = setInterval(draw, 100);
};

// ✅ Initialize canvas and game on full page load
window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  resetGame();

  document.addEventListener("keydown", changeDirection);

  const btn = document.getElementById("startBtn");
  if (btn) btn.addEventListener("click", startGame);
};




