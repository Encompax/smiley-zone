(() => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  let user = {};
  let currentUserUID = null;

  function saveUser() {
    const name = document.getElementById("userName").value.trim();
    const bio = document.getElementById("userBio").value.trim();

    if (!currentUserUID || !name) return alert("❌ Not logged in or name is missing.");

    const updatedData = { name, bio };

    db.collection("users").doc(currentUserUID).update(updatedData)
      .then(() => {
        user.name = name;
        user.bio = bio;
        alert("✅ Profile saved!");
        updateTokenDisplay();
      })
      .catch((error) => {
        console.error("❌ Error saving profile:", error);
        alert("Failed to save profile.");
      });
  }

  function renderLeaderboard() {
    const table = document.getElementById("leaderboardTable");
    if (!table) return;
    table.innerHTML = "";

    // TODO: Migrate leaderboard to Firestore if needed
  }

  function updateTokenDisplay() {
    const tokenEl = document.getElementById("tokenBalance");
    if (tokenEl) tokenEl.textContent = user.tokens || 0;
  }

  function earnTokens(amount) {
    if (!currentUserUID) return;

    user.tokens = (user.tokens || 0) + amount;

    db.collection("users").doc(currentUserUID).update({ tokens: user.tokens })
      .then(updateTokenDisplay)
      .catch(err => console.error("❌ Failed to update tokens:", err));
  }

  function spendTokens(amount) {
    if ((user.tokens || 0) < amount) return alert("Not enough tokens.");
    user.tokens -= amount;

    db.collection("users").doc(currentUserUID).update({ tokens: user.tokens })
      .then(() => {
        updateTokenDisplay();
        alert(`You spent ${amount} tokens.`);
      })
      .catch(err => console.error("❌ Token spend failed:", err));
  }

  async function loadUserData() {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    currentUserUID = currentUser.uid;

    try {
      const doc = await db.collection("users").doc(currentUserUID).get();
      if (doc.exists) {
        user = doc.data();
      }
    } catch (err) {
      console.error("❌ Failed to load user data:", err);
    }
  }

  async function loadUserScores(uid) {
    const scoresRef = db.collection("scores");
    const snapshot = await scoresRef
      .where("uid", "==", uid)
      .where("game", "==", "snake")
      .orderBy("score", "desc")
      .limit(5)
      .get();

    const scoreList = document.getElementById("userScores");
    if (!scoreList) return;

    scoreList.innerHTML = "";

    if (snapshot.empty) {
      scoreList.innerHTML = "<li>No scores yet.</li>";
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      const li = document.createElement("li");
      li.textContent = `Score: ${data.score}, Date: ${new Date(data.timestamp?.toDate()).toLocaleString()}`;
      scoreList.appendChild(li);
    });
  }

  // ✅ SPA router-compatible page loader
  window.initUser = async function () {
    console.log("✅ initUser() called");

    await loadUserData();

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

    // 👇 Load personal scores
    await loadUserScores(currentUserUID);
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("userName")) {
      window.initUser();
    }
  });

  // ✅ Globally exposed arcade user API
  window.arcadeUser = {
    saveUser,
    earnTokens,
    spendTokens,
    get name() {
      return user.name || "";
    },
    get tokens() {
      return user.tokens || 0;
    }
  };
})();

