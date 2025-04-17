// 10. 2048.js
window.initGame = function () {
  let tiles = Array(16).fill(0);
  let score2048 = 0;
  let grid2048 = document.getElementById("grid2048");
  let scoreDisplay2048 = document.getElementById("score2048");

  function createGrid2048() {
    grid2048.innerHTML = "";
    tiles.forEach(val => {
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
    const empty = tiles.reduce((acc, val, idx) => (val === 0 ? [...acc, idx] : acc), []);
    if (empty.length === 0) return;
    const randomIndex = empty[Math.floor(Math.random() * empty.length)];
    tiles[randomIndex] = Math.random() > 0.5 ? 2 : 4;
    createGrid2048();
  }

  function slide(row) {
    const arr = row.filter(val => val);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        score2048 += arr[i];
        arr[i + 1] = 0;
      }
    }
    return arr.filter(val => val).concat(Array(4 - arr.filter(val => val).length).fill(0));
  }

  function move(dir) {
    for (let i = 0; i < 4; i++) {
      let line;
      if (dir === "left") line = tiles.slice(i * 4, i * 4 + 4);
      else if (dir === "right") line = tiles.slice(i * 4, i * 4 + 4).reverse();
      else line = [tiles[i], tiles[i + 4], tiles[i + 8], tiles[i + 12]];

      let newLine = slide(line);
      if (dir === "right") newLine = newLine.reverse();

      for (let j = 0; j < 4; j++) {
        if (dir === "left" || dir === "right") tiles[i * 4 + j] = newLine[j];
        else tiles[i + j * 4] = newLine[j];
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
      case "ArrowLeft": move("left"); break;
      case "ArrowRight": move("right"); break;
      case "ArrowUp": move("up"); break;
      case "ArrowDown": move("down"); break;
    }
  });

  createGrid2048();
  generateTile2048();
  generateTile2048();
  updateScore2048();
};

