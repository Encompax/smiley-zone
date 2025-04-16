
// platform.js (jumper game)

let canvas, ctx;
let player;
const gravity = 0.5;
const jumpStrength = -10;
let platforms = [];

// GLOBAL: Initialize game and set up canvas
window.initPlatformJumper = function () {
  canvas = document.getElementById("jumperCanvas");
  if (!canvas) return;

  ctx = canvas.getContext("2d");

  player = { x: 200, y: 400, width: 30, height: 30, dx: 0, dy: 0 };
  platforms = [];

  window.createPlatforms();
  document.addEventListener("keydown", window.handleKeyDown);
  document.addEventListener("keyup", window.handleKeyUp);
  requestAnimationFrame(window.drawPlatformJumper);
};

// GLOBAL: Create jumping platforms
window.createPlatforms = function () {
  platforms = [];
  for (let i = 0; i < 6; i++) {
    let plat = {
      x: Math.random() * (canvas.width - 80),
      y: i * 100,
      width: 80,
      height: 10
    };
    platforms.push(plat);
  }
};

// GLOBAL: Draw player
window.drawPlayer = function () {
  ctx.fillStyle = "#0095DD";
  ctx.fillRect(player.x, player.y, player.width, player.height);
};

// GLOBAL: Draw platforms
window.drawPlatforms = function () {
  ctx.fillStyle = "#8BC34A";
  platforms.forEach(p => {
    ctx.fillRect(p.x, p.y, p.width, p.height);
  });
};

// GLOBAL: Move logic
window.movePlayer = function () {
  player.dy += gravity;
  player.y += player.dy;
  player.x += player.dx;

  // Wall boundaries
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

  // Camera scrolling effect
  if (player.y < 250) {
    let delta = 250 - player.y;
    player.y = 250;
    platforms.forEach(p => p.y += delta);
  }

  // Platform collision
  platforms.forEach(p => {
    if (
      player.x + player.width > p.x &&
      player.x < p.x + p.width &&
      player.y + player.height > p.y &&
      player.y + player.height < p.y + p.height &&
      player.dy > 0
    ) {
      player.dy = jumpStrength;
    }
  });

  // Game over
  if (player.y > canvas.height) {
    alert("💀 Game Over!");
    window.initPlatformJumper();
  }
};

// GLOBAL: Main draw loop
window.drawPlatformJumper = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  window.drawPlayer();
  window.drawPlatforms();
  window.movePlayer();
  requestAnimationFrame(window.drawPlatformJumper);
};

// GLOBAL: Input handlers
window.handleKeyDown = function (e) {
  if (e.key === "ArrowLeft") player.dx = -5;
  if (e.key === "ArrowRight") player.dx = 5;
};

window.handleKeyUp = function (e) {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") player.dx = 0;
};

