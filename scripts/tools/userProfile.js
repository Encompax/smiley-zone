(() => {
  const db = firebase.database(); // Assumes Firebase is globally initialized
  const userId = localStorage.getItem("szaUserId") || generateUserId();

  function generateUserId() {
    const id = "guest_" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem("szaUserId", id);
    return id;
  }

  const userNameInput = () => document.getElementById("userName");
  const userBioInput = () => document.getElementById("userBio");
  const tokenSpan = () => document.getElementById("tokenBalance");
  const groupList = () => document.getElementById("userGroupList");
  const leaderboardTable = () => document.getElementById("leaderboardTable");

  const arcadeUser = {
    async loadProfile() {
      const profileRef = db.ref(`users/${userId}/profile`);
      try {
        const snapshot = await profileRef.get();
        if (snapshot.exists()) {
          const profile = snapshot.val();
          if (userNameInput()) userNameInput().value = profile.displayName || "";
          if (userBioInput()) userBioInput().value = profile.bio || "";
          if (tokenSpan()) tokenSpan().textContent = profile.tokens || 0;
          arcadeUser.renderGroups(profile.groups || []);
        } else {
          if (tokenSpan()) tokenSpan().textContent = 0;
        }
        arcadeUser.renderLeaderboard();
      } catch (err) {
        console.error("❌ Failed to load profile:", err);
      }
    },

    saveUser() {
      const displayName = userNameInput()?.value.trim() || "";
      const bio = userBioInput()?.value.trim() || "";

      const updatedProfile = {
        displayName,
        bio,
        lastUpdated: Date.now(),
      };

      db.ref(`users/${userId}/profile`).update(updatedProfile)
        .then(() => alert("✅ Profile saved successfully."))
        .catch(err => console.error("❌ Error saving profile:", err));
    },

    earnTokens(amount) {
      const userRef = db.ref(`users/${userId}/profile`);
      userRef.get().then(snap => {
        const current = snap.exists() ? snap.val().tokens || 0 : 0;
        userRef.update({ tokens: current + amount });
        if (tokenSpan()) tokenSpan().textContent = current + amount;
      });
    },

    spendTokens(amount) {
      const userRef = db.ref(`users/${userId}/profile`);
      userRef.get().then(snap => {
        const current = snap.exists() ? snap.val().tokens || 0 : 0;
        if (current >= amount) {
          userRef.update({ tokens: current - amount });
          if (tokenSpan()) tokenSpan().textContent = current - amount;
        } else {
          alert("❌ Not enough tokens.");
        }
      });
    },

    renderGroups(groupNames) {
      const list = groupList();
      if (!list) return;
      list.innerHTML = groupNames.length === 0 ? "<li>No groups yet.</li>" : "";
      groupNames.forEach(name => {
        const li = document.createElement("li");
        li.textContent = name;
        list.appendChild(li);
      });
    },

    async createGroup() {
      const groupName = prompt("🆕 Enter new group name:", "MyCoolGroup");
      if (!groupName) return;

      const cleanName = groupName.trim().replace(/\s+/g, "_");
      const groupRef = db.ref(`groups/${cleanName}`);

      try {
        const snapshot = await groupRef.get();
        if (snapshot.exists()) {
          alert("❌ Group already exists.");
          return;
        }

        const groupData = {
          createdBy: userId,
          members: { [userId]: "admin" },
          invites: {},
          description: "A new group created in SZA",
        };

        await groupRef.set(groupData);
        await db.ref(`users/${userId}/profile`).update({
          groups: { [cleanName]: true },
        });

        alert(`✅ Group "${groupName}" created.`);
        arcadeUser.loadProfile();
      } catch (err) {
        console.error("❌ Error creating group:", err);
      }
    },

    async renderLeaderboard() {
      const table = leaderboardTable();
      if (!table) return;

      table.innerHTML = "<tr><th>Rank</th><th>Name</th><th>Score</th></tr>";

      const scoreQuery = db.ref("scores").orderByChild("score").limitToFirst(10);
      try {
        const snapshot = await scoreQuery.get();
        const scores = [];

        snapshot.forEach(childSnap => {
          scores.push({ ...childSnap.val(), key: childSnap.key });
        });

        scores.sort((a, b) => b.score - a.score); // descending

        scores.forEach((entry, index) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name || "Anonymous"}</td>
            <td>${entry.score}</td>
          `;
          table.appendChild(row);
        });
      } catch (err) {
        console.error("❌ Failed to render leaderboard:", err);
        table.innerHTML += "<tr><td colspan='3'>Failed to load.</td></tr>";
      }
    }
  };

  // Expose globally for event handlers
  window.arcadeUser = arcadeUser;

  // Auto-load profile on DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("userName")) {
      arcadeUser.loadProfile();
    }
  });
})();
