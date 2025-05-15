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

  async function renderUserHighScores() {
    if (!currentUserUID) return;

    try {
      const snapshot = await db.collection("scores")
        .where("uid", "==", currentUserUID)
        .where("game", "==", "snake")
        .orderBy("score", "desc")
        .limit(5)
        .get();

      const scoresList = document.getElementById("userHighScores");
      scoresList.innerHTML = "";

      if (snapshot.empty) {
        scoresList.innerHTML = "<li>No scores yet.</li>";
        return;
      }

      snapshot.forEach(doc => {
        const entry = doc.data();
        const li = document.createElement("li");
        li.textContent = `🟢 ${entry.score} pts`;
        scoresList.appendChild(li);
      });
    } catch (err) {
      console.error("❌ Failed to render user high scores:", err);
    }
  }

  // ✅ SPA router-compatible page loader
  window.initUser = async function () {
    console.log("✅ initUser() called");

    await loadUserData();

    if (user.name) document.getElementById("userName").value = user.name;
    if (user.bio) document.getElementById("userBio").value = user.bio;

    updateTokenDisplay();
    renderUserHighScores(); // ✅ Inject the new score list

    const saveBtn = document.getElementById("saveUserBtn");
    const earnBtn = document.getElementById("earnTokensBtn");
    const spendBtn = document.getElementById("spendTokensBtn");

    if (saveBtn) saveBtn.onclick = saveUser;
    if (earnBtn) earnBtn.onclick = () => earnTokens(10);
    if (spendBtn) spendBtn.onclick = () => spendTokens(20);
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("userName")) {
      window.initUser();
    }
  });

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
