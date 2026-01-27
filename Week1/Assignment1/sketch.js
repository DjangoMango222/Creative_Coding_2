function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);
  noLoop();
}

function draw() {
  background(245);

  translate(width / 2, height / 2);

  fill(230);
  stroke(30);
  strokeWeight(3);
  ellipse(0, 80, 260, 220);

  fill(230);
  stroke(30);
  strokeWeight(3);
  ellipse(0, -60, 220, 190);

  

fill(230);
stroke(30);
strokeWeight(3);

triangle(-110, -140, -60, -210, -10, -140);

triangle(110, -140, 60, -210, 10, -140);


  fill(255);
  stroke(30);
  strokeWeight(3);
  ellipse(-50, -70, 55, 40);
  ellipse(50, -70, 55, 40);

  fill(60);
  ellipse(-50, -70, 20, 20);
  ellipse(50, -70, 20, 20);

  fill(210, 90, 90);
  stroke(30);
  strokeWeight(3);
  triangle(0, -40, -15, -20, 15, -20);

  stroke(30);
  strokeWeight(3);
  line(0, -20, 0, -5);
  line(0, -5, 15, 10);
  line(0, -5, -15, 10);

  stroke(30);
  strokeWeight(2);
  line(-40, -10, -110, -5);
  line(-40, 0, -110, 0);
  line(-40, 10, -110, 5);
  line(40, -10, 110, -5);
  line(40, 0, 110, 0);
  line(40, 10, 110, 5);

  stroke(30);
  strokeWeight(12);
  noFill();
  arc(130, 120, 120, 140, 120, 280);

  push();
  fill(230);
  stroke(30);
  strokeWeight(3);
  rect(-90, 150, 60, 120, 20);
  rect(30, 150, 60, 120, 20);

  fill(255);
  stroke(30);
  strokeWeight(3);
  ellipse(-60, 270, 60, 40);
  ellipse(60, 270, 60, 40);
}
