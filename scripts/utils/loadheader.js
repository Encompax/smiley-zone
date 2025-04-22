window.addEventListener("DOMContentLoaded", () => {
    const header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML = `
      <a href="#home">
        <img src="../../images/sza-logo.png" alt="Smiley Zone Arcade Logo" class="site-logo" style="width: 150px; height: auto;" />
      </a>`;
    document.body.insertBefore(header, document.body.firstChild);
  });
  