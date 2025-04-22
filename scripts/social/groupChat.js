// groupChat.js
import {
    getDatabase,
    ref,
    push,
    onChildAdded,
    serverTimestamp
  } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
  
  const db = getDatabase();
  const userId = localStorage.getItem("szaUserId") || "guest_" + Math.random().toString(36).substring(2, 10);
  
  const chatContainer = document.getElementById("chatContainer");
  const chatLog = document.getElementById("chatLog");
  const chatInput = document.getElementById("chatInput");
  const sendChatBtn = document.getElementById("sendChatBtn");
  const groupLabel = document.getElementById("activeGroupName");
  
  let currentGroup = null;
  
  export function openGroupChat(groupName, displayName) {
    currentGroup = groupName;
    groupLabel.textContent = groupName;
    chatContainer.style.display = "block";
    chatLog.innerHTML = "<p>🔄 Loading chat...</p>";
    chatInput.value = "";
  
    const chatRef = ref(db, `groups/${groupName}/chat`);
    chatLog.innerHTML = "";
    onChildAdded(chatRef, (snapshot) => {
      const msg = snapshot.val();
      const p = document.createElement("p");
      p.innerHTML = `<strong>${msg.name}</strong>: ${msg.text}`;
      chatLog.appendChild(p);
      chatLog.scrollTop = chatLog.scrollHeight;
    });
  
    sendChatBtn.onclick = () => {
      const text = chatInput.value.trim();
      if (!text || !currentGroup) return;
      push(ref(db, `groups/${currentGroup}/chat`), {
        text,
        name: displayName || "Anonymous",
        sender: userId,
        timestamp: serverTimestamp(),
      });
      chatInput.value = "";
    };
  }