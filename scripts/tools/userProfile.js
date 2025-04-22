// userProfile.js
import { getDatabase, ref, get, set, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const db = getDatabase();
const userId = localStorage.getItem("szaUserId") || generateUserId();
function generateUserId() {
  const id = "guest_" + Math.random().toString(36).substring(2, 10);
  localStorage.setItem("szaUserId", id);
  return id;
}

const userNameInput = document.getElementById("userName");
const userBioInput = document.getElementById("userBio");
const tokenSpan = document.getElementById("tokenBalance");
const groupList = document.getElementById("userGroupList");

export const arcadeUser = {
  async loadProfile() {
    const profileRef = ref(db, `users/${userId}/profile`);
    const snapshot = await get(profileRef);
    if (snapshot.exists()) {
      const profile = snapshot.val();
      userNameInput.value = profile.displayName || "";
      userBioInput.value = profile.bio || "";
      tokenSpan.textContent = profile.tokens || 0;
      arcadeUser.renderGroups(profile.groups || []);
    } else {
      tokenSpan.textContent = 0;
    }
  },

  saveUser() {
    const displayName = userNameInput.value.trim();
    const bio = userBioInput.value.trim();
    const updatedProfile = {
      displayName,
      bio,
      lastUpdated: Date.now(),
    };
    update(ref(db, `users/${userId}/profile`), updatedProfile).then(() => {
      alert("✅ Profile saved successfully.");
    }).catch((err) => {
      console.error("❌ Error saving profile:", err);
    });
  },

  earnTokens(amount) {
    const userRef = ref(db, `users/${userId}/profile`);
    get(userRef).then((snap) => {
      const current = snap.exists() ? snap.val().tokens || 0 : 0;
      update(userRef, { tokens: current + amount });
      tokenSpan.textContent = current + amount;
    });
  },

  spendTokens(amount) {
    const userRef = ref(db, `users/${userId}/profile`);
    get(userRef).then((snap) => {
      const current = snap.exists() ? snap.val().tokens || 0 : 0;
      if (current >= amount) {
        update(userRef, { tokens: current - amount });
        tokenSpan.textContent = current - amount;
      } else {
        alert("❌ Not enough tokens.");
      }
    });
  },

  renderGroups(groupNames) {
    groupList.innerHTML = groupNames.length === 0 ? "<li>No groups yet.</li>" : "";
    groupNames.forEach((name) => {
      const li = document.createElement("li");
      li.textContent = name;
      groupList.appendChild(li);
    });
  },

  async createGroup() {
    const groupName = prompt("🆕 Enter new group name:", "MyCoolGroup");
    if (!groupName) return;

    const cleanName = groupName.trim().replace(/\s+/g, "_");
    const groupRef = ref(db, `groups/${cleanName}`);
    const snapshot = await get(groupRef);
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

    await set(groupRef, groupData);
    await update(ref(db, `users/${userId}/profile`), {
      groups: { [cleanName]: true },
    });
    alert(`✅ Group \"${groupName}\" created.`);
    arcadeUser.loadProfile();
  }
};

window.addEventListener("DOMContentLoaded", arcadeUser.loadProfile);
