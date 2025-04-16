// router.js

window.addEventListener("hashchange", loadGame);
window.addEventListener("DOMContentLoaded", loadGame);

function loadGame() {
    const page = window.location.hash.substring(1) || "home";

    // Load the HTML content dynamically from root directory
    fetch(`games/${page}.html`)
        .then(response => response.text())
        .then(html => {
            document.getElementById("gameContainer").innerHTML = html;

            // Remove any old dynamic script
            const oldScript = document.getElementById("dynamicScript");
            if (oldScript) {
                oldScript.remove();
            }

            // Load game-specific JavaScript if not home
            if (page !== "home") {
                const script = document.createElement("script");
                script.src = `scripts/games/${page}.js`;
                script.id = "dynamicScript";
                script.defer = true;
                document.body.appendChild(script);
            }

            //load specific css if not home
            if (page !== "home") {
                const cssLink = document.createElement("link");
                cssLink.rel = "stylesheet";
                cssLink.href = "style.css";
                document.head.appendChild(cssLink);
              }
              
        })
        .catch(() => {
            document.getElementById("gameContainer").innerHTML = "<h2 class='error'>404</h2><p>File not found</p>";
        });
}
