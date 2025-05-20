(() => {
  const routeOverrides = {
    red: "red.html",
    yellow: "yellow.html",
    blue: "blue.html",
    green: "green.html",
    home: "home.html",
    admin: "admin.html",
    user: "user.html",
    signup: "signup.html",
    login: "login.html"
  };

  const protectedRoutes = ["user", "yellow", "blue", "green"];
  let currentPage = "";

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

  async function enforceAuthGuard(page) {
    if (!protectedRoutes.includes(page)) return true;

    const user = firebase.auth().currentUser;
    if (!user) {
      alert("🔒 Please log in or create an account to access this section.");
      window.location.hash = "#login";
      return false;
    }

    return true;
  }

  function loadUserScript() {
    const script = document.createElement("script");
    script.src = "scripts/tools/userProfile.js";
    script.id = "dynamicScript";
    script.defer = true;
    script.onload = () => {
      if (typeof initUser === "function") initUser();
    };
    document.body.appendChild(script);
  }

  async function loadGame() {
    const page = window.location.hash.substring(1) || "home";

    // ⏭️ Skip reload if already on this page
    if (page === currentPage) {
      console.log(`⏭️ Skipping reload of same page: #${page}`);
      return;
    }

    // 🔐 Check auth requirement
    const accessGranted = await enforceAuthGuard(page);
    if (!accessGranted) return;

    currentPage = page;
    const htmlPath = routeOverrides[page] || `games/${page}.html`;

    fetch(htmlPath)
      .then(response => response.text())
      .then(html => {
        const container = document.getElementById("spa-view") || document.getElementById("gameContainer");
        if (!container) {
          console.error("❌ No valid container (#spa-view or #gameContainer) found in DOM.");
          return;
        }

        container.innerHTML = html;

        // 🧹 Remove any previously added dynamic script
        const oldScript = document.getElementById("dynamicScript");
        if (oldScript) oldScript.remove();

        // ♟ Special case: Load chess dependencies
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

        // 🔁 Inject corresponding game script (if not overridden)
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
        } else if (page === "user") {
          // 🧠 Force reload of user script to re-trigger initUser
          loadUserScript();
        } else {
          normalizeStartButtons();
        }

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

