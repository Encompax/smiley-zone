
// 5. simon.js
window.initGame = function () {
  const colors = ["red", "green", "blue", "yellow"];
  let sequence = [];
  let playerSequence = [];
  let index = 0;

  function flash(button) {
    button.classList.add("active");
    setTimeout(() => button.classList.remove("active"), 500);
  }

  function playSequence() {
    playerSequence = [];
    let i = 0;
    const interval = setInterval(() => {
      flash(document.getElementById(sequence[i]));
      i++;
      if (i >= sequence.length) clearInterval(interval);
    }, 700);
  }

  function nextRound() {
    const nextColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(nextColor);
    playSequence();
  }

  function checkInput(color) {
    playerSequence.push(color);
    const currentIndex = playerSequence.length - 1;
    if (playerSequence[currentIndex] !== sequence[currentIndex]) {
      alert("Game Over!");
      sequence = [];
      nextRound();
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

  nextRound();
};