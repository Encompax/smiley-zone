
// puzzle.js

let currentLevel = 3; // Start with 3x3 puzzle
let board = [];

// Initialize the game
function startNewGame(size) {
    board = generateBoard(size);
    renderBoard(board, size);
    renderLeaderboard();
}

function generateBoard(size) {
    let numbers = Array.from({ length: size * size - 1 }, (_, i) => i + 1);
    numbers.push(null); // Empty space

    // Simple shuffle (can enhance later)
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    return numbers;
}

function renderBoard(board, size) {
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = '';

    gameArea.style.gridTemplateColumns = `repeat(${size}, 50px)`;

    board.forEach((num, idx) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.textContent = num || '';
        tile.addEventListener('click', () => moveTile(idx));
        gameArea.appendChild(tile);
    });
}

function moveTile(index) {
    const size = Math.sqrt(board.length);
    const emptyIndex = board.indexOf(null);

    const validMoves = [
        emptyIndex - size, // up
        emptyIndex + size, // down
        emptyIndex - 1,    // left
        emptyIndex + 1     // right
    ];

    if (validMoves.includes(index)) {
        [board[index], board[emptyIndex]] = [board[emptyIndex], board[index]];
        renderBoard(board, size);

        if (isPuzzleComplete(board)) {
            let playerName = prompt("Congratulations! Enter your name:");
            updateLeaderboard(playerName, currentLevel - 2);
            currentLevel++;
            startNewGame(currentLevel);
        }
    }
}

function isPuzzleComplete(board) {
    const solution = Array.from({ length: board.length - 1 }, (_, i) => i + 1).concat(null);
    return board.every((val, idx) => val === solution[idx]);
}

// Leaderboard functions (localStorage per game page)
let leaderboard = JSON.parse(localStorage.getItem('slidingPuzzleLeaderboard')) || [];

function updateLeaderboard(playerName, levelReached) {
    const existingPlayer = leaderboard.find(player => player.name === playerName);

    if (existingPlayer) {
        if (levelReached > existingPlayer.level) {
            existingPlayer.level = levelReached;
        }
    } else {
        leaderboard.push({ name: playerName, level: levelReached });
    }

    leaderboard.sort((a, b) => b.level - a.level);

    localStorage.setItem('slidingPuzzleLeaderboard', JSON.stringify(leaderboard));
}

function renderLeaderboard() {
    const board = document.getElementById('leaderboard');
    board.innerHTML = '<h2>Leaderboard - Highest Levels</h2>';

    leaderboard.forEach((player, index) => {
        board.innerHTML += `<p>${index + 1}. ${player.name} - Level ${player.level}</p>`;
    });
}

// Initialize game on page load
window.onload = () => {
    startNewGame(currentLevel);
};