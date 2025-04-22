let chatOpen = true;
let unreadMessages = 0;

function toggleChat() {
  const chatBox = document.getElementById('chatBox');
  const chatBody = document.getElementById('chatBody');
  const chatAlert = document.getElementById('chatAlert');

  chatOpen = !chatOpen;

  chatBox.classList.toggle('collapsed');
  chatBox.classList.toggle('expanded');

  if (chatOpen) {
    unreadMessages = 0;
    chatAlert.classList.add('hidden');
    chatBody.scrollTop = chatBody.scrollHeight;
  }
}

// Function to simulate receiving a new message
function newMessage(content, from = "AI") {
  const chatBody = document.getElementById('chatBody');
  if (!chatBody) return;

  const msg = document.createElement("div");
  msg.innerHTML = `<strong>${from}:</strong> ${content}`;
  chatBody.appendChild(msg);

  if (!chatOpen) {
    unreadMessages++;
    const alertDot = document.getElementById('chatAlert');
    if (alertDot) alertDot.classList.remove('hidden');
  } else {
    chatBody.scrollTop = chatBody.scrollHeight;
  }
}

// Function to enable user input
function initializeChat() {
  const input = document.getElementById("chatInput");
  const chatBody = document.getElementById("chatBody");

  if (!input || !chatBody) return;

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && input.value.trim() !== "") {
      const msg = input.value.trim();
      input.value = "";

      newMessage(msg, "You");

      // Simulate AI response
      setTimeout(() => {
        const reversed = msg.split("").reverse().join("");
        newMessage(reversed, "AI");
      }, 700);
    }
  });
}

// Monitor SPA hash route changes to show/hide chat
function routeAwareChatToggle() {
  const chatBox = document.getElementById("chatBox");
  const currentHash = window.location.hash || "#home";

  if (chatBox) {
    chatBox.style.display = (currentHash === "#home") ? "none" : "flex";
  }
}

// Init logic
window.addEventListener("hashchange", routeAwareChatToggle);
document.addEventListener("DOMContentLoaded", () => {
  routeAwareChatToggle();
  initializeChat();
});
