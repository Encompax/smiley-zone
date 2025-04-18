// 16. rpg.js
window.initRpg = function () {
  let alienHP = 100;
  let agentHP = 100;

  const alienHPSpan = document.getElementById("alienHP");
  const agentHPSpan = document.getElementById("agentHP");
  const battleLog = document.getElementById("battleLog");

  function attack() {
    const damage = Math.floor(Math.random() * 20) + 5;
    agentHP -= damage;
    agentHP = Math.max(agentHP, 0);
    logAction(`Zarnok used Plasma Pulse and dealt ${damage} damage!`);
    updateDisplay();
    checkWin();
  }

  function heal() {
    const heal = Math.floor(Math.random() * 15) + 5;
    alienHP += heal;
    alienHP = Math.min(alienHP, 100);
    logAction(`Zarnok performed Quantum Recalibration and healed ${heal} HP.`);
    updateDisplay();
  }

  function updateDisplay() {
    alienHPSpan.textContent = alienHP;
    agentHPSpan.textContent = agentHP;
  }

  function checkWin() {
    if (agentHP <= 0) {
      logAction("🎉 Zarnok defeated Agent Ross!");
    }
  }

  function logAction(text) {
    battleLog.textContent = text;
  }

  document.getElementById("attackBtn").onclick = attack;
  document.getElementById("healBtn").onclick = heal;
  updateDisplay();
};
