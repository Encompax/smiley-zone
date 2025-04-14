
const colors = ["green", "red", "yellow", "blue"];
let sequence = [];
let playerSequence = [];
let simonStatus = document.getElementById("simonStatus");

function flashButton(color) {
  const button = document.getElementById(color);
  button.style.opacity = 0.3;
  setTimeout(() => button.style.opacity = 1, 300);
}

function playSequence() {
  let i = 0;
  simonStatus.textContent = "Watch the pattern...";
  const interval = setInterval(() => {
    flashButton(sequence[i]);
    i++;
    if (i >= sequence.length) {
      clearInterval(interval);
      simonStatus.textContent = "Now it's your turn!";
    }
  }, 600);
}

function nextRound() {
  playerSequence = [];
  const nextColor = colors[Math.floor(Math.random() * colors.length)];
  sequence.push(nextColor);
  playSequence();
}

function checkInput(color) {
  playerSequence.push(color);
  flashButton(color);
  const index = playerSequence.length - 1;
  if (playerSequence[index] !== sequence[index]) {
    simonStatus.textContent = "Wrong! Game Over.";
    sequence = [];
    setTimeout(nextRound, 2000);
    return;
  }
  if (playerSequence.length === sequence.length) {
    simonStatus.textContent = "Good job! Next round...";
    setTimeout(nextRound, 1000);
  }
}

document.querySelectorAll(".simonBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (sequence.length > 0 && simonStatus.textContent.includes("your turn")) {
      checkInput(btn.id);
    }
  });
});

nextRound();
