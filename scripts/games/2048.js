
const grid2048 = document.getElementById("grid2048");
const scoreDisplay2048 = document.getElementById("score2048");
let tiles = Array(16).fill(0);
let score2048 = 0;

function createGrid2048() {
  grid2048.innerHTML = "";
  tiles.forEach((val, i) => {
    const tile = document.createElement("div");
    tile.textContent = val > 0 ? val : "";
    tile.style.width = "80px";
    tile.style.height = "80px";
    tile.style.display = "flex";
    tile.style.alignItems = "center";
    tile.style.justifyContent = "center";
    tile.style.background = val ? "#fbc02d" : "#eee";
    tile.style.border = "2px solid #999";
    tile.style.fontSize = "22px";
    tile.style.fontWeight = "bold";
    grid2048.appendChild(tile);
  });
}

function generateTile2048() {
  let empty = [];
  tiles.forEach((val, i) => {
    if (val === 0) empty.push(i);
  });
  if (empty.length === 0) return;
  const randomIndex = empty[Math.floor(Math.random() * empty.length)];
  tiles[randomIndex] = Math.random() > 0.5 ? 2 : 4;
  createGrid2048();
}

function slide(row) {
  let arr = row.filter(val => val);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score2048 += arr[i];
      arr[i + 1] = 0;
    }
  }
  return arr.filter(val => val).concat(Array(4 - arr.filter(val => val).length).fill(0));
}

function moveLeft() {
  for (let i = 0; i < 4; i++) {
    let row = tiles.slice(i * 4, i * 4 + 4);
    let newRow = slide(row);
    for (let j = 0; j < 4; j++) {
      tiles[i * 4 + j] = newRow[j];
    }
  }
  generateTile2048();
  updateScore2048();
}

function moveRight() {
  for (let i = 0; i < 4; i++) {
    let row = tiles.slice(i * 4, i * 4 + 4).reverse();
    let newRow = slide(row);
    newRow.reverse();
    for (let j = 0; j < 4; j++) {
      tiles[i * 4 + j] = newRow[j];
    }
  }
  generateTile2048();
  updateScore2048();
}

function moveUp() {
  for (let i = 0; i < 4; i++) {
    let col = [tiles[i], tiles[i + 4], tiles[i + 8], tiles[i + 12]];
    let newCol = slide(col);
    for (let j = 0; j < 4; j++) {
      tiles[i + j * 4] = newCol[j];
    }
  }
  generateTile2048();
  updateScore2048();
}

function moveDown() {
  for (let i = 0; i < 4; i++) {
    let col = [tiles[i + 12], tiles[i + 8], tiles[i + 4], tiles[i]];
    let newCol = slide(col);
    newCol.reverse();
    for (let j = 0; j < 4; j++) {
      tiles[i + j * 4] = newCol[j];
    }
  }
  generateTile2048();
  updateScore2048();
}

function updateScore2048() {
  scoreDisplay2048.textContent = "Score: " + score2048;
  createGrid2048();
}

document.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
    case "ArrowUp":
      moveUp();
      break;
    case "ArrowDown":
      moveDown();
      break;
  }
});

createGrid2048();
generateTile2048();
generateTile2048();
