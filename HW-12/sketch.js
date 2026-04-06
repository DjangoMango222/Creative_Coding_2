let textTexture;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  textTexture = createGraphics(512, 256);
  textTexture.background(20, 10, 40);
  textTexture.fill(255);
  textTexture.textAlign(CENTER, CENTER);

  textTexture.textSize(32);
  textTexture.textStyle(BOLD);
  textTexture.text("Cosmic Sculpture Garden", 256, 95);

  textTexture.textSize(24);
  textTexture.textStyle(NORMAL);
  textTexture.text("by Dj", 256, 155);
}

function draw() {
  background(8, 6, 18);

  orbitControl();

  ambientLight(70);
  directionalLight(255, 255, 255, -0.5, 0.7, -1);
  pointLight(180, 180, 255, 0, -200, 250);

  // Ground
  push();
  rotateX(HALF_PI);
  ambientMaterial(40, 70, 120);
  translate(0, 0, 180);
  plane(1000, 1000);
  pop();

  // 1 box
  push();
  translate(-250, -100, 0);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.015);
  ambientMaterial(255, 120, 120);
  box(110);
  pop();

  // 2 sphere
  push();
  translate(0, -140, 0);
  rotateY(frameCount * 0.02);
  rotateZ(frameCount * 0.01);
  specularMaterial(120, 220, 255);
  shininess(80);
  sphere(75);
  pop();

  // 3 cone
  push();
  translate(240, -80, 0);
  rotateX(frameCount * 0.02);
  rotateZ(frameCount * 0.015);
  normalMaterial();
  cone(70, 140);
  pop();

  // 4 cylinder
  push();
  translate(-180, 140, -100);
  rotateY(frameCount * 0.017);
  rotateX(frameCount * 0.012);
  specularMaterial(255, 220, 120);
  shininess(40);
  cylinder(55, 130);
  pop();

  // 5 torus
  push();
  translate(120, 120, 60);
  rotateX(frameCount * 0.018);
  rotateY(frameCount * 0.02);
  ambientMaterial(180, 120, 255);
  torus(70, 20);
  pop();

  // 6 ellipsoid
  push();
  translate(320, 120, -120);
  rotateY(frameCount * 0.014);
  rotateZ(frameCount * 0.02);
  specularMaterial(120, 255, 170);
  shininess(100);
  ellipsoid(90, 55, 55);
  pop();

  // title + name panel
  push();
  translate(0, -260, -200);
  rotateY(sin(frameCount * 0.01) * 0.3);
  texture(textTexture);
  plane(360, 180);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}