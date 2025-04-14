
const grid = document.getElementById("whackGrid");
const scoreDisplay = document.getElementById("whackScore");
let score = 0;
let currentMole = null;

function createGrid() {
  for (let i = 0; i < 9; i++) {
    const hole = document.createElement("div");
    hole.className = "hole";
    hole.style.width = "100px";
    hole.style.height = "100px";
    hole.style.background = "#a1887f";
    hole.style.border = "2px solid #5d4037";
    hole.style.display = "flex";
    hole.style.alignItems = "center";
    hole.style.justifyContent = "center";
    hole.style.cursor = "pointer";
    hole.dataset.index = i;
    hole.addEventListener("click", () => whack(i));
    grid.appendChild(hole);
  }
}

function showMole() {
  if (currentMole !== null) {
    grid.children[currentMole].textContent = "";
  }
  const index = Math.floor(Math.random() * 9);
  grid.children[index].textContent = "🐹";
  currentMole = index;
}

function whack(index) {
  if (index === currentMole) {
    score++;
    scoreDisplay.textContent = "Score: " + score;
    grid.children[currentMole].textContent = "";
    currentMole = null;
  }
}

createGrid();
setInterval(showMole, 1000);
