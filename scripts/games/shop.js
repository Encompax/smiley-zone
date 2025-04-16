
(() => {
  let user = JSON.parse(localStorage.getItem("user") || "{}");
  let unlocks = JSON.parse(localStorage.getItem("unlocks") || "{}");

  function updateShopDisplay() {
    document.getElementById("shopTokenBalance").textContent = user.tokens || 0;
    const items = ["theme", "snake", "avatar"];
    items.forEach(item => {
      const status = unlocks[item] ? "Unlocked!" : "Locked";
      document.getElementById("itemStatus-" + item).textContent = status;
    });
  }

  // Expose only what's needed
  window.purchaseItem = function (item, cost) {
    if ((user.tokens || 0) >= cost) {
      if (unlocks[item]) {
        alert("Item already unlocked.");
      } else {
        user.tokens -= cost;
        unlocks[item] = true;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("unlocks", JSON.stringify(unlocks));
        alert(`Unlocked ${item}!`);
      }
    } else {
      alert("Not enough tokens.");
    }
    updateShopDisplay();
  };

  document.addEventListener("DOMContentLoaded", updateShopDisplay);
})();


