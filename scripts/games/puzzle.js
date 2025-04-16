
(() => {
    let puzzleBoard = [];
    let puzzleCurrentLevel = 3;
    const leaderboard = JSON.parse(localStorage.getItem('slidingPuzzleLeaderboard')) || [];
  
    function generateBoard(size) {
      let numbers = Array.from({ length: size * size - 1 }, (_, i) => i + 1);
      numbers.push(null); // Empty space
  
      for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
      }
  
      return numbers;
    }
  
    function renderBoard(board, size) {
      const gameArea = document.getElementById('game-area');
      if (!gameArea) return;
  
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
      const size = Math.sqrt(puzzleBoard.length);
      const emptyIndex = puzzleBoard.indexOf(null);
  
      const validMoves = [
        emptyIndex - size,
        emptyIndex + size,
        emptyIndex - 1,
        emptyIndex + 1
      ];
  
      if (validMoves.includes(index)) {
        [puzzleBoard[index], puzzleBoard[emptyIndex]] = [puzzleBoard[emptyIndex], puzzleBoard[index]];
        renderBoard(puzzleBoard, size);
  
        if (isPuzzleComplete(puzzleBoard)) {
          const playerName = prompt("🎉 Puzzle Complete! Enter your name:");
          updateLeaderboard(playerName, puzzleCurrentLevel - 2);
          puzzleCurrentLevel++;
          startGame(puzzleCurrentLevel);
        }
      }
    }
  
    function isPuzzleComplete(board) {
      const solution = Array.from({ length: board.length - 1 }, (_, i) => i + 1).concat(null);
      return board.every((val, idx) => val === solution[idx]);
    }
  
    function updateLeaderboard(name, level) {
      const existing = leaderboard.find(p => p.name === name);
  
      if (existing) {
        if (level > existing.level) existing.level = level;
      } else {
        leaderboard.push({ name, level });
      }
  
      leaderboard.sort((a, b) => b.level - a.level);
      localStorage.setItem('slidingPuzzleLeaderboard', JSON.stringify(leaderboard));
    }
  
    function renderLeaderboard() {
      const board = document.getElementById('leaderboard');
      if (!board) return;
  
      board.innerHTML = '<h2>Leaderboard - Highest Levels</h2>';
      leaderboard.forEach((p, i) => {
        board.innerHTML += `<p>${i + 1}. ${p.name} - Level ${p.level}</p>`;
      });
    }
  
    // ✅ Globally exposed for inline button use
    window.startGame = function (size = puzzleCurrentLevel) {
      puzzleBoard = generateBoard(size);
      renderBoard(puzzleBoard, size);
      renderLeaderboard();
    };
  
    // ✅ Auto-load when page is ready
    document.addEventListener("DOMContentLoaded", () => {
      startGame(puzzleCurrentLevel);
    });
  })();
  