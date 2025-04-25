(() => {
  const routeOverrides = {
    red: "red.html",
    yellow: "yellow.html",
    blue: "blue.html",
    green: "green.html",
    home: "home.html",
    admin: "admin.html",
    user: "user.html",
    signup: "signup.html", // ✅ added
    login: "login.html"    // ✅ added
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
        // 🔄 Dual container logic (new and legacy)
        const container = document.getElementById("spa-view") || document.getElementById("gameContainer");
        if (!container) {
          console.error("❌ No valid container (#spa-view or #gameContainer) found in DOM.");
          return;
        }

        container.innerHTML = html;

        // 🧹 Remove any previously added dynamic script
        const oldScript = document.getElementById("dynamicScript");
        if (oldScript) oldScript.remove();

        // ♟ Special case for chess dependencies
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

        // 🧠 Load corresponding JS logic for games
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

        // 💬 Toggle chat visibility if function exists
        if (typeof routeAwareChatToggle === "function") {
          routeAwareChatToggle();
        }
      })
      .catch(err => {
        const container = document.getElementById("spa-view") || document.getElementById("gameContainer");
        if (container) {
          container.innerHTML = `
            <h2 class="error">404 - File Not Found</h2>
            <p>The requested page could not be loaded.</p>`;
        }
        console.error("❌ Error loading game page:", err);
      });
  }

  function initializeAdmin() {
    if (typeof renderShopEditor === 'function') renderShopEditor();
    if (typeof renderUserManager === 'function') renderUserManager();
    if (typeof drawCharts === 'function') drawCharts();
    if (typeof renderAuditLog === 'function') renderAuditLog();
    if (typeof loadModerationSettings === 'function') loadModerationSettings();
  }

  // 🚦 Initial load trigger
  document.addEventListener("DOMContentLoaded", () => {
    const initialPage = window.location.hash.substring(1) || "home";
    if (initialPage === "admin") {
      initializeAdmin();
    }
    loadGame();
  });

  // 🔁 SPA navigation trigger
  window.addEventListener("hashchange", () => {
    const page = window.location.hash.substring(1);
    if (page === "admin") {
      initializeAdmin();
    }
    loadGame();
  });
})();
