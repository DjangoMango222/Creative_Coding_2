// sketch.js

let spriteSheet;

// Sprite frame size
let frameWidth = 32;
let frameHeight = 32;

// Animation frames
let idleStart = 0;
let idleCount = 4;

let walkStart = 4;
let walkCount = 4;

// Animation control
let currentFrame = 0;
let frameCounter = 0;
let frameDelay = 10;

// Character position
let x = 200;
let y = 250;
let speed = 2;

// Game variables
let foods = [];
let score = 0;

function preload() {
  spriteSheet = loadImage("images/character.png"); // Make sure this exists!
}

function setup() {
  createCanvas(600, 400);

  // Create 5 different foods
  foods.push(new Food(100, 300, 30, color(255, 0, 0)));
  foods.push(new Food(200, 300, 40, color(0, 255, 0)));
  foods.push(new Food(300, 300, 35, color(0, 0, 255)));
  foods.push(new Food(400, 300, 50, color(255, 200, 0)));
  foods.push(new Food(500, 300, 25, color(255, 0, 255)));
}

function draw() {
  background(220);

  let moving = false;

  // Character movement
  if (keyIsDown(LEFT_ARROW)) {
    x -= speed;
    moving = true;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    x += speed;
    moving = true;
  }

  // Animation timing
  frameCounter++;
  if (frameCounter > frameDelay) {
    frameCounter = 0;
    currentFrame++;

    let maxFrames = moving ? walkCount : idleCount;

    if (currentFrame >= maxFrames) {
      currentFrame = 0;
    }
  }

  // Choose animation
  let startFrame = moving ? walkStart : idleStart;

  // Draw character (vertical sprite sheet)
  image(
    spriteSheet,
    x, y,
    frameWidth, frameHeight,
    0,
    (startFrame + currentFrame) * frameHeight,
    frameWidth,
    frameHeight
  );

  // Display food and check for collection
  for (let i = foods.length - 1; i >= 0; i--) {
    foods[i].display();

    // Simple collision
    let d = dist(x + frameWidth / 2, y + frameHeight / 2, foods[i].x, foods[i].y);

    if (d < foods[i].size / 2 + frameWidth / 2) {
      foods.splice(i, 1);
      score++;
    }
  }

  // Display score
  fill(0);
  textSize(20);
  text("Score: " + score, 20, 30);

  // Win message
  if (foods.length === 0) {
    textSize(40);
    fill(0);
    textAlign(CENTER);
    text("You Win!", width / 2, height / 2);
  }
}