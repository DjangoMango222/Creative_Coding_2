let spriteSheet;

let frameWidth = 64;
let frameHeight = 128;
let totalFrames = 10;

let currentFrame = 0;
let frameDelay = 6;
let frameCounter = 0;

let direction = 0; // 0 = right (top row), 1 = left (bottom row)

let x = 200;
let y = 200;
let speed = 3;

function preload() {
  spriteSheet = loadImage("images/player.png"); // make sure name matches
}

function setup() {
  createCanvas(800, 400);
}

function draw() {
  background(220);

  let moving = false;

  if (keyIsDown(RIGHT_ARROW)) {
    x += speed;
    direction = 0; // top row
    moving = true;
  }

  if (keyIsDown(LEFT_ARROW)) {
    x -= speed;
    direction = 1; // bottom row
    moving = true;
  }

  // Animate only when moving
  if (moving) {
    frameCounter++;
    if (frameCounter >= frameDelay) {
      frameCounter = 0;
      currentFrame++;
      if (currentFrame >= totalFrames) {
        currentFrame = 0;
      }
    }
  } else {
    currentFrame = 0; // idle frame
  }

  image(
    spriteSheet,
    x,
    y,
    frameWidth,
    frameHeight,
    currentFrame * frameWidth,   // move left to right
    direction * frameHeight,     // choose row (0 or 1)
    frameWidth,
    frameHeight
  );
}