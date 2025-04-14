
const puzzleGrid = document.getElementById("puzzleGrid");
const size = 3;
let puzzleArray = [...Array(size * size - 1).keys()].map(n => n + 1).concat("");

function renderPuzzle() {
  puzzleGrid.innerHTML = "";
  puzzleArray.forEach((val, idx) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.textContent = val;
    tile.style.width = "100px";
    tile.style.height = "100px";
    tile.style.display = "flex";
    tile.style.alignItems = "center";
    tile.style.justifyContent = "center";
    tile.style.background = val ? "#90caf9" : "transparent";
    tile.style.border = "2px solid #0d47a1";
    tile.style.fontSize = "24px";
    tile.style.cursor = "pointer";
    tile.addEventListener("click", () => moveTile(idx));
    puzzleGrid.appendChild(tile);
  });
}

function moveTile(index) {
  const emptyIndex = puzzleArray.indexOf("");
  const validMoves = [emptyIndex - 1, emptyIndex + 1, emptyIndex - size, emptyIndex + size];
  if (validMoves.includes(index)) {
    [puzzleArray[emptyIndex], puzzleArray[index]] = [puzzleArray[index], puzzleArray[emptyIndex]];
    renderPuzzle();
  }
}

function shufflePuzzle() {
  puzzleArray.sort(() => Math.random() - 0.5);
  renderPuzzle();
}

shufflePuzzle();
