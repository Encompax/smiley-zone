
// puzzle.js

let puzzleBoard = [];
let puzzleCurrentLevel = 3;

// Initialize the game
function startNewGame(size) {
    puzzleBoard = generateBoard(size);
    renderBoard(puzzleBoard, size);
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

function renderBoard(puzzleBoard, size) {
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = '';

    gameArea.style.gridTemplateColumns = `repeat(${size}, 50px)`;

    puzzleBoard.forEach((num, idx) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.textContent = num || '';
        tile.addEventListener('click', () => moveTile(idx));
        gameArea.appendChild(tile);
    });
}

function moveTile(index) {
    const size = Math.sqrt(puzzleBoard.length);
    const emptyIndex = puzzleBoard.indexOf(null);

    const validMoves = [
        emptyIndex - size, // up
        emptyIndex + size, // down
        emptyIndex - 1,    // left
        emptyIndex + 1     // right
    ];

    if (validMoves.includes(index)) {
        [puzzleBoard[index], puzzleBoard[emptyIndex]] = [puzzleBoard[emptyIndex], puzzleBoard[index]];
        renderBoard(puzzleBoard, size);

        if (isPuzzleComplete(puzzleBoard)) {
            let playerName = prompt("Congratulations! Enter your name:");
            updateLeaderboard(playerName, puzzleCurrentLevel - 2);
            puzzleCurrentLevel++;
            startNewGame(puzzleCurrentLevel);
        }
    }
}

function isPuzzleComplete(puzzleBoard) {
    const solution = Array.from({ length: puzzleBoard.length - 1 }, (_, i) => i + 1).concat(null);
    return puzzleBoard.every((val, idx) => val === solution[idx]);
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
    const leaderboardElement = document.getElementById('leaderboard');
    leaderboardElement.innerHTML = '<h2>Leaderboard - Highest Levels</h2>';

    leaderboard.forEach((player, index) => {
        leaderboardElement.innerHTML += `<p>${index + 1}. ${player.name} - Level ${player.level}</p>`;
    });
}

// Initialize game on page load
window.onload = () => {
    startNewGame(puzzleCurrentLevel);
};