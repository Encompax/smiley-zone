// router.js

window.addEventListener("hashchange", loadGame);
window.addEventListener("DOMContentLoaded", loadGame);

function loadGame() {
  const page = window.location.hash.substring(1) || "home";
  const htmlPath = page === "home" ? `${page}.html` : `games/${page}.html`;

  fetch(htmlPath)
    .then(response => response.text())
    .then(html => {
      const container = document.getElementById("gameContainer");
      container.innerHTML = html;

      // Remove any previously injected script
      const oldScript = document.getElementById("dynamicScript");
      if (oldScript) oldScript.remove();

      // Only inject script if it's not the home page
      if (page !== "home") {
        const script = document.createElement("script");
        script.src = `scripts/games/${page}.js`;
        script.id = "dynamicScript";
        script.defer = true;
        document.body.appendChild(script);
      }

      // Prevent duplicate stylesheets (optional)
      const existingStyle = [...document.head.querySelectorAll("link")].find(link =>
        link.href.includes("style.css")
      );
      if (!existingStyle) {
        const cssLink = document.createElement("link");
        cssLink.rel = "stylesheet";
        cssLink.href = "style.css";
        document.head.appendChild(cssLink);
      }
    })
    .catch(() => {
      document.getElementById("gameContainer").innerHTML = `
        <h2 class='error'>!!!404!!!</h2>
        <p>----File not found!!!!!!!!!!!</p>
      `;
    });
}

