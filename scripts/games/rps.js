
(() => {
  function play(userChoice) {
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    let result = "";

    if (userChoice === computerChoice) {
      result = "It's a tie!";
    } else if (
      (userChoice === "rock" && computerChoice === "scissors") ||
      (userChoice === "paper" && computerChoice === "rock") ||
      (userChoice === "scissors" && computerChoice === "paper")
    ) {
      result = "You win!";
    } else {
      result = "Computer wins!";
    }

    const resultDisplay = document.getElementById("rpsResult");
    if (resultDisplay) {
      resultDisplay.innerHTML = `
        You chose: <strong>${userChoice}</strong><br>
        Computer chose: <strong>${computerChoice}</strong><br>
        <strong>${result}</strong>
      `;
    }
  }

  // ✅ Expose only one global entry point
  window.initRPS = function () {
    const rockBtn = document.getElementById("rockBtn");
    const paperBtn = document.getElementById("paperBtn");
    const scissorsBtn = document.getElementById("scissorsBtn");

    if (rockBtn) rockBtn.onclick = () => play("rock");
    if (paperBtn) paperBtn.onclick = () => play("paper");
    if (scissorsBtn) scissorsBtn.onclick = () => play("scissors");

    // Optional: clear result on init
    const resultDisplay = document.getElementById("rpsResult");
    if (resultDisplay) resultDisplay.innerHTML = "Make your move!";
  };

  // ✅ Auto-init if DOM is ready and page loaded directly
  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("rockBtn")) {
      window.initRPS();
    }
  });
})();

