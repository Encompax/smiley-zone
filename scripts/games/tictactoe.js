// 6. tictactoe.js
window.initTictactoe = function () {
  const board = Array(9).fill(null);
  let currentPlayer = "X";

  const boardContainer = document.getElementById("tttBoard");
  const status = document.getElementById("tttStatus");

  if (!boardContainer || !status) {
    console.error("Missing required DOM elements for Tic-Tac-Toe.");
    return;
  }

  // Clear and rebuild the game board
  boardContainer.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.style.border = "1px solid #000";
    cell.style.display = "flex";
    cell.style.justifyContent = "center";
    cell.style.alignItems = "center";
    cell.style.height = "100px";
    cell.style.fontSize = "32px";
    cell.style.cursor = "pointer";

    cell.addEventListener("click", (e) => handleClick(e, i));
    boardContainer.appendChild(cell);
  }

  const cells = document.querySelectorAll(".cell");

  function checkWinner() {
    const combos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let combo of combos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.every(cell => cell) ? "Draw" : null;
  }

  function handleClick(e, index) {
    if (board[index] || checkWinner()) return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    const winner = checkWinner();
    if (winner) {
      status.textContent = winner === "Draw" ? "It's a Draw!" : `${winner} wins!`;
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      status.textContent = `${currentPlayer}'s turn`;
    }
  }

  status.textContent = `${currentPlayer}'s turn`;
};

// Optional external reset hook for the button
function resetTicTacToe() {
  window.initTictactoe();
}
