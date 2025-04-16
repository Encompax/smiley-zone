window.addEventListener("hashchange", loadGame);
window.addEventListener("DOMContentLoaded", loadGame);

function loadGame() {
  const page = window.location.hash.substring(1) || "home";
  const htmlPath = page === "home" ? `${page}.html` : `games/${page}.html`;

  fetch(htmlPath)
    .then(response => response.text())
    .then(html => {
      document.getElementById("gameContainer").innerHTML = html;

      // Clean up old script
      const oldScript = document.getElementById("dynamicScript");
      if (oldScript) oldScript.remove();

      // Inject game script
      if (page !== "home") {
        const script = document.createElement("script");
        script.src = `scripts/games/${page}.js`;
        script.id = "dynamicScript";
        script.defer = true;
        document.body.appendChild(script);

        // Chess-only: Load external libraries
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
      }

      // Re-inject style
      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.href = "style.css";
      document.head.appendChild(cssLink);
    })
    .catch(() => {
      document.getElementById("gameContainer").innerHTML =
        "<h2 class='error'>!!!404!!!</h2><p>----File not found!!!!!!!!!!!</p>";
    });
}


