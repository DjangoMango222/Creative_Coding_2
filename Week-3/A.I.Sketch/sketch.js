let circles = [];

function setup() {
  createCanvas(600, 400);
  for (let i = 0; i < 15; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      r: random(10, 40)
    });
  }
}

function draw() {
  background(200);

  textSize(16);
  text("AI Generated Sketch", 10, 20);
  textSize(12);
  text("Your Name", width - 80, height - 10);

  for (let c of circles) {
    ellipse(c.x, c.y, c.r * 2);
    c.x += random(-1, 1);
    c.y += random(-1, 1);
  }
}

function mousePressed() {
  for (let c of circles) {
    c.x = random(width);
    c.y = random(height);
  }
}
