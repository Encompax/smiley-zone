
window.initJumper = function () {
  const canvas = document.getElementById("jumperCanvas");

  if (!canvas) {
    console.warn("⚠️ Jumper canvas not found.");
    return;
  }

  const ctx = canvas.getContext("2d");
  const gravity = 0.5;
  const jumpStrength = -10;

  let player, platforms, gameRunning;

  function createPlatforms() {
    platforms = [];
    for (let i = 0; i < 6; i++) {
      platforms.push({
        x: Math.random() * (canvas.width - 80),
        y: i * 100,
        width: 80,
        height: 10
      });
    }
  }

  function drawPlayer() {
    ctx.fillStyle = "#0095DD";
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }

  function drawPlatforms() {
    ctx.fillStyle = "#8BC34A";
    platforms.forEach(p => ctx.fillRect(p.x, p.y, p.width, p.height));
  }

  function movePlayer() {
    player.dy += gravity;
    player.y += player.dy;
    player.x += player.dx;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 250) {
      let delta = 250 - player.y;
      player.y = 250;
      platforms.forEach(p => p.y += delta);
    }

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

    if (player.y > canvas.height) {
      gameRunning = false;
      alert("💀 Game Over!");
    }
  }

  function draw() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawPlatforms();
    movePlayer();
    requestAnimationFrame(draw);
  }

  function startJumperGame() {
    player = { x: 200, y: 400, width: 30, height: 30, dx: 0, dy: 0 };
    createPlatforms();
    gameRunning = true;
    requestAnimationFrame(draw);
  }

  document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") player.dx = -5;
    if (e.key === "ArrowRight") player.dx = 5;
  });

  document.addEventListener("keyup", e => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") player.dx = 0;
  });

  // Start game once canvas is ready and user initiates
  const startButton = document.getElementById("startJumperBtn");
  if (startButton) {
    startButton.onclick = startJumperGame;
  } else {
    // fallback to auto-start for now if no start button exists
    startJumperGame();
  }

  console.log("✅ Jumper initialized successfully.");
};
