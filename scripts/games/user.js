
let leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
let user = JSON.parse(localStorage.getItem("user") || "{}");

function saveUser() {
  const name = document.getElementById("userName").value.trim();
  const bio = document.getElementById("userBio").value.trim();
  if (name) {
    user.name = name;
    user.bio = bio;
    localStorage.setItem("user", JSON.stringify(user));
    alert("Profile saved!");
    updateTokenDisplay();
  }
}

function renderLeaderboard() {
  const table = document.getElementById("leaderboardTable");
  table.innerHTML = "";
  leaderboard.sort((a, b) => b.score - a.score).forEach((entry, index) => {
    const row = `<tr><td>${index + 1}</td><td>${entry.name}</td><td>${entry.score}</td></tr>`;
    table.innerHTML += row;
  });
}

function addScoreToLeaderboard(name, score) {
  leaderboard.push({ name, score });
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  renderLeaderboard();
}

function updateTokenDisplay() {
  document.getElementById("tokenBalance").textContent = user.tokens || 0;
}

function earnTokens(amount) {
  user.tokens = (user.tokens || 0) + amount;
  localStorage.setItem("user", JSON.stringify(user));
  updateTokenDisplay();
}

function spendTokens(amount) {
  if ((user.tokens || 0) >= amount) {
    user.tokens -= amount;
    localStorage.setItem("user", JSON.stringify(user));
    updateTokenDisplay();
    alert(`You spent ${amount} tokens.`);
  } else {
    alert("Not enough tokens.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (user.name) document.getElementById("userName").value = user.name;
  if (user.bio) document.getElementById("userBio").value = user.bio;
  renderLeaderboard();
  updateTokenDisplay();
});
