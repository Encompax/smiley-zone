// groupHub.js
import { getDatabase, ref, get, set, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { openGroupChat } from "./groupChat.js";

const db = getDatabase();
const userId = localStorage.getItem("szaUserId") || generateUserId();
function generateUserId() {
  const id = "guest_" + Math.random().toString(36).substring(2, 10);
  localStorage.setItem("szaUserId", id);
  return id;
}

const groupListDiv = document.getElementById("groupList");
const groupCreateBtn = document.getElementById("createGroupBtn");
const summaryStats = document.getElementById("userSummaryStats");

function loadGroups() {
  const allGroupsRef = ref(db, "groups");
  get(allGroupsRef).then((snapshot) => {
    groupListDiv.innerHTML = "";
    if (!snapshot.exists()) {
      groupListDiv.innerHTML = "<p>No groups yet.</p>";
      return;
    }

    let joinedCount = 0;
    const groups = snapshot.val();
    Object.entries(groups).forEach(([name, details]) => {
      const isMember = details.members && details.members[userId];
      const isInvited = details.invites && details.invites[userId];

      const card = document.createElement("div");
      card.classList.add("group-card");
      card.innerHTML = `
        <h3>${name}</h3>
        <p>${details.description || "No description."}</p>
        <p><strong>Created by:</strong> ${details.createdBy}</p>
        <p>Status: ${isMember ? "✅ Member" : isInvited ? "📩 Invited" : "❌ Not a member"}</p>
      `;

      if (isInvited && !isMember) {
        const acceptBtn = document.createElement("button");
        acceptBtn.textContent = "✅ Accept Invite";
        acceptBtn.onclick = () => acceptInvite(name);
        card.appendChild(acceptBtn);
      }

      if (isMember) {
        joinedCount++;
        const chatBtn = document.createElement("button");
        chatBtn.textContent = "💬 Chat";
        chatBtn.onclick = () => {
          const profileRef = ref(db, `users/${userId}/profile`);
          get(profileRef).then((snap) => {
            const profile = snap.exists() ? snap.val() : {};
            openGroupChat(name, profile.displayName || "Anonymous");
          });
        };
        card.appendChild(chatBtn);

        const linkPanel = document.createElement("div");
        linkPanel.className = "tool-links";
        linkPanel.innerHTML = `
          <a href="#red" class="tool-btn">📄 Docs</a>
          <a href="#yellow" class="tool-btn">☁️ Cloud</a>
          <a href="#green" class="tool-btn">💰 Tokens</a>
          <a href="#blue" class="tool-btn">👥 Groups</a>
        `;
        card.appendChild(linkPanel);
      }

      groupListDiv.appendChild(card);
    });

    // Display summary stats if applicable
    if (summaryStats) {
      summaryStats.innerHTML = `<p>🔢 Total Groups Joined: <strong>${joinedCount}</strong></p>`;
    }
  });
}

function acceptInvite(groupName) {
  const updates = {};
  updates[`groups/${groupName}/members/${userId}`] = "member";
  updates[`groups/${groupName}/invites/${userId}`] = null;
  updates[`users/${userId}/profile/groups/${groupName}`] = true;
  update(ref(db), updates)
    .then(() => {
      alert("✅ Joined group " + groupName);
      loadGroups();
    })
    .catch((err) => console.error("❌ Failed to join group:", err));
}

function createGroup() {
  const name = prompt("🆕 New Group Name:", "CoolGamers");
  if (!name) return;
  const clean = name.trim().replace(/\s+/g, "_");
  const groupRef = ref(db, `groups/${clean}`);
  get(groupRef).then((snap) => {
    if (snap.exists()) return alert("❌ Group already exists.");
    const data = {
      createdBy: userId,
      description: "New group created by user",
      members: { [userId]: "admin" },
      invites: {},
    };
    set(groupRef, data).then(() => {
      update(ref(db, `users/${userId}/profile/groups/${clean}`), true);
      loadGroups();
    });
  });
}

if (groupCreateBtn) groupCreateBtn.addEventListener("click", createGroup);

window.addEventListener("DOMContentLoaded", loadGroups);