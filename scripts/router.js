
window.addEventListener("hashchange", loadGame);
window.addEventListener("DOMContentLoaded", loadGame);

function loadGame() {
  const page = window.location.hash.substring(1) || "index";

  fetch(`games/${page}.html`)
    .then(response => response.text())
    .then(html => {
      document.getElementById("gameContainer").innerHTML = html;

      // Remove any old dynamic scripts
      const oldScript = document.getElementById("dynamicScript");
      if (oldScript) {
        oldScript.remove();
      }

      // Load new game script if not index page
      if (page !== "index") {
        const script = document.createElement("script");
        script.src = `scripts/games/${page}.js`;
        script.id = "dynamicScript";
        script.defer = true;
        document.body.appendChild(script);
      }
    })
    .catch(() => {
      document.getElementById("gameContainer").innerHTML = "<p>Game not found.</p>";
    });
}
