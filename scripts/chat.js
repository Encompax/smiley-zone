// Function to show or hide the chat sidebar based on current route
function toggleChatSidebar() {
    const chatSidebar = document.getElementById("chatSidebar");
    const currentHash = window.location.hash || "#home";
  
    // Only show chat on non-home routes
    if (currentHash === "#home") {
      chatSidebar.style.display = "none";
    } else {
      chatSidebar.style.display = "block";
    }
  }
  
  // Initialize chat functionality
  function initializeChat() {
    toggleChatSidebar(); // Check on initial load
  
    const input = document.getElementById("chatInput");
    const log = document.getElementById("chatLog");
  
    if (!input || !log) return;
  
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && input.value.trim() !== "") {
        const msg = input.value;
        input.value = "";
  
        log.innerHTML += `<div><strong>You:</strong> ${msg}</div>`;
        log.scrollTop = log.scrollHeight;
  
        // Simulated AI reply (simple reverse string)
        setTimeout(() => {
          const reply = msg.split("").reverse().join("");
          log.innerHTML += `<div><strong>AI:</strong> ${reply}</div>`;
          log.scrollTop = log.scrollHeight;
        }, 600);
      }
    });
  }
  
  // Bind chat control to route changes and DOM readiness
  window.addEventListener("hashchange", toggleChatSidebar);
  document.addEventListener("DOMContentLoaded", initializeChat);
  