let canvas;

let player;
let apple;
let burger;
let obstacles;

let snakeImg;
let appleImg;
let burgerImg;

let score = 0;
let health = 100;
let level = 1;
let gameState = "menu";
let hitCooldown = 0;

let burgerDX = 3;
let burgerDY = 3;

function preload() {
  snakeImg = loadImage("images/snake-head-right.png");
  appleImg = loadImage("images/apple.png");
  burgerImg = loadImage("images/fast-food-png-41613.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  textFont("Arial");

  if (typeof world !== "undefined") {
    world.gravity.y = 0;
  }
}

function draw() {
  background(30);

  if (gameState === "menu") {
    drawMenu();
    return;
  }

  if (gameState === "play") {
    runGame();
    return;
  }

  if (gameState === "win") {
    drawEndScreen("YOU WIN");
    return;
  }

  if (gameState === "lose") {
    drawEndScreen("GAME OVER");
    return;
  }
}

function drawMenu() {
  fill(255);
  textAlign(CENTER, CENTER);

  textSize(56);
  text("VentureSnake", width / 2, height / 2 - 50);

  textSize(24);
  text("Press SPACE to start", width / 2, height / 2 + 10);
  text("Use WASD or Arrow Keys to move", width / 2, height / 2 + 45);
}

function drawEndScreen(message) {
  drawSprites();

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(56);
  text(message, width / 2, height / 2 - 20);

  textSize(24);
  text("Press R to restart", width / 2, height / 2 + 35);
}

function keyPressed() {
  if (gameState === "menu" && (key === " " || keyCode === 32)) {
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
  hitCooldown = 0;
  setupLevel();
  gameState = "play";
}

function clearSprites() {
  if (player) player.remove();
  if (apple) apple.remove();
  if (burger) burger.remove();

  if (obstacles) {
    while (obstacles.length > 0) {
      obstacles[0].remove();
    }
  }
}

function setupLevel() {
  clearSprites();

  obstacles = new Group();

  player = new Sprite(120, 120, 60, 60);
  player.img = snakeImg;
  player.scale = 0.55;
  player.collider = "kinematic";
  player.rotationLock = true;

  apple = new Sprite(0, 0, 30, 30);
  apple.img = appleImg;
  apple.scale = 0.4;
  apple.collider = "static";

  burger = new Sprite(0, 0, 60, 60);
  burger.img = burgerImg;
  burger.scale = 0.18;
  burger.collider = "kinematic";
  burger.rotationLock = true;

  let obstacleCount = level === 1 ? 3 : 4;

  for (let i = 0; i < obstacleCount; i++) {
    let o = new Sprite(
      random(220, width - 220),
      random(160, height - 160),
      random(120, 200),
      40
    );
    o.color = "gray";
    o.collider = "static";
    obstacles.add(o);
  }

  placeSpriteSafely(apple, 120);
  placeSpriteSafely(burger, 200);

  let speed = level === 1 ? 3 : 5;
  burgerDX = random([-speed, speed]);
  burgerDY = random([-speed, speed]);
}

function runGame() {
  movePlayer();
  moveBurger();

  if (player.overlaps(apple)) {
    score++;
    placeSpriteSafely(apple, 120);
  }

  if (hitCooldown > 0) {
    hitCooldown--;
  }

  if (player.overlaps(burger) && hitCooldown === 0) {
    health -= 5;
    hitCooldown = 12;
  }

  drawSprites();
  drawHUD();

  if (level === 1 && score >= 5) {
    level = 2;
    setupLevel();
    return;
  }

  if (score >= 10) {
    gameState = "win";
  }

  if (health <= 0) {
    gameState = "lose";
  }
}

function movePlayer() {
  let speed = 6;
  let dx = 0;
  let dy = 0;

  if (leftPressed()) dx -= speed;
  if (rightPressed()) dx += speed;
  if (upPressed()) dy -= speed;
  if (downPressed()) dy += speed;

  if (dx !== 0 && dy !== 0) {
    dx *= 0.7071;
    dy *= 0.7071;
  }

  if (dx < 0) player.rotation = 180;
  if (dx > 0) player.rotation = 0;
  if (dy < 0) player.rotation = -90;
  if (dy > 0) player.rotation = 90;

  let newX = player.x + dx;
  let newY = player.y + dy;

  if (!hitsObstacle(newX, player.y, 26, 26)) {
    player.x = newX;
  }

  if (!hitsObstacle(player.x, newY, 26, 26)) {
    player.y = newY;
  }

  player.x = constrain(player.x, 30, width - 30);
  player.y = constrain(player.y, 30, height - 30);
}

function moveBurger() {
  burger.x += burgerDX;
  burger.y += burgerDY;

  let pad = 35;

  if (burger.x < pad) {
    burger.x = pad;
    burgerDX *= -1;
  }

  if (burger.x > width - pad) {
    burger.x = width - pad;
    burgerDX *= -1;
  }

  if (burger.y < pad) {
    burger.y = pad;
    burgerDY *= -1;
  }

  if (burger.y > height - pad) {
    burger.y = height - pad;
    burgerDY *= -1;
  }

  if (hitsObstacle(burger.x, burger.y, 25, 25)) {
    burgerDX *= -1;
    burgerDY *= -1;
    burger.x += burgerDX * 2;
    burger.y += burgerDY * 2;
  }
}

function hitsObstacle(testX, testY, halfW, halfH) {
  if (!obstacles) return false;

  for (let i = 0; i < obstacles.length; i++) {
    let o = obstacles[i];
    let oHalfW = o.w / 2;
    let oHalfH = o.h / 2;

    if (
      abs(testX - o.x) < halfW + oHalfW &&
      abs(testY - o.y) < halfH + oHalfH
    ) {
      return true;
    }
  }

  return false;
}

function placeSpriteSafely(sprite, margin) {
  let placed = false;
  let tries = 0;

  while (!placed && tries < 200) {
    tries++;

    let testX = random(margin, width - margin);
    let testY = random(margin, height - margin);

    let tooCloseToPlayer = dist(testX, testY, player.x, player.y) < 160;
    let insideObstacle = hitsObstacle(testX, testY, 35, 35);

    if (!tooCloseToPlayer && !insideObstacle) {
      sprite.x = testX;
      sprite.y = testY;
      placed = true;
    }
  }

  if (!placed) {
    sprite.x = width / 2;
    sprite.y = height / 2;
  }
}

function drawHUD() {
  fill(255);
  textAlign(LEFT, TOP);
  textSize(28);

  text("Score: " + score, 20, 20);
  text("Health: " + health, 20, 55);
  text("Level: " + level, 20, 90);
}

function leftPressed() {
  return kb.pressing("left") || kb.pressing("a");
}

function rightPressed() {
  return kb.pressing("right") || kb.pressing("d");
}

function upPressed() {
  return kb.pressing("up") || kb.pressing("w");
}

function downPressed() {
  return kb.pressing("down") || kb.pressing("s");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  if (player) {
    player.x = constrain(player.x, 30, width - 30);
    player.y = constrain(player.y, 30, height - 30);
  }

  if (apple) {
    apple.x = constrain(apple.x, 30, width - 30);
    apple.y = constrain(apple.y, 30, height - 30);
  }

  if (burger) {
    burger.x = constrain(burger.x, 35, width - 35);
    burger.y = constrain(burger.y, 35, height - 35);
  }
}