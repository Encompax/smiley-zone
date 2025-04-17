// 6. tictactoe.js
window.initGame = function () {
  const board = Array(9).fill(null);
  let currentPlayer = "X";
  const cells = document.querySelectorAll(".cell");
  const status = document.getElementById("status");

  function checkWinner() {
    const combos = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
    for (let combo of combos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
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

  cells.forEach((cell, i) => {
    cell.textContent = "";
    cell.onclick = (e) => handleClick(e, i);
  });

  status.textContent = `${currentPlayer}'s turn`;
};