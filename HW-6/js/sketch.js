let spriteSheet;

let frameWidth = 32;
let frameHeight = 50;

let totalFrames = 8;
let currentFrame = 0;
let frameDelay = 8;
let frameCounter = 0;

let x = 200;
let y = 250;
let speed = 3;

let foods = [];
let score = 0;

function preload() {
  spriteSheet = loadImage("images/player.png");
}

function setup() {
  createCanvas(600, 400);

  foods = [
    new Food(100, 300, 30, color(255, 0, 0)),
    new Food(200, 300, 40, color(0, 255, 0)),
    new Food(300, 300, 35, color(0, 0, 255)),
    new Food(400, 300, 50, color(255, 200, 0)),
    new Food(500, 300, 25, color(255, 0, 255))
  ];
  console.log(spriteSheet.width, spriteSheet.height);
function setup() {
  createCanvas(600, 400);

  frameHeight = spriteSheet.height / 8;
}}

function draw() {
  background(220);

  let moving = false;

  if (keyIsDown(LEFT_ARROW)) {
    x -= speed;
    moving = true;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    x += speed;
    moving = true;
  }

  // Animate only if moving
  if (moving) {
    frameCounter++;
    if (frameCounter >= frameDelay) {
      frameCounter = 0;
      currentFrame++;
      if (currentFrame >= totalFrames) {
        currentFrame = 0;
      }
    }
  }

  // Draw frame from vertical sprite sheet
  image(
    spriteSheet,
    x,
    y,
    frameWidth,
    frameHeight,
    0,
    currentFrame * frameHeight,
    frameWidth,
    frameHeight
  );

  // Food collision
  for (let i = foods.length - 1; i >= 0; i--) {
    foods[i].display();

    let d = dist(
      x + frameWidth / 2,
      y + frameHeight / 2,
      foods[i].x,
      foods[i].y
    );

    if (d < foods[i].size / 2 + frameWidth / 2) {
      foods.splice(i, 1);
      score++;
    }
  }

  fill(0);
  textSize(20);
  textAlign(LEFT);
  text("Score: " + score, 20, 30);

  if (foods.length === 0) {
    textSize(40);
    textAlign(CENTER);
    text("You Win!", width / 2, height / 2);
  }
}