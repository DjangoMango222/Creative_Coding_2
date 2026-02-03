let floatX = 0;
let floatY = 0;
let shaking = false;

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);
}

function draw() {
  // update shake offsets
  if (shaking) {
    floatX = random(-3, 3);
    floatY = random(-3, 3);
  } else {
    floatX = 0;
    floatY = 0;
  }

  background(245);

  translate(width / 2 + floatX, height / 2 + floatY);

  //BACKLEFT FOOT
  ellipse(-50, 190, 60, 40);

  fill(0);
  stroke(30);
  strokeWeight(3);
  ellipse(0, 80, 260, 220);
  ellipse(0, -60, 220, 190);

  // ears
  fill(0);
  stroke(30);
  strokeWeight(3);
  push();
  translate(-80, -140);
  triangle(0, 12, -30, -70, 40, -10);
  pop();
  push();
  translate(80, -140);
  triangle(0, 12, -30, -5, 40, -50);
  pop();

  // pupils
  fill(60);
  ellipse(-50, -70, 20, 50);
  ellipse(50, -70, 20, 50);

  // Nose
  fill(210, 90, 90);
  stroke(30);
  strokeWeight(3);
  triangle(0, -40, -15, -20, 15, -20);

  // Kitty Mouth
  stroke(30);
  strokeWeight(3);
  line(0, -20, 0, -5);
  line(0, -5, 15, 10);
  line(0, -5, -15, 10);

  // whiskers
  stroke(30);
  strokeWeight(2);
  line(-40, -10, -110, -5);
  line(-40, 0, -110, 0);
  line(-40, 10, -110, 5);
  line(40, -10, 110, -5);
  line(40, 0, 110, 0);
  line(40, 10, 110, 5);

  // tail
  stroke(30);
  strokeWeight(12);
  noFill();
  arc(-130, 120, 120, 200, 10, 280);

  // feet / paws
  fill(255);
  stroke(30);
  strokeWeight(3);
  ellipse(50, 190, 60, 40);

  // Arms
  push();
  fill(0);
  stroke(30);
  strokeWeight(3);
  rect(-90, 60, 50, 210, 60);
  rect(30, 60, 50, 210, 60);

  // THUMBS
  fill(255);
  rect(-37, 260, 15, 23, 12);
  rect(22, 260, 15, 23, 12);
  // BACKLEFT FOOT
  rect(-37, 190, 15, 23, 12);
  pop();

  // Paws
  fill(255);
  stroke(30);
  strokeWeight(3);
  ellipse(-60, 270, 60, 40);
  ellipse(60, 270, 60, 40);

  // Paw lines
  rect(-80, 264, 10, 23, 12);
  rect(-60, 266, 10, 22, 12);
  rect(-45, 263, 8, 22, 12);

  rect(72, 264, 10, 22, 12);
  rect(55, 266, 10, 22, 12);
  rect(40, 263, 8, 22, 12);

  // Title
  fill(0);
  noStroke();
  textSize(20);
  text("My Kitty Lush Waiting for Treats", -width / 2 + 10, -height / 2 + 25);

  // Name
  textSize(14);
  text("Made by Django Behunin", width / 2 - 175, height / 2 - 15);
}

// ANIMATION PRESS SPACE BAR
function keyPressed() {
  if (key === ' ') {       
    shaking = !shaking;
  }
}
