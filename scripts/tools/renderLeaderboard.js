const db = firebase.firestore();

async function fetchTopScores(limit = 10) {
  try {
    const querySnapshot = await db.collection("scores")
      .where("game", "==", "snake") // ✅ Filter only snake game scores
      .orderBy("score", "desc")
      .limit(limit)
      .get();

    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("❌ Failed to fetch leaderboard data:", error);
    return [];
  }
}

window.renderLeaderboard = async function () {
  const scores = await fetchTopScores();

  // 🔷 For user.html table view
  const table = document.getElementById("leaderboardTable");
  if (table) {
    table.innerHTML = "";
    if (scores.length === 0) {
      table.innerHTML = "<tr><td colspan='3'>No scores yet.</td></tr>";
    } else {
      scores.forEach((entry, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${entry.name || "Anonymous"}</td>
          <td>${entry.score}</td>
        `;
        table.appendChild(row);
      });
    }
  }

  // 🟢 For snake.html list view
  const list = document.getElementById("leaderboardList");
  if (list) {
    list.innerHTML = "";
    if (scores.length === 0) {
      list.innerHTML = "<li>No high scores yet.</li>";
    } else {
      scores.forEach((entry, index) => {
        const item = document.createElement("li");
        item.textContent = `${index + 1}. ${entry.name || "Anonymous"} – ${entry.score}`;
        list.appendChild(item);
      });
    }
  }
};

