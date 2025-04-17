// 11. whack.js
window.initGame = function () {
  const grid = document.getElementById("whackGrid");
  const scoreDisplay = document.getElementById("whackScore");
  let score = 0;
  let activeIndex = null;
  let holes = [];

  function setup() {
    grid.innerHTML = "";
    holes = [];
    for (let i = 0; i < 9; i++) {
      const div = document.createElement("div");
      div.className = "whack-hole";
      div.onclick = () => hitMole(i);
      grid.appendChild(div);
      holes.push(div);
    }
    spawnMole();
  }

  function spawnMole() {
    if (activeIndex !== null) holes[activeIndex].classList.remove("active");
    activeIndex = Math.floor(Math.random() * holes.length);
    holes[activeIndex].classList.add("active");
    setTimeout(spawnMole, 1000);
  }

  function hitMole(index) {
    if (index === activeIndex) {
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      holes[index].classList.remove("active");
      activeIndex = null;
    }
  }

  setup();
};

