
const memoryGrid = document.getElementById("memoryGrid");
const icons = ["A", "B", "C", "D", "E", "F", "G", "H"];
let cards = [...icons, ...icons].sort(() => Math.random() - 0.5);
let flipped = [];
let lock = false;

function renderMemoryGame() {
  memoryGrid.innerHTML = "";
  cards.forEach((icon, index) => {
    const card = document.createElement("div");
    card.className = "memory-card";
    card.style.width = "80px";
    card.style.height = "80px";
    card.style.background = "#f48fb1";
    card.style.display = "flex";
    card.style.alignItems = "center";
    card.style.justifyContent = "center";
    card.style.fontSize = "32px";
    card.style.color = "#f48fb1";
    card.style.border = "2px solid #880e4f";
    card.style.cursor = "pointer";
    card.dataset.index = index;
    card.dataset.icon = icon;
    card.addEventListener("click", () => flipCard(card, icon));
    memoryGrid.appendChild(card);
  });
}

function flipCard(card, icon) {
  if (lock || card.style.color === "#000") return;

  card.style.color = "#000";
  flipped.push(card);

  if (flipped.length === 2) {
    lock = true;
    setTimeout(() => {
      if (flipped[0].dataset.icon !== flipped[1].dataset.icon) {
        flipped[0].style.color = "#f48fb1";
        flipped[1].style.color = "#f48fb1";
      }
      flipped = [];
      lock = false;
    }, 800);
  }
}

renderMemoryGame();
