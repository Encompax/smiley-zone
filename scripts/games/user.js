(() => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  let user = {};
  let currentUserUID = null;

  function saveUser() {
    const nameEl = document.getElementById("userName");
    const bioEl = document.getElementById("userBio");
    const name = nameEl?.value.trim() || "";
    const bio = bioEl?.value.trim() || "";

    if (!currentUserUID || !name) return alert("❌ Not logged in or name is missing.");

    const updatedData = { name, bio };

    db.collection("users").doc(currentUserUID).update(updatedData)
      .then(() => {
        user.name = name;
        user.bio = bio;
        alert("✅ Profile saved!");
        updateUserDisplay(); // update all visible sections
      })
      .catch((error) => {
        console.error("❌ Error saving profile:", error);
        alert("Failed to save profile.");
      });
  }

  function updateUserDisplay() {
    const tokenBalance = user.tokens || 0;

    const nameDisplay = document.getElementById("userNameDisplay");
    if (nameDisplay) nameDisplay.textContent = user.name || "...";

    const emailDisplay = document.getElementById("userEmailDisplay");
    if (emailDisplay) emailDisplay.textContent = user.email || "...";

    const nameInput = document.getElementById("userName");
    if (nameInput) nameInput.value = user.name || "";

    const bioInput = document.getElementById("userBio");
    if (bioInput) bioInput.value = user.bio || "";

    const tokenEls = [
      document.getElementById("tokenBalance"),
      document.getElementById("tokenBalanceDisplay")
    ];
    tokenEls.forEach(el => {
      if (el) el.textContent = tokenBalance;
    });

    const loginBtn = document.querySelector("a[href='#login']");
    const signupBtn = document.querySelector("a[href='#signup']");
    if (loginBtn) loginBtn.textContent = user.name || "My Profile";
    if (signupBtn) signupBtn.style.display = "none";
  }

  function updateTokenDisplay() {
    user.tokens = user.tokens || 0;

    const tokenEls = [
      document.getElementById("tokenBalance"),
      document.getElementById("tokenBalanceDisplay")
    ];
    tokenEls.forEach(el => {
      if (el) el.textContent = user.tokens;
    });
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
      if (!scoresList) return;

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

  // ✅ SPA-compatible user initialization
  window.initUser = async function () {
    console.log("✅ initUser() called");

    await loadUserData();
    updateUserDisplay();
    renderUserHighScores();

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
    },
    createGroup: () => alert("⚙️ Group creation coming soon.") // stub for group creation
  };
})();
