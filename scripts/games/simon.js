
// 🟢 FIXED: 5. simon.js — now includes Start button trigger
window.initGame = function () {
  const colors = ["red", "green", "blue", "yellow"];
  let sequence = [];
  let playerSequence = [];
  let acceptingInput = false;

  function flash(button) {
    button.classList.add("active");
    setTimeout(() => button.classList.remove("active"), 500);
  }

  function playSequence() {
    acceptingInput = false;
    playerSequence = [];
    let i = 0;
    const interval = setInterval(() => {
      flash(document.getElementById(sequence[i]));
      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
        acceptingInput = true;
      }
    }, 700);
  }

  function nextRound() {
    const nextColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(nextColor);
    playSequence();
  }

  function checkInput(color) {
    if (!acceptingInput) return;
    playerSequence.push(color);
    const index = playerSequence.length - 1;
    if (playerSequence[index] !== sequence[index]) {
      alert("Game Over!");
      sequence = [];
      return;
    }
    if (playerSequence.length === sequence.length) {
      setTimeout(nextRound, 1000);
    }
  }

  colors.forEach(color => {
    const btn = document.getElementById(color);
    if (btn) {
      btn.onclick = () => checkInput(color);
    }
  });

  const startBtn = document.getElementById("startSimonBtn");
  if (startBtn) startBtn.onclick = () => {
    sequence = [];
    nextRound();
  };
};