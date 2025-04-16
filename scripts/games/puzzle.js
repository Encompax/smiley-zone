
// puzzle.js

window.puzzleBoard = [];
window.puzzleCurrentLevel = 3;

// GLOBAL: Start a new game
window.startNewGame = function (size) {
    puzzleBoard = window.generateBoard(size);
    window.renderBoard(puzzleBoard, size);
    window.renderLeaderboard();
};

// GLOBAL: Generate a randomized puzzle board
window.generateBoard = function (size) {
    let numbers = Array.from({ length: size * size - 1 }, (_, i) => i + 1);
    numbers.push(null); // Empty space

    // Simple shuffle
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    return numbers;
};

// GLOBAL: Render the puzzle board in the game container
window.renderBoard = function (puzzleBoard, size) {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;

    gameArea.innerHTML = '';
    gameArea.style.display = 'grid';
    gameArea.style.gridTemplateColumns = `repeat(${size}, 50px)`;
    gameArea.style.gap = '5px';

    puzzleBoard.forEach((num, idx) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.textContent = num || '';
        tile.style.border = '1px solid #ccc';
        tile.style.background = num ? '#fff' : '#f0f0f0';
        tile.style.display = 'flex';
        tile.style.justifyContent = 'center';
        tile.style.alignItems = 'center';
        tile.style.height = '50px';
        tile.style.fontSize = '18px';
        tile.style.cursor = 'pointer';

        tile.addEventListener('click', () => window.moveTile(idx));
        gameArea.appendChild(tile);
    });
};

// GLOBAL: Move a tile if it’s adjacent to the empty space
window.moveTile = function (index) {
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
        window.renderBoard(puzzleBoard, size);

        if (window.isPuzzleComplete(puzzleBoard)) {
            let playerName = prompt("🎉 Congratulations! Enter your name:");
            window.updateLeaderboard(playerName, puzzleCurrentLevel - 2);
            puzzleCurrentLevel++;
            window.startNewGame(puzzleCurrentLevel);
        }
    }
};

// GLOBAL: Check if the puzzle is solved
window.isPuzzleComplete = function (puzzleBoard) {
    const solution = Array.from({ length: puzzleBoard.length - 1 }, (_, i) => i + 1).concat(null);
    return puzzleBoard.every((val, idx) => val === solution[idx]);
};

// Leaderboard array loaded from localStorage
window.leaderboard = JSON.parse(localStorage.getItem('slidingPuzzleLeaderboard')) || [];

// GLOBAL: Update leaderboard in localStorage
window.updateLeaderboard = function (playerName, levelReached) {
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
};

// GLOBAL: Render leaderboard to DOM
window.renderLeaderboard = function () {
    const leaderboardElement = document.getElementById('leaderboard');
    if (!leaderboardElement) return;

    leaderboardElement.innerHTML = '<h2>Leaderboard - Highest Levels</h2>';

    leaderboard.forEach((player, index) => {
        leaderboardElement.innerHTML += `<p>${index + 1}. ${player.name} - Level ${player.level}</p>`;
    });
};

// GLOBAL: Initialize the puzzle game after script load (SPA-safe call-in point)
window.initPuzzle = function () {
    window.startNewGame(window.puzzleCurrentLevel);
};
