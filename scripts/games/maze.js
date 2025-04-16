
(() => {
  const tileSize = 40;
  const player = { x: 1, y: 1 };
  const goal = { x: 6, y: 6 };

  const maze = [
    [1,1,1,1,1,1,1,1],
    [1,0,0,1,0,0,0,1],
    [1,0,0,1,0,1,0,1],
    [1,0,1,1,0,1,0,1],
    [1,0,0,0,0,1,0,1],
    [1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1]
  ];

  let canvas, ctx;

  function drawMaze() {
    if (!ctx) return;

    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        ctx.fillStyle = maze[y][x] === 1 ? "#000" : "#fff";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }

    // Draw goal
    ctx.fillStyle = "gold";
    ctx.fillRect(goal.x * tileSize, goal.y * tileSize, tileSize, tileSize);

    // Draw player
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x * tileSize + 5, player.y * tileSize + 5, tileSize - 10, tileSize - 10);
  }

  function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;

    if (maze[newY][newX] === 0) {
      player.x = newX;
      player.y = newY;
      drawMaze();
      checkWin();
    }
  }

  function checkWin() {
    if (player.x === goal.x && player.y === goal.y) {
      const msg = document.getElementById("mazeMessage");
      if (msg) msg.textContent = "🎉 You made it out!";
    }
  }

  function handleKey(e) {
    if (e.key === "ArrowUp") movePlayer(0, -1);
    if (e.key === "ArrowDown") movePlayer(0, 1);
    if (e.key === "ArrowLeft") movePlayer(-1, 0);
    if (e.key === "ArrowRight") movePlayer(1, 0);
  }

  // ✅ Public entry point
  window.initMazeGame = function () {
    canvas = document.getElementById("mazeCanvas");
    if (!canvas) return;

    ctx = canvas.getContext("2d");

    document.removeEventListener("keydown", handleKey); // prevent duplicates
    document.addEventListener("keydown", handleKey);

    drawMaze();
  };

  // ✅ Auto-run if routed directly
  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("mazeCanvas")) {
      window.initMazeGame();
    }
  });
})();
