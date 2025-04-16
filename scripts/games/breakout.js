
// breakout.js

let canvas, ctx;
let x, y, dx, dy, ballRadius;
let paddleHeight, paddleWidth, paddleX;
let rightPressed = false;
let leftPressed = false;
let brickRowCount, brickColumnCount, brickWidth, brickHeight, brickPadding, brickOffsetTop, brickOffsetLeft;
let score = 0;
let bricks = [];

// GLOBAL: Initialize breakout game after DOM load or routing injection
window.initBreakout = function () {
  canvas = document.getElementById("breakoutCanvas");
  if (!canvas) return;
  
  ctx = canvas.getContext("2d");

  // Ball properties
  ballRadius = 10;
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 2;
  dy = -2;

  // Paddle properties
  paddleHeight = 10;
  paddleWidth = 75;
  paddleX = (canvas.width - paddleWidth) / 2;

  // Brick layout
  brickRowCount = 3;
  brickColumnCount = 5;
  brickWidth = 75;
  brickHeight = 20;
  brickPadding = 10;
  brickOffsetTop = 30;
  brickOffsetLeft = 30;

  // Score
  score = 0;

  // Build brick structure
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  document.addEventListener("keydown", window.keyDownHandler);
  document.addEventListener("keyup", window.keyUpHandler);

  requestAnimationFrame(window.draw);
};

// GLOBAL: Key handlers
window.keyDownHandler = function (e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
};

window.keyUpHandler = function (e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
};

// GLOBAL: Collision logic
window.collisionDetection = function () {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert("🎉 YOU WIN!");
            window.initBreakout(); // restart
          }
        }
      }
    }
  }
};

// GLOBAL: Render ball
window.drawBall = function () {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
};

// GLOBAL: Render paddle
window.drawPaddle = function () {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
};

// GLOBAL: Render bricks
window.drawBricks = function () {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#ff7043";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
};

// GLOBAL: Score display
window.drawScore = function () {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#000";
  ctx.fillText("Score: " + score, 8, 20);
};

// GLOBAL: Main draw loop
window.draw = function () {
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  window.drawBricks();
  window.drawBall();
  window.drawPaddle();
  window.drawScore();
  window.collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
  if (y + dy < ballRadius) dy = -dy;
  else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) dy = -dy;
    else {
      alert("💀 GAME OVER");
      window.initBreakout(); // reset game
      return;
    }
  }

  x += dx;
  y += dy;

  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
  else if (leftPressed && paddleX > 0) paddleX -= 7;

  requestAnimationFrame(window.draw);
};

