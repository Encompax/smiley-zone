
const tttBoard = document.getElementById("tttBoard");
const tttStatus = document.getElementById("tttStatus");
let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;

function drawTicTacToe() {
  tttBoard.innerHTML = "";
  board.forEach((val, i) => {
    const cell = document.createElement("div");
    cell.textContent = val;
    cell.style.width = "100px";
    cell.style.height = "100px";
    cell.style.display = "flex";
    cell.style.alignItems = "center";
    cell.style.justifyContent = "center";
    cell.style.fontSize = "36px";
    cell.style.border = "2px solid #000";
    cell.style.cursor = val === "" && gameActive ? "pointer" : "default";
    cell.addEventListener("click", () => handleMove(i));
    tttBoard.appendChild(cell);
  });
}

function handleMove(index) {
  if (!gameActive || board[index] !== "") return;
  board[index] = currentPlayer;
  drawTicTacToe();
  if (checkWinner()) {
    tttStatus.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
  } else if (!board.includes("")) {
    tttStatus.textContent = "It's a draw!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    tttStatus.textContent = `Current Player: ${currentPlayer}`;
  }
}

function checkWinner() {
  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return wins.some(combo =>
    board[combo[0]] === currentPlayer &&
    board[combo[1]] === currentPlayer &&
    board[combo[2]] === currentPlayer
  );
}

function resetTicTacToe() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  tttStatus.textContent = `Current Player: ${currentPlayer}`;
  drawTicTacToe();
}

drawTicTacToe();
