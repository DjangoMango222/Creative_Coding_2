let spriteSheet;
let foodImg;

let idleFrames = [];
let walkFrames = [];
let currentFrames = [];

let frameW = 90;
let frameH = 96;

let currentFrame = 0;
let lastFrameTime = 0;
let frameDelay = 120;

let player = {
  x: 400,
  y: 300,
  w: 110,
  h: 120,
  speed: 4,
  moving: false,
  facingRight: true
};

let food = {
  x: 100,
  y: 100,
  size: 70,
  nextMoveTime: 0
};

let score = 0;
let gameLength = 60;
let startTime = 0;
let gameOver = false;

function preload() {
  spriteSheet = loadImage("images/holo_sheet.png");
  foodImg = loadImage("images/food.png");
}

function setup() {
  createCanvas(800, 600);
  imageMode(CENTER);
  rectMode(CORNER);
  textAlign(LEFT, TOP);

  for (let i = 0; i < 6; i++) {
    idleFrames.push(spriteSheet.get(i * frameW, 0, frameW, frameH));
  }

  for (let i = 0; i < 8; i++) {
    walkFrames.push(spriteSheet.get(i * frameW, 2 * frameH, frameW, frameH));
  }

  currentFrames = idleFrames;
  moveFood();
  food.nextMoveTime = millis() + int(random(1000, 3000));
  startTime = millis();
}

function draw() {
  background(170, 210, 255);

  if (!gameOver) {
    updateTimer();
    updatePlayer();
    updateFood();
    checkCollection();
  }

  updateAnimation();
  drawFood();
  drawPlayer();
  drawHUD();

  if (gameOver) {
    drawGameOver();
  }
}

function updatePlayer() {
  player.moving = false;

  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    player.x -= player.speed;
    player.moving = true;
    player.facingRight = false;
  }

  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    player.x += player.speed;
    player.moving = true;
    player.facingRight = true;
  }

  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    player.y -= player.speed;
    player.moving = true;
  }

  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    player.y += player.speed;
    player.moving = true;
  }

  player.x = constrain(player.x, 45, width - 45);
  player.y = constrain(player.y, 48, height - 48);

  if (player.moving) {
    if (currentFrames !== walkFrames) {
      currentFrames = walkFrames;
      currentFrame = 0;
    }
  } else {
    if (currentFrames !== idleFrames) {
      currentFrames = idleFrames;
      currentFrame = 0;
    }
  }
}

function updateAnimation() {
  if (millis() - lastFrameTime > frameDelay) {
    currentFrame++;
    if (currentFrame >= currentFrames.length) {
      currentFrame = 0;
    }
    lastFrameTime = millis();
  }
}

function drawPlayer() {
  push();
  translate(player.x, player.y);

  if (!player.facingRight) {
    scale(-1, 1);
  }

  image(currentFrames[currentFrame], 0, 0, player.w, player.h);
  pop();
}

function moveFood() {
  food.x = random(60, width - 60);
  food.y = random(60, height - 60);
}

function updateFood() {
  if (millis() > food.nextMoveTime) {
    moveFood();
    food.nextMoveTime = millis() + int(random(1000, 3000));
  }
}

function drawFood() {
  image(foodImg, food.x, food.y, food.size, food.size);
}

function checkCollection() {
  let d = dist(player.x, player.y, food.x, food.y);

  if (d < 60) {
    score++;
    moveFood();
    food.nextMoveTime = millis() + int(random(1000, 3000));
  }
}

function updateTimer() {
  let elapsed = floor((millis() - startTime) / 1000);
  let timeLeft = gameLength - elapsed;

  if (timeLeft <= 0) {
    gameOver = true;
  }
}

function drawHUD() {
  let elapsed = floor((millis() - startTime) / 1000);
  let timeLeft = max(0, gameLength - elapsed);

  fill(255);
  stroke(0);
  strokeWeight(3);
  textSize(28);
  text("Score: " + score, 20, 20);
  text("Time: " + timeLeft, 20, 55);
  noStroke();
}

function drawGameOver() {
  noStroke();
  fill(0, 170);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(50);
  text("Game Over", width / 2, height / 2 - 30);

  textSize(28);
  text("Final Score: " + score, width / 2, height / 2 + 20);

  textAlign(LEFT, TOP);
}