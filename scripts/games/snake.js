// 7. snake.js
window.initGame = function () {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scale = 20;
  const rows = canvas.height / scale;
  const columns = canvas.width / scale;
  let snake, food;

  class Snake {
    constructor() {
      this.x = 0;
      this.y = 0;
      this.xSpeed = scale * 1;
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

      if (this.x >= canvas.width) this.x = 0;
      if (this.y >= canvas.height) this.y = 0;
      if (this.x < 0) this.x = canvas.width - scale;
      if (this.y < 0) this.y = canvas.height - scale;
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

  function setup() {
    snake = new Snake();
    food = new Food();
    food.pickLocation();

    window.addEventListener("keydown", e => {
      const direction = e.key.replace("Arrow", "");
      snake.changeDirection(direction);
    });

    const gameLoop = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      food.draw();
      snake.update();
      snake.draw();
      if (snake.eat(food)) food.pickLocation();
    }, 250);
  }

  setup();
};








