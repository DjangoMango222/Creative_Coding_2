let foodX = [];
let foodY = [];

function setup() {
  createCanvas(400, 400);

  for (let i = 0; i < 5; i++) {
    foodX[i] = random(width);
    foodY[i] = random(height);
  }
}

function draw() {
  background(220);

  // Draw food
  for (let i = 0; i < foodX.length; i++) {
    ellipse(foodX[i], foodY[i], 30);
  }

  // Simple animation: moving line
  line(frameCount % width, 200, frameCount % width, 300);
}

