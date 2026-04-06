let titleTexture;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont('Georgia');

  titleTexture = createGraphics(700, 220);
  titleTexture.clear();
  titleTexture.background(18, 12, 40);

  titleTexture.fill(40, 30, 80);
  titleTexture.rect(10, 10, 680, 200, 18);

  titleTexture.fill(255);
  titleTexture.textAlign(CENTER, CENTER);

  titleTexture.textSize(40);
  titleTexture.textStyle(BOLD);
  titleTexture.text("DJ's 3D Creations", 350, 85);

  titleTexture.textSize(26);
  titleTexture.textStyle(NORMAL);
  titleTexture.fill(220);
  titleTexture.text("by Dj", 350, 145);
}

function draw() {
  background(6, 8, 25);

  orbitControl();

  ambientLight(60, 60, 70);
  directionalLight(255, 255, 255, -0.4, 0.6, -1);
  pointLight(160, 180, 255, 0, -120, 220);
  pointLight(255, 120, 180, -220, 80, 120);

  push();
  translate(0, 170, 0);
  rotateX(HALF_PI);
  ambientMaterial(35, 45, 80);
  plane(700, 700);
  pop();

  push();
  translate(0, -220, -120);
  rotateY(sin(frameCount * 0.01) * 0.2);
  texture(titleTexture);
  plane(320, 100);
  pop();

  push();
  translate(0, 30, 0);
  rotateY(frameCount * 0.012);
  rotateX(frameCount * 0.008);
  specularMaterial(120, 220, 255);
  shininess(100);
  sphere(65);
  pop();

  push();
  translate(-180, 40, -60);
  rotateX(frameCount * 0.014);
  rotateY(frameCount * 0.018);
  ambientMaterial(255, 140, 140);
  box(95);
  pop();

  push();
  translate(190, 35, -40);
  rotateX(frameCount * 0.02);
  rotateZ(frameCount * 0.015);
  normalMaterial();
  cone(55, 120);
  pop();

  push();
  translate(-120, 95, 150);
  rotateY(frameCount * 0.02);
  rotateZ(frameCount * 0.01);
  specularMaterial(255, 220, 140);
  shininess(60);
  cylinder(40, 110);
  pop();

  push();
  translate(130, 100, 130);
  rotateX(frameCount * 0.02);
  rotateY(frameCount * 0.018);
  ambientMaterial(180, 120, 255);
  torus(58, 16);
  pop();

  push();
  translate(135, -35, -160);
  rotateY(frameCount * 0.016);
  rotateZ(frameCount * 0.02);
  specularMaterial(130, 255, 170);
  shininess(90);
  ellipsoid(90, 55, 55);
  pop();

  push();
  translate(-230, -20, 120);
  rotateY(frameCount * 0.03);
  ambientMaterial(120, 170, 255);
  sphere(35);
  pop();

  push();
  translate(0, -40, 180);
  rotateX(frameCount * 0.015);
  rotateY(frameCount * 0.022);
  specularMaterial(255, 170, 210);
  shininess(80);
  torus(38, 10);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}