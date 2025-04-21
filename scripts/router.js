(() => {
  // -----------------------------
  // Utility: Initialize game script if available
  // -----------------------------
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

  // -----------------------------
  // Normalize button labels to say "Start"
  // -----------------------------
  function normalizeStartButtons() {
    const phrases = ["New Game", "Start Game", "Play", "Begin", "Go"];

    document.querySelectorAll("button").forEach(btn => {
      if (phrases.includes(btn.textContent.trim())) {
        btn.textContent = "Start";
      }
    });
  }

  // -----------------------------
  // Load game content dynamically
  // -----------------------------
  function loadGame() {
    const page = window.location.hash.substring(1) || "home";
    const htmlPath = page === "home" ? `${page}.html` : `games/${page}.html`;

    fetch(htmlPath)
      .then(response => response.text())
      .then(html => {
        const container = document.getElementById("gameContainer");
        container.innerHTML = html;

        // Remove any old dynamic game script
        const oldScript = document.getElementById("dynamicScript");
        if (oldScript) oldScript.remove();

        // -----------------------------
        // Special case: Chess dependencies
        // -----------------------------
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

        // -----------------------------
        // Load game-specific script
        // -----------------------------
        if (page !== "home") {
          const script = document.createElement("script");
          script.src = `scripts/games/${page}.js`;
          script.id = "dynamicScript";
          script.defer = true;
          script.onload = () => {
            tryInitGame(page);
            normalizeStartButtons(); // ✅ Rename buttons after game loads
          };
          document.body.appendChild(script);
        } else {
          normalizeStartButtons(); // ✅ Rename buttons on home screen too, if needed
        }

        // -----------------------------
        // Ensure style.css is loaded
        // -----------------------------
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
      })
      .catch(() => {
        const container = document.getElementById("gameContainer");
        container.innerHTML = `
          <h2 class="error">404 - File Not Found</h2>
          <p>The requested game could not be loaded.</p>`;
      });
  }

  // -----------------------------
  // Admin Dashboard Initializer
  // -----------------------------
  function initializeAdmin() {
    if (typeof renderShopEditor === 'function') renderShopEditor();
    if (typeof renderUserManager === 'function') renderUserManager();
    if (typeof drawCharts === 'function') drawCharts();
    if (typeof renderAuditLog === 'function') renderAuditLog();
    if (typeof loadModerationSettings === 'function') loadModerationSettings();
  }

  // -----------------------------
  // On Initial Load
  // -----------------------------
  document.addEventListener("DOMContentLoaded", () => {
    const initialPage = window.location.hash.substring(1) || "home";
    if (initialPage === "admin") {
      initializeAdmin();
    }
    loadGame();
  });

  // -----------------------------
  // On Hash Change (Navigation)
  // -----------------------------
  window.addEventListener("hashchange", () => {
    const page = window.location.hash.substring(1);
    if (page === "admin") {
      initializeAdmin();
    } else {
      loadGame();
    }
  });
})();
