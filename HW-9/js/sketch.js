let canvas;

let player;
let apple;
let burger;
let obstacles;
let walls;

let snakeImg;
let appleImg;
let burgerImg;

let score = 0;
let health = 100;
let level = 1;
let gameState = "menu";
let hitCooldown = 0;

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

  textSize(min(width, height) * 0.08);
  text("VentureSnake", width / 2, height / 2 - 60);

  textSize(min(width, height) * 0.035);
  text("Press SPACE to start", width / 2, height / 2 + 10);
  text("Use WASD or Arrow Keys to move", width / 2, height / 2 + 55);
}

function drawEndScreen(message) {
  drawSprites();

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(min(width, height) * 0.08);
  text(message, width / 2, height / 2 - 20);

  textSize(min(width, height) * 0.03);
  text("Press R to restart", width / 2, height / 2 + 40);
}

function keyPressed() {
  if (gameState === "menu" && (key === " " || keyCode === 32)) {
    startGame();
  }

  if (
    (gameState === "win" || gameState === "lose") &&
    (key === "r" || key === "R" || key === " " || keyCode === 32)
  ) {
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
  if (obstacles) obstacles.remove();
  if (walls) walls.remove();
}

function setupLevel() {
  clearSprites();

  walls = new Group();
  obstacles = new Group();

  createWalls();
  createPlayer();
  createObstacles(level === 1 ? 3 : 4);
  createApple();
  createBurger();
}

function createWalls() {
  let t = 40;

  makeWall(width / 2, -t / 2, width, t);            // top
  makeWall(width / 2, height + t / 2, width, t);    // bottom
  makeWall(-t / 2, height / 2, t, height);          // left
  makeWall(width + t / 2, height / 2, t, height);   // right
}

function makeWall(x, y, w, h) {
  let wall = new Sprite(x, y, w, h);
  wall.collider = "static";
  wall.visible = false;
  walls.add(wall);
}

function createPlayer() {
  player = new Sprite(120, height / 2, 60, 60);
  player.img = snakeImg;
  player.scale = 0.6;
  player.collider = "dynamic";
  player.rotationLock = true;
}

function createApple() {
  apple = new Sprite(0, 0, 30, 30);
  apple.img = appleImg;
  apple.scale = 0.4;
  apple.collider = "static";
  moveToSafeSpot(apple, 120);
}

function createBurger() {
  burger = new Sprite(0, 0, 60, 60);
  burger.img = burgerImg;
  burger.scale = 0.18;
  burger.collider = "dynamic";
  burger.rotationLock = true;

  moveToSafeSpot(burger, 200);

  let speed = level === 1 ? 4 : 6;
  burger.vel.x = random([-speed, speed]);
  burger.vel.y = random([-speed, speed]);
}

function createObstacles(count) {
  for (let i = 0; i < count; i++) {
    let o = new Sprite(
      random(220, width - 220),
      random(160, height - 160),
      random(120, 220),
      40
    );
    o.color = "gray";
    o.collider = "static";
    obstacles.add(o);
  }
}

function moveToSafeSpot(sprite, margin) {
  let placed = false;
  let tries = 0;

  while (!placed && tries < 200) {
    tries++;

    sprite.x = random(margin, width - margin);
    sprite.y = random(margin, height - margin);

    placed = true;

    // keep away from player
    if (player && dist(sprite.x, sprite.y, player.x, player.y) < 180) {
      placed = false;
    }

    // keep away from obstacles
    for (let i = 0; i < obstacles.length; i++) {
      let o = obstacles[i];
      if (dist(sprite.x, sprite.y, o.x, o.y) < 140) {
        placed = false;
        break;
      }
    }
  }
}

function runGame() {
  movePlayer();

  player.collides(obstacles);
  player.collides(walls);

  burger.bounce(obstacles);
  burger.bounce(walls);

  if (hitCooldown > 0) {
    hitCooldown--;
  }

  if (player.overlaps(apple)) {
    score++;
    moveToSafeSpot(apple, 120);
  }

  if (player.overlaps(burger) && hitCooldown === 0) {
    health -= 10;
    hitCooldown = 20;
  }

  drawSprites();
  drawHUD();

  if (level === 1 && score >= 5) {
    level = 2;
    setupLevel();
    return;
  }

  if (score >= 10) {
    stopSprites();
    gameState = "win";
  }

  if (health <= 0) {
    stopSprites();
    gameState = "lose";
  }
}

function movePlayer() {
  let speed = 6;

  player.vel.x = 0;
  player.vel.y = 0;

  if (kb.pressing("left") || kb.pressing("a")) {
    player.vel.x = -speed;
    player.rotation = 180;
  }

  if (kb.pressing("right") || kb.pressing("d")) {
    player.vel.x = speed;
    player.rotation = 0;
  }

  if (kb.pressing("up") || kb.pressing("w")) {
    player.vel.y = -speed;
    player.rotation = -90;
  }

  if (kb.pressing("down") || kb.pressing("s")) {
    player.vel.y = speed;
    player.rotation = 90;
  }

  // normalize diagonal movement
  if (player.vel.x !== 0 && player.vel.y !== 0) {
    player.vel.x *= 0.7071;
    player.vel.y *= 0.7071;
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

function stopSprites() {
  if (player) {
    player.vel.x = 0;
    player.vel.y = 0;
  }

  if (burger) {
    burger.vel.x = 0;
    burger.vel.y = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  if (typeof world !== "undefined") {
    world.gravity.y = 0;
  }

  if (gameState === "play") {
    setupLevel();
  }
}