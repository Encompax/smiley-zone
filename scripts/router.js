window.addEventListener("hashchange", loadGame);
window.addEventListener("DOMContentLoaded", loadGame);

function loadGame() {
  const page = window.location.hash.substring(1) || "home";
  const htmlPath = page === "home" ? `${page}.html` : `games/${page}.html`;

  fetch(htmlPath)
    .then(response => response.text())
    .then(html => {
      document.getElementById("gameContainer").innerHTML = html;

      // 🧹 Remove previous script
      const oldScript = document.getElementById("dynamicScript");
      if (oldScript) oldScript.remove();
      
      const script = document.createElement("script");
      script.src = `scripts/games/${page}.js`;
      script.id = "dynamicScript";
      script.defer = true;
      document.body.appendChild(script);
      
      // ♟️ Special handling for Chess – inject dependencies BEFORE main game script
      if (page === "chess") {
        const chessJS = document.createElement("script");
        chessJS.src = "https://cdn.jsdelivr.net/npm/chess.js@0.13.4/chess.min.js";
        chessJS.defer = true;
        chessJS.id = "chess-lib";
        document.body.appendChild(chessJS);

        const chessboardJS = document.createElement("script");
        chessboardJS.src = "https://unpkg.com/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.js";
        chessboardJS.defer = true;
        chessboardJS.id = "chessboard-lib";
        document.body.appendChild(chessboardJS);

        const chessCSS = document.createElement("link");
        chessCSS.rel = "stylesheet";
        chessCSS.href = "https://unpkg.com/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css";
        document.head.appendChild(chessCSS);
      }

      // 🕹️ Inject page-specific game logic AFTER dependencies (including chess)
      if (page !== "home") {
        const script = document.createElement("script");
        script.src = `scripts/games/${page}.js`;
        script.id = "dynamicScript";
        script.defer = true;
        document.body.appendChild(script);
      }

      // 🎨 Re-inject global style
      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.href = "style.css";
      document.head.appendChild(cssLink);
    })
    .catch(() => {
      document.getElementById("gameContainer").innerHTML =
        "<h2 class='error'>404 - File Not Found</h2><p>The requested game could not be loaded.</p>";
    });
}



