
window.addEventListener("hashchange", routeChangeHandler);
window.addEventListener("DOMContentLoaded", routeChangeHandler);

function routeChangeHandler() {
  const route = window.location.hash.replace('#', '') || 'home';
  const gameContainer = document.getElementById("gameContainer");
  gameContainer.innerHTML = ""; // Clear existing content

  switch (route) {
    case 'snake':
      loadGame('snake');
      break;
    case 'puzzle':
      loadGame('puzzle');
      break;
    case 'fact':
      loadGame('fact');
      break;
    default:
      gameContainer.innerHTML = "<h2>Welcome to Smiley-Zone Arcade!</h2><p>Select a game above to begin.</p>";
  }
}

function loadGame(gameName) {
  fetch(`games/${gameName}.html`)
    .then(response => response.text())
    .then(html => {
      document.getElementById("gameContainer").innerHTML = html;
      const script = document.createElement('script');
      script.src = `scripts/games/${gameName}.js`;
      script.defer = true;
      document.body.appendChild(script);
    });
}
