
// chess.js

let board = null;
let game = null;
let statusEl = null;

// GLOBAL: Initialize the chess game
window.initChess = function () {
  const boardElement = document.getElementById("chessBoard");
  statusEl = document.getElementById("chessStatus");

  if (!boardElement || !statusEl) return;

  game = new Chess();

  board = Chessboard("chessBoard", {
    draggable: true,
    position: "start",
    onDragStart: window.onDragStart,
    onDrop: window.onDrop,
    onSnapEnd: window.onSnapEnd,
  });

  window.updateChessStatus();
};

// GLOBAL: Block illegal moves
window.onDragStart = function (source, piece, position, orientation) {
  if (
    game.game_over() ||
    (game.turn() === "w" && piece.search(/^b/) !== -1) ||
    (game.turn() === "b" && piece.search(/^w/) !== -1)
  ) {
    return false;
  }
};

// GLOBAL: Handle a move
window.onDrop = function (source, target) {
  const move = game.move({
    from: source,
    to: target,
    promotion: "q",
  });

  if (move === null) return "snapback";

  window.updateChessStatus();
};

// GLOBAL: Re-render board after valid move
window.onSnapEnd = function () {
  board.position(game.fen());
};

// GLOBAL: Update status message
window.updateChessStatus = function () {
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
};

