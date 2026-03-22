let player;
let apple;
let badItems;
let obstacles;
let walls;

let snakeUp, snakeDown, snakeLeft, snakeRight;
let appleImg, burgerImg;

let gameState = "menu";
let direction = "right";

let score = 0;
let health = 100;
let level = 1;

let playerSpeed = 3;
let damageCooldown = 0;

function preload() {
  snakeUp = loadImage("images/snake-head-up.png");
  snakeDown = loadImage("images/snake-head-down.png");
  snakeLeft = loadImage("images/snake-head-left.png");
  snakeRight = loadImage("images/snake-head-right.png");

  appleImg = loadImage("images/apple.png");
  burgerImg = loadImage("images/fast-food-png-41613.png");
}

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  imageMode(CENTER);
}

function draw() {
  if (gameState === "menu") {
    drawMenu();
  } else if (gameState === "level1" || gameState === "level2") {
    runGame();
  } else if (gameState === "win") {
    drawWinScreen();
  } else if (gameState === "lose") {
    drawLoseScreen();
  }
}

function drawMenu() {
  background(18, 24, 20);

  fill(255);
  textSize(44);
  text("VentureSnake", width / 2, height / 2 - 95);

  textSize(22);
  text("Made by Django Behunin", width / 2, height / 2 - 45);

  fill(170, 245, 180);
  rectMode(CENTER);
  rect(width / 2, height / 2 + 30, 190, 58, 12);

  fill(20);
  textSize(26);
  text("= START =", width / 2, height / 2 + 30);

  fill(230);
  textSize(16);
  text("Use WASD or Arrow Keys", width / 2, height / 2 + 95);
  text("Collect apples, avoid burgers, reach 10 score to win", width / 2, height / 2 + 123);
}

function mousePressed() {
  if (gameState === "menu") {
    startGame();
  }
}

function keyPressed() {
  if (gameState === "menu" && key === " ") {
    startGame();
  }

  if ((gameState === "win" || gameState === "lose") && (key === "r" || key === "R")) {
    startGame();
  }
}

function startGame() {
  score = 0;
  health = 100;
  level = 1;
  setupLevel1();
}

function setupLevel1() {
  clearAllSprites();

  playerSpeed = 3;
  direction = "right";
  damageCooldown = 0;

  createPlayer(120, 120);
  createWalls();
  createObstaclesLevel1();
  createApple();
  createBadItems(2);

  level = 1;
  gameState = "level1";
}

function setupLevel2() {
  clearAllSprites();

  playerSpeed = 4;
  direction = "right";
  damageCooldown = 0;

  createPlayer(120, 120);
  createWalls();
  createObstaclesLevel2();
  createApple();
  createBadItems(4);

  level = 2;
  gameState = "level2";
}

function clearAllSprites() {
  if (player) player.remove();
  if (apple) apple.remove();

  if (badItems) {
    for (let i = badItems.length - 1; i >= 0; i--) {
      badItems[i].remove();
    }
  }

  if (obstacles) {
    for (let i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].remove();
    }
  }

  if (walls) {
    for (let i = walls.length - 1; i >= 0; i--) {
      walls[i].remove();
    }
  }
}

function createPlayer(x, y) {
  player = createSprite(x, y, 40, 40);
  player.addImage("up", snakeUp);
  player.addImage("down", snakeDown);
  player.addImage("left", snakeLeft);
  player.addImage("right", snakeRight);
  player.changeImage("right");
  player.scale = 1.15;
}

function createApple() {
  apple = createSprite(random(100, 700), random(120, 530), 24, 24);
  apple.addImage(appleImg);
  apple.scale = 0.6;
}

function createBadItems(amount) {
  badItems = new Group();

  for (let i = 0; i < amount; i++) {
    let bad = createSprite(random(120, 680), random(130, 500), 40, 40);
    bad.addImage(burgerImg);
    bad.scale = 0.2;
    bad.velocity.x = random([-2, 2]);
    bad.velocity.y = random([-2, 2]);
    badItems.add(bad);
  }
}

function createWalls() {
  walls = new Group();

  let topWall = createSprite(width / 2, 55, width, 20);
  let bottomWall = createSprite(width / 2, height - 10, width, 20);
  let leftWall = createSprite(10, height / 2, 20, height);
  let rightWall = createSprite(width - 10, height / 2, 20, height);

  topWall.immovable = true;
  bottomWall.immovable = true;
  leftWall.immovable = true;
  rightWall.immovable = true;

  topWall.visible = false;
  bottomWall.visible = false;
  leftWall.visible = false;
  rightWall.visible = false;

  walls.add(topWall);
  walls.add(bottomWall);
  walls.add(leftWall);
  walls.add(rightWall);
}

function createObstacle(x, y, w, h) {
  let obs = createSprite(x, y, w, h);
  obs.shapeColor = color(105, 72, 34);
  obs.immovable = true;
  obstacles.add(obs);
}

function createObstaclesLevel1() {
  obstacles = new Group();

  createObstacle(300, 165, 120, 40);
  createObstacle(520, 300, 40, 150);
  createObstacle(260, 460, 160, 40);
}

function createObstaclesLevel2() {
  obstacles = new Group();

  createObstacle(250, 150, 150, 35);
  createObstacle(420, 220, 35, 150);
  createObstacle(620, 340, 150, 35);
  createObstacle(250, 500, 180, 35);
  createObstacle(560, 470, 35, 130);
}

function runGame() {
  background(level === 1 ? color(28, 34, 30) : color(24, 28, 38));

  if (damageCooldown > 0) {
    damageCooldown--;
  }

  handleMovement();

  player.collide(obstacles);
  player.collide(walls);

  for (let i = 0; i < badItems.length; i++) {
    badItems[i].bounceOff(obstacles);
    badItems[i].bounceOff(walls);
  }

  player.overlap(apple, collectApple);
  player.overlap(badItems, takeDamage);

  drawSprites();
  drawUI();

  if (gameState === "level1" && score >= 5) {
    setupLevel2();
  }

  if (score >= 10) {
    gameState = "win";
    stopGame();
  }

  if (health <= 0) {
    health = 0;
    gameState = "lose";
    stopGame();
  }
}

function handleMovement() {
  if (keyDown("UP_ARROW") || keyDown("W")) {
    direction = "up";
  } else if (keyDown("DOWN_ARROW") || keyDown("S")) {
    direction = "down";
  } else if (keyDown("LEFT_ARROW") || keyDown("A")) {
    direction = "left";
  } else if (keyDown("RIGHT_ARROW") || keyDown("D")) {
    direction = "right";
  }

  if (direction === "up") {
    player.velocity.x = 0;
    player.velocity.y = -playerSpeed;
    player.changeImage("up");
  } else if (direction === "down") {
    player.velocity.x = 0;
    player.velocity.y = playerSpeed;
    player.changeImage("down");
  } else if (direction === "left") {
    player.velocity.x = -playerSpeed;
    player.velocity.y = 0;
    player.changeImage("left");
  } else if (direction === "right") {
    player.velocity.x = playerSpeed;
    player.velocity.y = 0;
    player.changeImage("right");
  }
}

function collectApple(playerSprite, appleSprite) {
  score++;
  repositionApple();
}

function repositionApple() {
  let placed = false;

  while (!placed) {
    let newX = random(60, width - 60);
    let newY = random(85, height - 60);

    apple.position.x = newX;
    apple.position.y = newY;

    let touchingObstacle = false;
    for (let i = 0; i < obstacles.length; i++) {
      if (apple.overlap(obstacles[i])) {
        touchingObstacle = true;
        break;
      }
    }

    if (!touchingObstacle) {
      placed = true;
    }
  }
}

function takeDamage(playerSprite, badSprite) {
  if (damageCooldown <= 0) {
    health -= 10;
    damageCooldown = 25;
  }
}

function stopGame() {
  player.velocity.x = 0;
  player.velocity.y = 0;

  for (let i = 0; i < badItems.length; i++) {
    badItems[i].velocity.x = 0;
    badItems[i].velocity.y = 0;
  }
}

function drawUI() {
  push();
  rectMode(CORNER);
  noStroke();
  fill(12, 16, 18, 220);
  rect(10, 10, width - 20, 42, 12);

  fill(255);
  textAlign(LEFT, CENTER);
  textSize(18);
  text("VentureSnake", 70, 31);

  fill(210);
  textSize(14);
  text("Level " + level, 190, 31);
  text("Score: " + score + " / 10", 270, 31);

  drawSnakeIcon(38, 31, 24);

  drawHealthBar(540, 20, 200, 20);

  fill(230);
  textAlign(RIGHT, CENTER);
  textSize(13);
  text("WASD / Arrows", width - 24, 31);
  pop();
}

function drawSnakeIcon(x, y, size) {
  push();
  noStroke();
  fill(34, 46, 40);
  circle(x, y, size + 16);

  image(getSnakeIconImage(), x, y, size, size);
  pop();
}

function getSnakeIconImage() {
  if (direction === "up") return snakeUp;
  if (direction === "down") return snakeDown;
  if (direction === "left") return snakeLeft;
  return snakeRight;
}

function drawHealthBar(x, y, w, h) {
  let clampedHealth = constrain(health, 0, 100);
  let fillWidth = map(clampedHealth, 0, 100, 0, w);

  fill(255);
  textAlign(LEFT, CENTER);
  textSize(13);
  text("Health", x, y - 8);

  noStroke();
  fill(55);
  rect(x, y, w, h, 8);

  if (clampedHealth > 60) {
    fill(90, 220, 120);
  } else if (clampedHealth > 30) {
    fill(240, 190, 70);
  } else {
    fill(230, 90, 90);
  }

  rect(x, y, fillWidth, h, 8);

  noFill();
  stroke(220);
  strokeWeight(1);
  rect(x, y, w, h, 8);

  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(12);
  text(clampedHealth + "%", x + w / 2, y + h / 2 + 1);
}

function drawWinScreen() {
  background(22, 60, 34);

  fill(255);
  textSize(46);
  text("YOU WIN!", width / 2, height / 2 - 45);

  textSize(24);
  text("Final Score: " + score, width / 2, height / 2 + 5);

  textSize(18);
  text("Press R to Restart", width / 2, height / 2 + 55);
}

function drawLoseScreen() {
  background(62, 24, 24);

  fill(255);
  textSize(46);
  text("GAME OVER", width / 2, height / 2 - 45);

  textSize(24);
  text("Score: " + score, width / 2, height / 2 + 5);

  textSize(18);
  text("Press R to Restart", width / 2, height / 2 + 55);
}