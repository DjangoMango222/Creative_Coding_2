let snake;
let foods = [];
let enemies = [];
let particles = [];

let score = 0;
let playerHealth = 5;

let gameWon = false;
let gameOver = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  snake = {
    x: width / 2,
    y: height / 2,
    size: 35,
    speed: 5,
    attackRange: 75,
    attackCooldown: 0
  };

  for (let i = 0; i < 5; i++) {
    foods.push(new Food());
  }

  for (let i = 0; i < 4; i++) {
    enemies.push(new Enemy());
  }

  textFont("Arial");
}

function draw() {
  background(20);

  if (gameWon) {
    showWinScreen();
    return;
  }

  if (gameOver) {
    showGameOverScreen();
    return;
  }

  handlePlayerMovement();
  updateAttackCooldown();

  drawSnake();

  // good food
  for (let i = 0; i < foods.length; i++) {
    foods[i].show();

    if (dist(snake.x, snake.y, foods[i].x, foods[i].y) < (snake.size / 2 + foods[i].size / 2)) {
      score += 1;
      foods[i].respawn();
    }
  }

  // enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update();
    enemies[i].show();

    if (dist(snake.x, snake.y, enemies[i].x, enemies[i].y) < (snake.size / 2 + enemies[i].size / 2)) {
      if (frameCount % 20 === 0) {
        playerHealth -= 1;
      }
    }

    if (enemies[i].health <= 0) {
      enemies.splice(i, 1);
    }
  }

  // particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();

    if (particles[i].finished()) {
      particles.splice(i, 1);
    }
  }

  // win condition
  if (enemies.length === 0) {
    gameWon = true;
  }

  // lose condition
  if (playerHealth <= 0) {
    gameOver = true;
  }

  drawHUD();
}

function handlePlayerMovement() {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    snake.x -= snake.speed;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    snake.x += snake.speed;
  }
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    snake.y -= snake.speed;
  }
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    snake.y += snake.speed;
  }

  // keep player on screen
  snake.x = constrain(snake.x, snake.size / 2, width - snake.size / 2);
  snake.y = constrain(snake.y, snake.size / 2, height - snake.size / 2);
}

function drawSnake() {
  push();
  noStroke();
  fill(0, 220, 120);
  ellipse(snake.x, snake.y, snake.size);

  // eyes
  fill(255);
  ellipse(snake.x - 6, snake.y - 5, 6);
  ellipse(snake.x + 6, snake.y - 5, 6);

  fill(0);
  ellipse(snake.x - 6, snake.y - 5, 2);
  ellipse(snake.x + 6, snake.y - 5, 2);
  pop();
}

function keyPressed() {
  // space bar attack
  if (key === " " && snake.attackCooldown <= 0 && !gameWon && !gameOver) {
    attackEnemies();
    snake.attackCooldown = 20;
  }
}

function attackEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    let d = dist(snake.x, snake.y, enemies[i].x, enemies[i].y);

    if (d <= snake.attackRange) {
      enemies[i].health -= 1;

      for (let j = 0; j < 12; j++) {
        particles.push(new Particle(enemies[i].x, enemies[i].y));
      }
    }
  }
}

function updateAttackCooldown() {
  if (snake.attackCooldown > 0) {
    snake.attackCooldown--;
  }
}

function drawHUD() {
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Score: " + score, 20, 20);
  text("Health: " + playerHealth, 20, 50);
  text("Enemies Left: " + enemies.length, 20, 80);
  text("Press SPACE to attack", 20, 110);

  // attack range ring for clarity
  noFill();
  stroke(255, 255, 255, 50);
  ellipse(snake.x, snake.y, snake.attackRange * 2);
  noStroke();
}

function showWinScreen() {
  background(10, 80, 20);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(52);
  text("YOU WIN!", width / 2, height / 2 - 30);
  textSize(28);
  text("Final Score: " + score, width / 2, height / 2 + 25);
}

function showGameOverScreen() {
  background(90, 10, 10);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(52);
  text("GAME OVER", width / 2, height / 2 - 30);
  textSize(28);
  text("Final Score: " + score, width / 2, height / 2 + 25);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


class Food {
  constructor() {
    this.size = 24;
    this.respawn();
  }

  respawn() {
    this.x = random(30, width - 30);
    this.y = random(30, height - 30);
  }

  show() {
    push();
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.size);

    fill(0, 180, 0);
    rect(this.x - 2, this.y - 16, 4, 8, 2);
    pop();
  }
}

class Enemy {
  constructor() {
    this.size = 36;
    this.x = random(50, width - 50);
    this.y = random(50, height - 50);
    this.vx = random([-2, -1.5, 1.5, 2]);
    this.vy = random([-2, -1.5, 1.5, 2]);
    this.health = 3;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // bounce off edges
    if (this.x < this.size / 2 || this.x > width - this.size / 2) {
      this.vx *= -1;
    }

    if (this.y < this.size / 2 || this.y > height - this.size / 2) {
      this.vy *= -1;
    }
  }

  show() {
    push();
    fill(180, 120, 40);
    ellipse(this.x, this.y, this.size);

    fill(255, 220, 120);
    ellipse(this.x, this.y - 10, this.size * 0.9, 10);

    fill(120, 70, 20);
    ellipse(this.x, this.y, this.size * 0.9, 12);

    fill(255, 220, 120);
    ellipse(this.x, this.y + 10, this.size * 0.9, 10);

    // health text
    fill(255);
    textSize(14);
    textAlign(CENTER, CENTER);
    text(this.health, this.x, this.y - 32);
    pop();
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-3, 3);
    this.vy = random(-3, 3);
    this.alpha = 255;
    this.size = random(4, 8);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 8;
    this.size *= 0.97;
  }

  show() {
    push();
    noStroke();
    fill(255, 200, 50, this.alpha);
    ellipse(this.x, this.y, this.size);
    pop();
  }

  finished() {
    return this.alpha <= 0;
  }
}