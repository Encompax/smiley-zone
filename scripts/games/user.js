(() => {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

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
    if (!table) return;
    table.innerHTML = "";
    leaderboard
      .sort((a, b) => b.score - a.score)
      .forEach((entry, index) => {
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
    const tokenEl = document.getElementById("tokenBalance");
    if (tokenEl) tokenEl.textContent = user.tokens || 0;
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

  // ✅ Globally exposed arcade user API
  window.arcadeUser = {
    saveUser,
    earnTokens,
    spendTokens,
    addScoreToLeaderboard,
    createGroup: function () {
      alert("Group creation not implemented yet.");
    }
    get name() {
      return user.name || "";
    },
    get tokens() {
      return user.tokens || 0;
    }
  };

  // ✅ SPA router-compatible page loader
  window.initUser = function () {
    console.log("✅ initUser() called");
    if (user.name) document.getElementById("userName").value = user.name;
    if (user.bio) document.getElementById("userBio").value = user.bio;
    renderLeaderboard();
    updateTokenDisplay();

    const saveBtn = document.getElementById("saveUserBtn");
    const earnBtn = document.getElementById("earnTokensBtn");
    const spendBtn = document.getElementById("spendTokensBtn");

    if (saveBtn) saveBtn.onclick = saveUser;
    if (earnBtn) earnBtn.onclick = () => earnTokens(10);
    if (spendBtn) spendBtn.onclick = () => spendTokens(20);
  };

  // Optional fallback: allow static load without router
  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("userName")) {
      window.initUser();
    }
  });
})();


