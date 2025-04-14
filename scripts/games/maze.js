
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
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

function drawMaze() {
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
    document.getElementById("mazeMessage").textContent = "You made it out!";
  }
}

document.addEventListener("keydown", event => {
  if (event.key === "ArrowUp") movePlayer(0, -1);
  if (event.key === "ArrowDown") movePlayer(0, 1);
  if (event.key === "ArrowLeft") movePlayer(-1, 0);
  if (event.key === "ArrowRight") movePlayer(1, 0);
});

drawMaze();
