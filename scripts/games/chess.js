window.initChess = function () {
  const boardElement = document.getElementById("chessBoard");
  const statusEl = document.getElementById("chessStatus");

  if (!boardElement || !statusEl) {
    console.warn("⚠️ Chess board or status element not found.");
    return;
  }

  const game = new Chess();

  const board = Chessboard("chessBoard", {
    draggable: true,
    position: "start",

    onDragStart: (source, piece) => {
      if (
        game.game_over() ||
        (game.turn() === "w" && piece.search(/^b/) !== -1) ||
        (game.turn() === "b" && piece.search(/^w/) !== -1)
      ) {
        return false;
      }
    },

    onDrop: (source, target) => {
      const move = game.move({ from: source, to: target, promotion: "q" });
      if (move === null) return "snapback";
      updateStatus();
    },

    onSnapEnd: () => board.position(game.fen())
  });

  function updateStatus() {
    let status = "";
    const moveColor = game.turn() === "w" ? "White" : "Black";

    if (game.in_checkmate()) {
      status = `Game over, ${moveColor} is in checkmate.`;
    } else if (game.in_draw()) {
      status = "Game over, drawn position.";
    } else {
      status = `${moveColor} to move`;
      if (game.in_check()) status += ", in check.";
    }

    statusEl.textContent = status;
  }

  updateStatus();
  console.log("✅ Chess game initialized successfully.");
};
