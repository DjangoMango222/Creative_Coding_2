let player;
let apple;
let badItems;
let obstacles;

let snakeAnim;
let appleImg, burgerImg;

let score = 0;
let health = 100;
let gameState = "menu";

function preload() {

  snakeAnim = loadAnimation(
    "images/snake-head-right.png",
    "images/snake-head-up.png",
    "images/snake-head-left.png",
    "images/snake-head-down.png"
  );

  appleImg = loadImage("images/apple.png");
  burgerImg = loadImage("images/fast-food-png-41613.png");
}

function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(30);

  if (gameState === "menu") drawMenu();
  if (gameState === "play") playGame();
  if (gameState === "win") drawWin();
  if (gameState === "lose") drawLose();
}

function drawMenu() {
  fill(255);
  textSize(40);
  text("VentureSnake", 240, 200);

  textSize(18);
  text("Press SPACE to start", 280, 260);
}

function keyPressed() {
  if (gameState === "menu" && key === " ") {
    startGame();
  }
}

function startGame() {
  score = 0;
  health = 100;
  setupGame();
  gameState = "play";
}

function setupGame() {

  if (player) player.remove();
  if (apple) apple.remove();
  if (badItems) badItems.removeSprites();
  if (obstacles) obstacles.removeSprites();

  player = createSprite(100, 100, 40, 40);

  player.addAnimation("move", snakeAnim);
  player.scale = 1.1;

  apple = createSprite(random(100, 700), random(100, 500), 20, 20);
  apple.addImage(appleImg);
  apple.scale = 0.5;

  badItems = new Group();
  obstacles = new Group();

  for (let i = 0; i < 3; i++) {
    let b = createSprite(random(100, 700), random(100, 500), 30, 30);
    b.addImage(burgerImg);
    b.scale = 0.2;
    b.velocity.x = random([-2, 2]);
    b.velocity.y = random([-2, 2]);
    badItems.add(b);
  }

  // obstacles 
  for (let i = 0; i < 3; i++) {
    let o = createSprite(random(150, 650), random(150, 450), 100, 30);
    o.immovable = true;
    obstacles.add(o);
  }
}

function playGame() {

  movePlayer();

  player.collide(obstacles);

  for (let i = 0; i < badItems.length; i++) {
    badItems[i].bounceOff(obstacles);
  }

  player.overlap(apple, collectApple);
  player.overlap(badItems, hitBad);

  drawSprites();

  fill(255);
  textSize(16);
  text("Score: " + score, 20, 20);
  text("Health: " + health, 20, 40);

  if (score >= 10) gameState = "win";
  if (health <= 0) gameState = "lose";
}

function movePlayer() {
  let speed = 3;

  if (keyDown("UP_ARROW")) {
    player.velocity.x = 0;
    player.velocity.y = -speed;
  }
  else if (keyDown("DOWN_ARROW")) {
    player.velocity.x = 0;
    player.velocity.y = speed;
  }
  else if (keyDown("LEFT_ARROW")) {
    player.velocity.x = -speed;
    player.velocity.y = 0;
  }
  else if (keyDown("RIGHT_ARROW")) {
    player.velocity.x = speed;
    player.velocity.y = 0;
  }
}

function collectApple(p, a) {
  score++;
  a.position.x = random(100, 700);
  a.position.y = random(100, 500);
}

function hitBad(p, b) {
  health -= 1;
}

function drawWin() {
  fill(255);
  textSize(30);
  text("YOU WIN", 320, 300);
}

function drawLose() {
  fill(255);
  textSize(30);
  text("GAME OVER", 300, 300);
}