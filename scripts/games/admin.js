(() => {
  let unlocks = JSON.parse(localStorage.getItem("unlocks") || "{}");
  let user = JSON.parse(localStorage.getItem("user") || "{}");
  let blockedUsers = JSON.parse(localStorage.getItem("blockedUsers") || "[]");
  let auditLog = JSON.parse(localStorage.getItem("auditLog") || "[]");
  let moderationSettings = JSON.parse(localStorage.getItem("moderationSettings") || JSON.stringify({
    enabled: true,
    tokenLimit: 100,
    unlockLimit: 5,
    loginFailLimit: 3
  }));

  const shopItems = {
    theme: { label: "Bonus Theme", cost: 30 },
    snake: { label: "Golden Snake Mode", cost: 50 },
    avatar: { label: "Custom Avatar", cost: 20 }
  };

  function renderShopEditor() {
    const editor = document.getElementById("shopEditor");
    editor.innerHTML = "";
    Object.keys(shopItems).forEach(item => {
      const { label, cost } = shopItems[item];
      const locked = !unlocks[item];
      editor.innerHTML += `
        <div style="margin-bottom: 10px;">
          <strong>${label}</strong><br>
          Cost: <input type="number" id="price-${item}" value="${cost}" style="width: 60px;" />
          <button onclick="toggleItem('${item}')">${locked ? "Unlock" : "Lock"}</button>
          <span id="status-${item}">${locked ? "Locked" : "Unlocked"}</span>
        </div>
      `;
    });
  }

  function toggleItem(item) {
    unlocks[item] = !unlocks[item];
    localStorage.setItem("unlocks", JSON.stringify(unlocks));
    document.getElementById("status-" + item).textContent = unlocks[item] ? "Unlocked" : "Locked";
  }

  function renderUserManager() {
    const container = document.getElementById("userManager");
    container.innerHTML = `
      <p><strong>User:</strong> ${user.name || "N/A"}<br>
      <strong>Status:</strong> <span id="userStatus">${blockedUsers.includes(user.name) ? "Blocked" : "Active"}</span><br>
      <button onclick="toggleBlock('${user.name}')">
        ${blockedUsers.includes(user.name) ? "Unblock" : "Block"} User
      </button></p>
    `;
  }

  function toggleBlock(username) {
    if (!username) return;
    const index = blockedUsers.indexOf(username);
    const action = index > -1 ? "Unblocked user" : "Blocked user";
    if (index > -1) blockedUsers.splice(index, 1);
    else blockedUsers.push(username);
    localStorage.setItem("blockedUsers", JSON.stringify(blockedUsers));
    renderUserManager();
    logAuditEvent("security", action, username);
  }

  function drawCharts() {
    const ctx1 = document.getElementById("tokenChart").getContext("2d");
    const ctx2 = document.getElementById("unlockChart").getContext("2d");

    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: ['Your Tokens'],
        datasets: [{
          label: 'Token Balance',
          data: [user.tokens || 0],
          backgroundColor: ['#42a5f5']
        }]
      },
      options: { responsive: true }
    });

    new Chart(ctx2, {
      type: 'pie',
      data: {
        labels: Object.keys(shopItems),
        datasets: [{
          label: 'Unlocked Items',
          data: Object.keys(shopItems).map(key => unlocks[key] ? 1 : 0),
          backgroundColor: ['#66bb6a', '#ffa726', '#ab47bc']
        }]
      },
      options: { responsive: true }
    });
  }

  function logAuditEvent(category, action, user = "N/A") {
    const entry = {
      timestamp: new Date().toISOString(),
      category,
      action,
      user
    };
    auditLog.push(entry);
    localStorage.setItem("auditLog", JSON.stringify(auditLog));
    renderAuditLog();
  }

  function renderAuditLog() {
    const table = document.getElementById("auditLogTable");
    if (!table) return;
    table.innerHTML = "";
    auditLog.slice().reverse().forEach(entry => {
      const row = `<tr>
        <td>${new Date(entry.timestamp).toLocaleString()}</td>
        <td>${entry.category}</td>
        <td>${entry.action}</td>
        <td>${entry.user}</td>
      </tr>`;
      table.innerHTML += row;
    });
  }

  function loadModerationSettings() {
    document.getElementById("autoModerationToggle").checked = moderationSettings.enabled;
    document.getElementById("tokenLimit").value = moderationSettings.tokenLimit;
    document.getElementById("unlockLimit").value = moderationSettings.unlockLimit;
    document.getElementById("loginFailLimit").value = moderationSettings.loginFailLimit;
  }

  function saveModerationSettings() {
    moderationSettings.enabled = document.getElementById("autoModerationToggle").checked;
    moderationSettings.tokenLimit = parseInt(document.getElementById("tokenLimit").value);
    moderationSettings.unlockLimit = parseInt(document.getElementById("unlockLimit").value);
    moderationSettings.loginFailLimit = parseInt(document.getElementById("loginFailLimit").value);
    localStorage.setItem("moderationSettings", JSON.stringify(moderationSettings));
    document.getElementById("moderationStatus").textContent = "Moderation settings saved.";
  }

  function initializeAdmin() {
    renderShopEditor();
    renderUserManager();
    drawCharts();
    renderAuditLog();
    loadModerationSettings();
  }

  document.addEventListener("DOMContentLoaded", initializeAdmin);

  // Expose minimal globals needed for inline or router.js
  window.toggleBlock = toggleBlock;
  window.toggleItem = toggleItem;
  window.saveModerationSettings = saveModerationSettings;
})();

