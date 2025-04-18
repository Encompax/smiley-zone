// 2. minesweeper.js
window.initMinesweeper = function () {
  const gridSize = 8;
  const mineCount = 10;
  const minesweeperGrid = document.getElementById("minesweeperGrid");
  const statusDisplay = document.getElementById("minesweeperStatus");
  let board = [];
  let revealed = [];
  let gameOver = false;

  function initMinesweeper() {
    board = Array(gridSize * gridSize).fill(0);
    revealed = Array(gridSize * gridSize).fill(false);
    gameOver = false;
    let minesPlaced = 0;

    while (minesPlaced < mineCount) {
      let index = Math.floor(Math.random() * board.length);
      if (board[index] !== "M") {
        board[index] = "M";
        minesPlaced++;
        getNeighbors(index).forEach(i => {
          if (board[i] !== "M") board[i]++;
        });
      }
    }

    renderMinesweeper();
  }

  function getNeighbors(index) {
    const neighbors = [];
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        let r = row + dr;
        let c = col + dc;
        if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
          neighbors.push(r * gridSize + c);
        }
      }
    }
    return neighbors;
  }

  function reveal(index) {
    if (gameOver || revealed[index]) return;
    revealed[index] = true;
    const tile = document.getElementById("tile-" + index);

    if (board[index] === "M") {
      tile.textContent = "💣";
      tile.style.background = "#e53935";
      gameOver = true;
      statusDisplay.textContent = "Game Over!";
      return;
    }

    tile.textContent = board[index] > 0 ? board[index] : "";
    tile.style.background = "#c8e6c9";

    if (board[index] === 0) {
      getNeighbors(index).forEach(reveal);
    }

    if (revealed.filter(v => v).length === gridSize * gridSize - mineCount) {
      statusDisplay.textContent = "You Win!";
      gameOver = true;
    }
  }

  function renderMinesweeper() {
    minesweeperGrid.innerHTML = "";
    for (let i = 0; i < board.length; i++) {
      const tile = document.createElement("div");
      tile.id = "tile-" + i;
      tile.style.width = "40px";
      tile.style.height = "40px";
      tile.style.background = "#eeeeee";
      tile.style.border = "1px solid #888";
      tile.style.display = "flex";
      tile.style.alignItems = "center";
      tile.style.justifyContent = "center";
      tile.style.fontSize = "18px";
      tile.style.cursor = "pointer";
      tile.addEventListener("click", () => reveal(i));
      minesweeperGrid.appendChild(tile);
    }
    statusDisplay.textContent = "";
  }

  initMinesweeper();
};
