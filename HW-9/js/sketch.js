let player;
let apple;
let badItems;
let obstacles;

let appleImg, burgerImg;
let snakeImg;

let score = 0;
let health = 100;
let gameState = "menu";

function preload() {
  snakeImg = loadImage("images/snake-head-right.png");
  appleImg = loadImage("images/apple.png");
  burgerImg = loadImage("images/fast-food-png-41613.png");
}

function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(30);

  if (gameState === "menu") {
    fill(255);
    textSize(40);
    text("VentureSnake", 240, 200);

    textSize(18);
    text("Press SPACE to start", 280, 260);
  }

  if (gameState === "play") {
    runGame();
  }

  if (gameState === "win") {
    fill(255);
    textSize(30);
    text("YOU WIN", 320, 300);
  }

  if (gameState === "lose") {
    fill(255);
    textSize(30);
    text("GAME OVER", 300, 300);
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

  player = new Sprite(100, 100, 40, 40);
  player.img = snakeImg;
  player.scale = 0.2;

  apple = new Sprite(random(100, 700), random(100, 500), 20, 20);
  apple.img = appleImg;
  apple.scale = 0.2;

  badItems = new Group();
  obstacles = new Group();

  // bad items
  for (let i = 0; i < 3; i++) {
    let b = new Sprite(random(100, 700), random(100, 500), 30, 30);
    b.img = burgerImg;
    b.scale = 0.1;

    b.vel.x = random([-2, 2]);
    b.vel.y = random([-2, 2]);

    badItems.add(b);
  }

  // obstacles
  for (let i = 0; i < 3; i++) {
    let o = new Sprite(random(150, 650), random(150, 450), 100, 30);
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
    apple.pos.x = random(100, 700);
    apple.pos.y = random(100, 500);
  }

  // hit bad item
  for (let b of badItems) {
    if (player.overlaps(b)) {
      health -= 1;
    }
  }

  drawSprites();

  fill(255);
  textSize(16);
  text("Score: " + score, 20, 20);
  text("Health: " + health, 20, 40);

  if (score >= 10) {
    gameState = "win";
  }

  if (health <= 0) {
    gameState = "lose";
  }
}

function movePlayer() {
  let speed = 3;

  player.vel.x = 0;
  player.vel.y = 0;

  if (kb.pressing("right")) player.vel.x = speed;
  if (kb.pressing("left")) player.vel.x = -speed;
  if (kb.pressing("up")) player.vel.y = -speed;
  if (kb.pressing("down")) player.vel.y = speed;
}