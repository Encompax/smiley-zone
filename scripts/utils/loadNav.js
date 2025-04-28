document.addEventListener("DOMContentLoaded", () => {
    const navContainer = document.getElementById("mainNav");
    if (navContainer) {
      navContainer.innerHTML = `
        <nav class="main-nav">
          <a href="#home">🏠 Home</a>
          <a href="#user">👤 Profile</a>
          <a href="#games">🎮 Games</a>
          <a href="#store">🛒 Store</a>
          <a href="#tokens">💰 Tokens</a>
        </nav>
      `;
    }
  });
  