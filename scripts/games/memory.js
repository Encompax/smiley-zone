window.initMemory = function () {
  const gameContainer = document.getElementById("gameContainer");
  const gridContainerId = "memoryGrid";
  let gridSize = 4;
  let level = 1;
  let score = 0;

  const iconSet = "ABCDEFGHIJKLMNPQRSTUVWXYZ1234567890".split("");

  function createDisplayElements() {
    if (!document.getElementById("scoreDisplay")) {
      const scoreEl = document.createElement("div");
      scoreEl.id = "scoreDisplay";
      scoreEl.style.textAlign = "center";
      scoreEl.style.margin = "1rem 0";
      scoreEl.style.fontSize = "18px";
      gameContainer.appendChild(scoreEl);
    }

    if (!document.getElementById("levelDisplay")) {
      const levelEl = document.createElement("div");
      levelEl.id = "levelDisplay";
      levelEl.style.textAlign = "center";
      levelEl.style.margin = "0.5rem 0 1rem";
      levelEl.style.fontSize = "18px";
      gameContainer.appendChild(levelEl);
    }
  }

  function updateDisplays() {
    document.getElementById("scoreDisplay").textContent = `Score: ${score}`;
    document.getElementById("levelDisplay").textContent = `Level: ${level} (${gridSize}x${gridSize})`;
  }

  function generateCardIcons() {
    const pairCount = Math.floor((gridSize * gridSize) / 2);
    const selectedIcons = iconSet.slice(0, pairCount);
    const icons = [...selectedIcons, ...selectedIcons].sort(() => Math.random() - 0.5);
    return icons;
  }

  function renderMemoryGame() {
    let flipped = [];
    let lock = false;

    createDisplayElements();
    updateDisplays();

    const icons = generateCardIcons();

    const existingGrid = document.getElementById(gridContainerId);
    if (existingGrid) existingGrid.remove();

    const memoryGrid = document.createElement("div");
    memoryGrid.id = gridContainerId;
    memoryGrid.style.display = "grid";
    memoryGrid.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;
    memoryGrid.style.justifyContent = "center";
    memoryGrid.style.gap = "10px";
    memoryGrid.style.marginBottom = "2rem";
    gameContainer.appendChild(memoryGrid);

    icons.forEach((icon, index) => {
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

      card.addEventListener("click", () => {
        if (lock || card.classList.contains("matched") || flipped.includes(card)) return;

        card.style.color = "#000";
        flipped.push(card);

        if (flipped.length === 2) {
          lock = true;
          setTimeout(() => {
            if (flipped[0].dataset.icon === flipped[1].dataset.icon) {
              flipped[0].classList.add("matched");
              flipped[1].classList.add("matched");
              score++;
              updateDisplays();

              if (document.querySelectorAll(".matched").length === icons.length) {
                level++;
                gridSize++;
                setTimeout(() => {
                  alert(`Level ${level - 1} complete! Get ready for ${gridSize}x${gridSize}`);
                  renderMemoryGame();
                }, 500);
              }
            } else {
              flipped[0].style.color = "#f48fb1";
              flipped[1].style.color = "#f48fb1";
            }
            flipped = [];
            lock = false;
          }, 800);
        }
      });

      memoryGrid.appendChild(card);
    });
  }

  renderMemoryGame();

  console.log("🧠 Memory game initialized with progressive difficulty.");
};
