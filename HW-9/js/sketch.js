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

function preload() {
  snakeImg = loadImage("images/snake-head-right.png");
  appleImg = loadImage("images/apple.png");
  burgerImg = loadImage("images/fast-food-png-41613.png");
}

function setup() {
  canvas = createCanvas(1200, 800);

  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canvas.position(x, y);
}

function draw() {
  background(30);

  if (gameState === "menu") {
    fill(255);
    textSize(40);
    text("VentureSnake", width / 2 - 120, height / 2 - 40);

    textSize(20);
    text("Press SPACE to start", width / 2 - 110, height / 2 + 10);
  }

  if (gameState === "play") {
    runGame();
  }

  if (gameState === "win") {
    fill(255);
    textSize(40);
    text("YOU WIN", width / 2 - 90, height / 2);
  }

  if (gameState === "lose") {
    fill(255);
    textSize(40);
    text("GAME OVER", width / 2 - 110, height / 2);
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
  setupLevel();
  gameState = "play";
}

function clearSprites() {
  if (player) player.remove();
  if (apple) apple.remove();
  if (burger) burger.remove();
  if (obstacles) obstacles.remove();
}

function setupLevel() {
  clearSprites();

  obstacles = new Group();

  player = new Sprite(120, 120, 60, 60);
  player.img = snakeImg;
  player.scale = 0.5;
  player.collider = "dynamic";
  player.rotationLock = true;

  apple = new Sprite(random(120, width - 120), random(120, height - 120), 30, 30);
  apple.img = appleImg;
  apple.scale = 0.4;
  apple.collider = "static";

  burger = new Sprite(random(200, width - 200), random(200, height - 200), 60, 60);
  burger.img = burgerImg;
  burger.scale = 0.18;
  burger.collider = "dynamic";
  burger.vel.x = random([-3, 3]);
  burger.vel.y = random([-3, 3]);
  burger.rotationLock = true;

  for (let i = 0; i < 3; i++) {
    let o = new Sprite(
      random(200, width - 200),
      random(150, height - 150),
      random(120, 180),
      40
    );
    o.color = "gray";
    o.collider = "static";
    obstacles.add(o);
  }
}

function runGame() {
  movePlayer();
  keepPlayerInScreen();
  moveBurger();

  player.collides(obstacles);
  burger.collides(obstacles);

  if (player.overlaps(apple)) {
    score++;
    apple.x = random(120, width - 120);
    apple.y = random(120, height - 120);
  }

  if (player.overlaps(burger)) {
    health -= 1;
  }

  drawSprites();

  fill(255);
  textSize(24);
  text("Score: " + score, 20, 35);
  text("Health: " + health, 20, 70);
  text("Level: " + level, 20, 105);

  if (level === 1 && score >= 5) {
    level = 2;
    setupLevel();
  }

  if (score >= 10) {
    gameState = "win";
  }

  if (health <= 0) {
    gameState = "lose";
  }
}

function movePlayer() {
  let speed = 5;

  if (kb.pressing("left") || kb.pressing("a")) {
    player.x -= speed;
  }

  if (kb.pressing("right") || kb.pressing("d")) {
    player.x += speed;
  }

  if (kb.pressing("up") || kb.pressing("w")) {
    player.y -= speed;
  }

  if (kb.pressing("down") || kb.pressing("s")) {
    player.y += speed;
  }
}

function keepPlayerInScreen() {
  if (player.x < 20) player.x = 20;
  if (player.x > width - 20) player.x = width - 20;
  if (player.y < 20) player.y = 20;
  if (player.y > height - 20) player.y = height - 20;
}

function moveBurger() {
  if (burger.x < 20 || burger.x > width - 20) {
    burger.vel.x *= -1;
  }

  if (burger.y < 20 || burger.y > height - 20) {
    burger.vel.y *= -1;
  }
}

function windowResized() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canvas.position(x, y);
}