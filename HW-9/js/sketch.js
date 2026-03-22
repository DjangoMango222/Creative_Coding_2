let player;
let apple;
let badItems;
let obstacles;

let playerImg, appleImg, badImg;

let score = 0;
let health = 100;
let gameState = "menu";

function preload() {
  playerImg = loadImage("images/snake-head-right.png");
  appleImg = loadImage("images/apple.png");
  badImg = loadImage("images/fast-food-png-41613.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
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
    text("YOU WIN", width / 2 - 100, height / 2);
  }

  if (gameState === "lose") {
    fill(255);
    textSize(40);
    text("GAME OVER", width / 2 - 120, height / 2);
  }
}

function keyPressed() {
  if (gameState === "menu" && key === " ") {
    startGame();
  }
}

function startGame() {

  score = 0;
  health = 100;

  if (player) player.remove();
  if (apple) apple.remove();
  if (badItems) badItems.remove();
  if (obstacles) obstacles.remove();

  // player
  player = new Sprite(width / 2, height / 2, 40, 40);
  player.img = playerImg;
  player.scale = 0.3;

  // apple
  apple = new Sprite(random(100, width - 100), random(100, height - 100), 20, 20);
  apple.img = appleImg;
  apple.scale = 0.3;

  badItems = new Group();
  obstacles = new Group();

  // bad items
  for (let i = 0; i < 3; i++) {
    let b = new Sprite(random(100, width - 100), random(100, height - 100), 30, 30);
    b.img = badImg;
    b.scale = 0.2;
    b.vel.x = random([-2, 2]);
    b.vel.y = random([-2, 2]);
    badItems.add(b);
  }

  // obstacles
  for (let i = 0; i < 3; i++) {
    let o = new Sprite(random(150, width - 150), random(150, height - 150), 100, 30);
    o.color = "gray";
    o.collider = "static";
    obstacles.add(o);
  }

  gameState = "play";
}

function runGame() {

  movePlayer();

  player.collides(obstacles);

  for (let b of badItems) {
    b.collides(obstacles);
  }

  // collect apple
  if (player.overlaps(apple)) {
    score++;
    apple.pos.x = random(100, width - 100);
    apple.pos.y = random(100, height - 100);
  }

  // hit bad items
  for (let b of badItems) {
    if (player.overlaps(b)) {
      health -= 1;
    }
  }

  drawSprites();

  fill(255);
  textSize(18);
  text("Score: " + score, 20, 30);
  text("Health: " + health, 20, 60);

  if (score >= 10) {
    gameState = "win";
  }

  if (health <= 0) {
    gameState = "lose";
  }
}

function movePlayer() {
  let speed = 4;

  player.vel.x = 0;
  player.vel.y = 0;

  if (kb.pressing("up")) player.vel.y = -speed;
  if (kb.pressing("down")) player.vel.y = speed;
  if (kb.pressing("left")) player.vel.x = -speed;
  if (kb.pressing("right")) player.vel.x = speed;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}