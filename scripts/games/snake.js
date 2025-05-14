
window.initSnake = function () {
  const canvas = document.getElementById("gameCanvas");
  const startBtn = document.getElementById("startBtn");
  const scoreDisplay = document.getElementById("scoreDisplay");

  if (!canvas || !startBtn) {
    console.warn("⚠️ Snake game initialization failed: Missing canvas or start button.");
    return;
  }

  const ctx = canvas.getContext("2d");
  const scale = 20;
  const rows = canvas.height / scale;
  const columns = canvas.width / scale;
  let snake, food, gameLoop, score = 0;

  class Snake {
    constructor() {
      this.x = 0;
      this.y = 0;
      this.xSpeed = scale;
      this.ySpeed = 0;
      this.total = 0;
      this.tail = [];
    }

    draw() {
      ctx.fillStyle = "#4caf50";
      for (let i = 0; i < this.tail.length; i++) {
        ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
      }
      ctx.fillRect(this.x, this.y, scale, scale);
    }

    update() {
      for (let i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
      if (this.total >= 1) {
        this.tail[this.total - 1] = { x: this.x, y: this.y };
      }
      this.x += this.xSpeed;
      this.y += this.ySpeed;
    }

    changeDirection(direction) {
      switch (direction) {
        case "Up":
          if (this.ySpeed === 0) {
            this.xSpeed = 0;
            this.ySpeed = -scale;
          }
          break;
        case "Down":
          if (this.ySpeed === 0) {
            this.xSpeed = 0;
            this.ySpeed = scale;
          }
          break;
        case "Left":
          if (this.xSpeed === 0) {
            this.xSpeed = -scale;
            this.ySpeed = 0;
          }
          break;
        case "Right":
          if (this.xSpeed === 0) {
            this.xSpeed = scale;
            this.ySpeed = 0;
          }
          break;
      }
    }

    eat(food) {
      if (this.x === food.x && this.y === food.y) {
        this.total++;
        return true;
      }
      return false;
    }

    checkCollision() {
      for (let i = 0; i < this.tail.length; i++) {
        if (this.x === this.tail[i].x && this.y === this.tail[i].y) return true;
      }
      return (
        this.x < 0 || this.y < 0 || this.x >= canvas.width || this.y >= canvas.height
      );
    }
  }

  class Food {
    constructor() {
      this.x;
      this.y;
    }

    pickLocation() {
      this.x = Math.floor(Math.random() * columns) * scale;
      this.y = Math.floor(Math.random() * rows) * scale;
    }

    draw() {
      ctx.fillStyle = "#ff1744";
      ctx.fillRect(this.x, this.y, scale, scale);
    }
  }

  function updateScore() {
    if (scoreDisplay) {
      scoreDisplay.textContent = "Score: " + score;
    }
  }
async function saveScoreToFirebase(score) {
  const user = auth.currentUser;
  if (!user) {
    console.warn("User not authenticated. Score not saved.");
    return;
  }

  try {
    await db.collection("scores").add({
      uid: user.uid,
      name: user.displayName || "Anonymous",
      score: score,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      game: "snake" // ✅ Added game tag
    });
    console.log("🏆 Score saved to Firestore:", score);
  } catch (error) {
    console.error("❌ Failed to save score:", error);
  }
}



  function startGame() {
    snake = new Snake();
    food = new Food();
    food.pickLocation();
    score = 0;
    updateScore();

    if (gameLoop) clearInterval(gameLoop);

    gameLoop = setInterval(() => {
      ctx.fillStyle = "#000"; // Black game board
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      food.draw();
      snake.update();
      snake.draw();

      if (snake.eat(food)) {
        food.pickLocation();
        score++;
        updateScore();
      }

      if (snake.checkCollision()) {
        clearInterval(gameLoop);
        saveScoreToFirebase(score).then(() => {
  alert("Game Over");
});

        // Future: saveScoreToFirebase(score);
      }
    }, 200);
  }

  // Event listeners
  startBtn.onclick = startGame;

  window.addEventListener("keydown", e => {
    const direction = e.key.replace("Arrow", "");
    snake?.changeDirection(direction);
  });

  // Disable arrow key scrolling during Snake gameplay
  window.addEventListener("keydown", function (e) {
    const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    if (arrowKeys.includes(e.key) && canvas?.offsetParent !== null) {
      e.preventDefault();
    }
  });

  console.log("✅ Snake game initialized successfully.");
};


