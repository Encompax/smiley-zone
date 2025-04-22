(() => {
  const routeOverrides = {
    red: "red.html",
    yellow: "yellow.html",
    blue: "blue.html",
    green: "green.html",
    user: "user.html",
    home: "home.html",
    admin: "admin.html"
  };

  function tryInitGame(page) {
    const initFunctionName = `init${page.charAt(0).toUpperCase() + page.slice(1)}`;
    const initFunction = window[initFunctionName];

    if (typeof initFunction === "function") {
      try {
        initFunction();
        console.log(`✅ ${initFunctionName}() executed successfully`);
      } catch (e) {
        console.error(`❌ ${initFunctionName}() failed to execute`, e);
      }
    } else {
      console.warn(`⚠️ ${initFunctionName} is not defined or not a function`);
    }
  }

  function normalizeStartButtons() {
    const phrases = ["New Game", "Start Game", "Play", "Begin", "Go"];
    document.querySelectorAll("button").forEach(btn => {
      if (phrases.includes(btn.textContent.trim())) {
        btn.textContent = "Start";
      }
    });
  }

  function loadGame() {
    const page = window.location.hash.substring(1) || "home";
    const htmlPath = routeOverrides[page] || `games/${page}.html`;

    fetch(htmlPath)
      .then(response => response.text())
      .then(html => {
        const container = document.getElementById("gameContainer");
        container.innerHTML = html;

        const oldScript = document.getElementById("dynamicScript");
        if (oldScript) oldScript.remove();

        if (page === "chess") {
          const chessJS = document.createElement("script");
          chessJS.src = "https://cdnjs.cloudflare.com/ajax/libs/chess.js/1.0.0-beta.1/chess.min.js";
          chessJS.defer = true;
          document.body.appendChild(chessJS);

          const chessboardJS = document.createElement("script");
          chessboardJS.src = "https://unpkg.com/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.js";
          chessboardJS.defer = true;
          document.body.appendChild(chessboardJS);

          const chessCSS = document.createElement("link");
          chessCSS.rel = "stylesheet";
          chessCSS.href = "https://unpkg.com/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css";
          document.head.appendChild(chessCSS);
        }

        if (!routeOverrides[page] && page !== "home") {
          const script = document.createElement("script");
          script.src = `scripts/games/${page}.js`;
          script.id = "dynamicScript";
          script.defer = true;
          script.onload = () => {
            tryInitGame(page);
            normalizeStartButtons();
          };
          document.body.appendChild(script);
        } else {
          normalizeStartButtons();
        }

        const cssPath = window.location.pathname.includes("/games/")
          ? "../style.css"
          : "style.css";
        const existingLink = document.querySelector(`link[href='${cssPath}']`);
        if (!existingLink) {
          const cssLink = document.createElement("link");
          cssLink.rel = "stylesheet";
          cssLink.href = cssPath;
          document.head.appendChild(cssLink);
        }

        // ✅ Sync chat visibility after content loads
        if (typeof routeAwareChatToggle === "function") routeAwareChatToggle();
      })
      .catch(() => {
        const container = document.getElementById("gameContainer");
        container.innerHTML = `
          <h2 class="error">404 - File Not Found</h2>
          <p>The requested game could not be loaded.</p>`;
      });
  }

  function initializeAdmin() {
    if (typeof renderShopEditor === 'function') renderShopEditor();
    if (typeof renderUserManager === 'function') renderUserManager();
    if (typeof drawCharts === 'function') drawCharts();
    if (typeof renderAuditLog === 'function') renderAuditLog();
    if (typeof loadModerationSettings === 'function') loadModerationSettings();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const initialPage = window.location.hash.substring(1) || "home";
    if (initialPage === "admin") {
      initializeAdmin();
    }
    loadGame();
    if (typeof routeAwareChatToggle === "function") routeAwareChatToggle();
  });

  window.addEventListener("hashchange", () => {
    const page = window.location.hash.substring(1);
    if (page === "admin") {
      initializeAdmin();
    } else {
      loadGame();
    }
    if (typeof routeAwareChatToggle === "function") routeAwareChatToggle();
  });
})();
