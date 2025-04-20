window.initChess = function () {
  const boardElement = document.getElementById("chessBoard");
  const statusEl = document.getElementById("chessStatus");

  if (!boardElement || !statusEl || typeof Chess !== "function" || typeof Chessboard !== "function") {
    console.warn("⚠️ Chess dependencies not fully loaded.");
    return;
  }

  injectRetroChessStyles();

  let game, board;
  let aiDepth = 2;

  // ♻️ Create Restart Button
  if (!document.getElementById("restartChessBtn")) {
    const restartBtn = document.createElement("button");
    restartBtn.id = "restartChessBtn";
    restartBtn.textContent = "♻️ Restart Game";
    restartBtn.style.display = "block";
    restartBtn.style.margin = "1rem auto 0.5rem";
    restartBtn.style.padding = "0.5rem 1rem";
    restartBtn.style.fontSize = "16px";
    restartBtn.style.cursor = "pointer";
    restartBtn.onclick = () => restartGame();
    boardElement.parentNode.insertBefore(restartBtn, statusEl);
  }

  // 🧠 Add Difficulty Selector
  if (!document.getElementById("aiDifficulty")) {
    const select = document.createElement("select");
    select.id = "aiDifficulty";
    select.style.display = "block";
    select.style.margin = "0 auto 1rem";
    select.style.fontSize = "16px";
    select.style.padding = "0.3rem 0.6rem";
    select.style.cursor = "pointer";

    ["Easy (1)", "Medium (2)", "Hard (3)"].forEach((label, i) => {
      const option = document.createElement("option");
      option.value = (i + 1).toString();
      option.textContent = label;
      if (i === 1) option.selected = true;
      select.appendChild(option);
    });

    select.onchange = () => {
      aiDepth = parseInt(select.value);
      console.log(`🎯 AI difficulty set to depth ${aiDepth}`);
    };

    boardElement.parentNode.insertBefore(select, statusEl);
  }

  function startGame() {
    game = new Chess();

    board = Chessboard("chessBoard", {
      draggable: true,
      position: "start",

      onDragStart: (source, piece) => {
        if (
          game.game_over() ||
          piece.startsWith("b") ||
          game.turn() !== "w"
        ) {
          return false;
        }
      },

      onDrop: (source, target) => {
        const move = game.move({ from: source, to: target, promotion: "q" });
        if (move === null) return "snapback";

        updateStatus();
        setTimeout(makeAIMove, 400);
      },

      onSnapEnd: () => board.position(game.fen())
    });

    updateStatus();
  }

  function makeAIMove() {
    if (game.game_over() || game.turn() !== "b") return;

    const bestMove = getBestMove(game, aiDepth);
    if (bestMove) {
      game.move(bestMove);
      board.position(game.fen());
      updateStatus();
    }
  }

  function getBestMove(game, depth) {
    let bestScore = -Infinity;
    let bestMove = null;
    const moves = game.moves();

    for (let move of moves) {
      game.move(move);
      const score = minimax(game, depth - 1, -Infinity, Infinity, false);
      game.undo();
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    return bestMove;
  }

  function minimax(game, depth, alpha, beta, isMaximizing) {
    if (depth === 0 || game.game_over()) return evaluateBoard(game);

    const moves = game.moves();

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let move of moves) {
        game.move(move);
        const evalScore = minimax(game, depth - 1, alpha, beta, false);
        game.undo();
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let move of moves) {
        game.move(move);
        const evalScore = minimax(game, depth - 1, alpha, beta, true);
        game.undo();
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  function evaluateBoard(game) {
    const board = game.board();
    let score = 0;
    const pieceValue = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 1000 };

    for (let row of board) {
      for (let piece of row) {
        if (piece) {
          const val = pieceValue[piece.type] || 0;
          score += piece.color === "b" ? val : -val;
        }
      }
    }
    return score;
  }

  function updateStatus() {
    let status = "";
    const moveColor = game.turn() === "w" ? "White" : "Black";

    if (game.in_checkmate()) {
      status = `Game over, ${moveColor} is in checkmate.`;
    } else if (game.in_draw()) {
      status = "Game over, drawn position.";
    } else {
      status = `${moveColor} to move.`;
      if (game.in_check()) status += ` ${moveColor} is in check.`;
    }

    statusEl.textContent = status;
  }

  function restartGame() {
    startGame();
    console.log("♻️ Game restarted.");
  }

  function injectRetroChessStyles() {
    if (document.getElementById("chessThemeStyles")) return;

    const style = document.createElement("style");
    style.id = "chessThemeStyles";
    style.textContent = `
      #chessBoard .white-1e1d7 { background: #1abc9c !important; }
      #chessBoard .black-3c85d { background: #0e4f4f !important; }
      #chessBoard { box-shadow: 0 0 20px #1abc9c; border: 2px solid #1abc9c; }
      body { background-color: #000 !important; color: #0ff !important; }
      #chessStatus { color: #1abc9c; text-align: center; margin-top: 1rem; font-family: monospace; }
      #restartChessBtn, #aiDifficulty {
        background: #0e4f4f;
        color: #0ff;
        border: 1px solid #1abc9c;
        box-shadow: 0 0 5px #1abc9c;
        font-family: monospace;
      }
      #restartChessBtn:hover, #aiDifficulty:hover {
        box-shadow: 0 0 12px #1abc9c;
        transform: scale(1.03);
      }
    `;
    document.head.appendChild(style);
  }

  startGame();
  console.log("✅ Chess game loaded with AI, theme, difficulty selector, and restart.");
};

