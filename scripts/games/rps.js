// 3. rps.js
window.initGame = function () {
  const result = document.getElementById("rpsResult");
  const choices = ["rock", "paper", "scissors"];

  function computerChoice() {
    return choices[Math.floor(Math.random() * 3)];
  }

  function play(user) {
    const comp = computerChoice();
    let outcome = "";
    if (user === comp) outcome = "It's a tie!";
    else if (
      (user === "rock" && comp === "scissors") ||
      (user === "scissors" && comp === "paper") ||
      (user === "paper" && comp === "rock")
    ) outcome = `You win! ${user} beats ${comp}`;
    else outcome = `You lose! ${comp} beats ${user}`;

    result.textContent = outcome;
  }

  document.getElementById("rockBtn").onclick = () => play("rock");
  document.getElementById("paperBtn").onclick = () => play("paper");
  document.getElementById("scissorsBtn").onclick = () => play("scissors");
};

