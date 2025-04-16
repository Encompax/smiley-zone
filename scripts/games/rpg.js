
(() => {
  let alienHP = 100;
  let agentHP = 100;

  function updateStatus() {
    const alienEl = document.getElementById("alienHP");
    const agentEl = document.getElementById("agentHP");

    if (alienEl) alienEl.textContent = alienHP;
    if (agentEl) agentEl.textContent = agentHP;
  }

  function logBattle(message) {
    const logEl = document.getElementById("battleLog");
    if (logEl) logEl.textContent = message;
  }

  function attackAgent() {
    if (alienHP <= 0 || agentHP <= 0) return;

    const damage = Math.floor(Math.random() * 15) + 10;
    agentHP -= damage;
    logBattle("Zarnok fires a Plasma Pulse! Agent Ross takes " + damage + " damage.");

    if (agentHP <= 0) {
      agentHP = 0;
      updateStatus();
      logBattle("🎉 Victory! Zarnok escapes into the desert night.");
      return;
    }

    setTimeout(agentAttack, 1000);
    updateStatus();
  }

  function healAlien() {
    if (alienHP <= 0 || agentHP <= 0) return;

    const heal = Math.floor(Math.random() * 15) + 5;
    alienHP = Math.min(alienHP + heal, 100);
    logBattle("Zarnok uses Quantum Recalibration to heal " + heal + " HP!");

    setTimeout(agentAttack, 1000);
    updateStatus();
  }

  function agentAttack() {
    const damage = Math.floor(Math.random() * 10) + 8;
    alienHP -= damage;

    if (alienHP <= 0) {
      alienHP = 0;
      logBattle("💉 Agent Ross fires a tranquilizer! Zarnok is captured.");
    } else {
      logBattle("Agent Ross retaliates! Zarnok takes " + damage + " damage.");
    }

    updateStatus();
  }

  // ✅ Exposed for router or inline use
  window.initRPG = function () {
    alienHP = 100;
    agentHP = 100;
    updateStatus();
    logBattle("👽 Zarnok faces off against Agent Ross!");

    const attackBtn = document.getElementById("attackBtn");
    const healBtn = document.getElementById("healBtn");

    if (attackBtn) {
      attackBtn.onclick = attackAgent;
    }

    if (healBtn) {
      healBtn.onclick = healAlien;
    }
  };

  // ✅ Optional direct-load if routed natively
  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("attackBtn") && document.getElementById("healBtn")) {
      window.initRPG();
    }
  });
})();
