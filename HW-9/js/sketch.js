let canvas;

let player;
let apple;
let badItems;
let obstacles;
let walls;

let playerImg, appleImg, badImg;

let score = 0;
let health = 100;
let gameState = "play";

function preload() {
  playerImg = loadImage("images/snake-head-right.png");
  appleImg = loadImage("images/apple.png");
  badImg = loadImage("images/fast-food-png-41613.png");
}

function setup() {
  let gameWidth = 1200;
  let gameHeight = 800;

  canvas = createCanvas(gameWidth, gameHeight);

  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canvas.position(x, y);

  startGame();
}

function draw() {
  background(30);

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

function startGame() {
  score = 0;
  health = 100;

  if (player) player.remove();
  if (apple) apple.remove();
  if (badItems) badItems.remove();
  if (obstacles) obstacles.remove();
  if (walls) walls.remove();

  player = new Sprite(120, 120, 60, 60);
  player.img = playerImg;
  player.scale = 0.5;

  apple = new Sprite(random(120, width - 120), random(120, height - 120), 30, 30);
  apple.img = appleImg;
  apple.scale = 0.4;

  badItems = new Group();
  obstacles = new Group();
  walls = new Group();

  createWalls();

  // bad items
  for (let i = 0; i < 3; i++) {
    let b = new Sprite(random(150, width - 150), random(150, height - 150), 60, 60);
    b.img = badImg;
    b.scale = 0.18;
    b.vel.x = random([-3, 3]);
    b.vel.y = random([-3, 3]);
    badItems.add(b);
  }

  // obstacles
  for (let i = 0; i < 3; i++) {
    let o = new Sprite(random(200, width - 200), random(150, height - 150), 160, 40);
    o.color = "gray";
    o.collider = "static";
    obstacles.add(o);
  }
}

function createWalls() {
  let top = new Sprite(width / 2, 5, width, 10, "static");
  let bottom = new Sprite(width / 2, height - 5, width, 10, "static");
  let left = new Sprite(5, height / 2, 10, height, "static");
  let right = new Sprite(width - 5, height / 2, 10, height, "static");

  top.visible = false;
  bottom.visible = false;
  left.visible = false;
  right.visible = false;

  walls.add(top);
  walls.add(bottom);
  walls.add(left);
  walls.add(right);
}

function runGame() {
  movePlayer();

  player.collides(obstacles);
  player.collides(walls);

  for (let b of badItems) {
    b.collides(obstacles);
    b.collides(walls);
  }

  if (player.overlaps(apple)) {
    score++;
    apple.pos.x = random(120, width - 120);
    apple.pos.y = random(120, height - 120);
  }

  for (let b of badItems) {
    if (player.overlaps(b)) {
      health -= 1;
    }
  }

  drawSprites();

  fill(255);
  textSize(24);
  text("Score: " + score, 20, 35);
  text("Health: " + health, 20, 70);

  if (score >= 10) gameState = "win";
  if (health <= 0) gameState = "lose";
}

function movePlayer() {
  let speed = 5;

  player.vel.x = 0;
  player.vel.y = 0;

  if (kb.pressing("left") || kb.pressing("a")) player.vel.x = -speed;
  if (kb.pressing("right") || kb.pressing("d")) player.vel.x = speed;
  if (kb.pressing("up") || kb.pressing("w")) player.vel.y = -speed;
  if (kb.pressing("down") || kb.pressing("s")) player.vel.y = speed;
}

function windowResized() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canvas.position(x, y);
}