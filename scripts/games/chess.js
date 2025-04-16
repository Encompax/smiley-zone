
(() => {
  let board = null;
  let game = null;
  let statusEl = null;

  function updateChessStatus() {
    let status = "";
    const moveColor = game.turn() === "w" ? "White" : "Black";

    if (game.in_checkmate()) {
      status = "Game over, " + moveColor + " is in checkmate.";
    } else if (game.in_draw()) {
      status = "Game over, drawn position.";
    } else {
      status = moveColor + " to move";
      if (game.in_check()) {
        status += ", " + moveColor + " is in check.";
      }
    }

    statusEl.innerHTML = status;
  }

  function onDragStart(source, piece, position, orientation) {
    if (
      game.game_over() ||
      (game.turn() === "w" && piece.search(/^b/) !== -1) ||
      (game.turn() === "b" && piece.search(/^w/) !== -1)
    ) {
      return false;
    }
  }

  function onDrop(source, target) {
    const move = game.move({
      from: source,
      to: target,
      promotion: "q"
    });

    if (move === null) return "snapback";

    updateChessStatus();
  }

  function onSnapEnd() {
    board.position(game.fen());
  }

  // ✅ Expose only the initializer globally
  window.initChess = function () {
    const boardElement = document.getElementById("chessBoard");
    statusEl = document.getElementById("chessStatus");

    if (!boardElement || !statusEl) return;

    game = new Chess();

    board = Chessboard("chessBoard", {
      draggable: true,
      position: "start",
      onDragStart,
      onDrop,
      onSnapEnd
    });

    updateChessStatus();
  };

  // ✅ Optional auto-invoke if loaded directly
  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("chessBoard")) {
      window.initChess();
    }
  });
})();


