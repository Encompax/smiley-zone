// groupHub.js
import { database } from "../utils/firebase-init.js";
import {
  ref,
  set,
  get,
  push,
  onChildAdded,
  serverTimestamp,
  child,
  update
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Simulated user ID and name
const userId = localStorage.getItem("szaUserId") || generateGuestId();
const username = localStorage.getItem("szaUserName") || "Player_" + userId.slice(-4);

// Active group state
let currentGroup = null;

// Fallback guest ID
function generateGuestId() {
  const id = "guest_" + Math.random().toString(36).substring(2, 10);
  localStorage.setItem("szaUserId", id);
  return id;
}

// DOM Elements
const joinBtn = document.getElementById("joinGroupBtn");
const groupInput = document.getElementById("groupName");
const chatLog = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendMsgBtn = document.getElementById("sendMsg");
const groupInfo = document.getElementById("groupInfo");

// Join or create a group
function joinGroup(groupName) {
  currentGroup = groupName;
  groupInfo.innerHTML = `✅ Joined group: <strong>${groupName}</strong> as <strong>${username}</strong>`;
  listenToChat(groupName);
}

// Send chat message
function sendMessage() {
  if (!currentGroup || !chatInput.value.trim()) return;

  const msgRef = push(ref(database, `groups/${currentGroup}/messages`));
  set(msgRef, {
    user: username,
    text: chatInput.value.trim(),
    timestamp: serverTimestamp()
  });

  chatInput.value = "";
}

// Listen for messages in group
function listenToChat(groupName) {
  const msgRef = ref(database, `groups/${groupName}/messages`);

  onChildAdded(msgRef, (snapshot) => {
    const msg = snapshot.val();
    const msgEl = document.createElement("div");
    msgEl.innerHTML = `<strong>${msg.user}:</strong> ${msg.text}`;
    chatLog.appendChild(msgEl);
    chatLog.scrollTop = chatLog.scrollHeight;
  });
}

// Bind events
function initGroupListeners() {
  if (joinBtn && groupInput) {
    joinBtn.addEventListener("click", () => {
      const groupName = groupInput.value.trim();
      if (groupName) {
        joinGroup(groupName);
      }
    });
  }

  if (sendMsgBtn && chatInput) {
    sendMsgBtn.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }
}

// Load on page init
window.addEventListener("DOMContentLoaded", () => {
  initGroupListeners();
});
