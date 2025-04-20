const games = [
    "2048", "admin", "breakout", "chess", "fact", "jumper", "maze", "memory",
    "minesweeper", "puzzle", "rpg", "rps", "shop", "simon", "snake", "tetris",
    "ticTacToe", "user", "whack"
  ];
  
  const tableBody = document.getElementById("diagnosticTable");
  
  function checkStatus(path) {
    return fetch(path, { method: "HEAD" })
      .then(res => res.ok)
      .catch(() => false);
  }
  
  (async function runDiagnostics() {
    for (const game of games) {
      const htmlPath = `games/${game}.html`;
      const jsPath = `scripts/games/${game}.js`;
  
      const [htmlOk, jsOk] = await Promise.all([
        checkStatus(htmlPath),
        checkStatus(jsPath)
      ]);
  
      let initOk = false;
  
      if (jsOk) {
        try {
          const script = document.createElement("script");
          script.src = jsPath;
          script.defer = true;
          document.body.appendChild(script);
  
          await new Promise(resolve => (script.onload = resolve));
  
          const initName = `init${game.charAt(0).toUpperCase()}${game.slice(1)}`;
          initOk = typeof window[initName] === "function";
        } catch {
          initOk = false;
        }
      }
  
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${game}</td>
        <td class="${htmlOk ? "ok" : "fail"}">${htmlOk ? "Yes" : "No"}</td>
        <td class="${jsOk ? "ok" : "fail"}">${jsOk ? "Yes" : "No"}</td>
        <td class="${initOk ? "ok" : "fail"}">${initOk ? "Yes" : "No"}</td>
      `;
      tableBody.appendChild(row);
    }
  })();
  