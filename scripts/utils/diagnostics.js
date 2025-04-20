const games = [
    "2048", "admin", "breakout", "chess", "fact", "jumper", "maze", "memory",
    "minesweeper", "puzzle", "rpg", "rps", "shop", "simon", "snake", "tetris",
    "ticTacToe", "user", "whack"
  ];
  
  const tableBody = document.getElementById("diagnosticTable");
  const tokenDisplay = document.getElementById("tokenBalance");
  
  function checkStatus(path) {
    return fetch(path, { method: 'HEAD' })
      .then(res => res.ok)
      .catch(() => false);
  }
  
  function createResetButton(game) {
    const btn = document.createElement("button");
    btn.textContent = "Reset";
    btn.className = "action-button";
    btn.style.marginLeft = "5px";
    btn.onclick = () => {
      const fn = window[`reset${game.charAt(0).toUpperCase() + game.slice(1)}`];
      if (typeof fn === "function") {
        fn();
        alert(`${game} reset executed.`);
      } else {
        alert(`No reset function defined for ${game}.`);
      }
    };
    return btn.outerHTML;
  }
  
  (async function runDiagnostics() {
    document.body.style.overflow = "auto";
    document.body.style.maxHeight = "100vh";
    document.body.style.maxWidth = "100vw";
    document.body.style.overflowX = "auto";
  
    const container = document.getElementById("diagnosticContainer");
    if (container) {
      container.style.overflow = "auto";
      container.style.maxHeight = "90vh";
      container.style.border = "1px solid #ccc";
    }
  
    for (const game of games) {
      const htmlPath = `games/${game}.html`;
      const jsPath = `scripts/games/${game}.js`;
  
      const [htmlOk, jsOk] = await Promise.all([checkStatus(htmlPath), checkStatus(jsPath)]);
      let initOk = false;
  
      if (jsOk) {
        try {
          const script = document.createElement('script');
          script.src = jsPath;
          script.defer = true;
          document.body.appendChild(script);
  
          await new Promise(resolve => script.onload = resolve);
          const initName = `init${game.charAt(0).toUpperCase() + game.slice(1)}`;
          initOk = typeof window[initName] === 'function';
        } catch {
          initOk = false;
        }
      }
  
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${game}</td>
        <td class="${htmlOk ? 'ok' : 'fail'}">${htmlOk ? 'Yes' : 'No'}</td>
        <td class="${jsOk ? 'ok' : 'fail'}">${jsOk ? 'Yes' : 'No'}</td>
        <td class="${initOk ? 'ok' : 'fail'}">${initOk ? 'Yes' : 'No'}</td>
        <td>${createResetButton(game)}</td>
      `;
      tableBody.appendChild(row);
    }
  
    if (typeof getTokens === "function") {
      const balance = getTokens();
      tokenDisplay.textContent = balance;
    }
  })();
  