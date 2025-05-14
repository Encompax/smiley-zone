const db = firebase.firestore();

async function fetchTopScores(limit = 10) {
  try {
    const querySnapshot = await db.collection("scores")
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

  // For user.html table view
  const table = document.getElementById("leaderboardTable");
  if (table) {
    table.innerHTML = "";
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

  // For snake.html list view
  const list = document.getElementById("leaderboardList");
  if (list) {
    list.innerHTML = "";
    scores.forEach((entry, index) => {
      const item = document.createElement("li");
      item.textContent = `${entry.name || "Anonymous"} - ${entry.score}`;
      list.appendChild(item);
    });
  }
};
