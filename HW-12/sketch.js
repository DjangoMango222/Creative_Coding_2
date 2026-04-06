let titleTexture;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont('Georgia');

  titleTexture = createGraphics(700, 160);
  titleTexture.clear();

  titleTexture.fill(255);
  titleTexture.textAlign(CENTER, CENTER);
  titleTexture.textSize(40);
  titleTexture.text("DJ's 3D Creations", 350, 80);
}

function draw() {
    for (let i = 0; i < 30; i++) {
  push();
  translate(
    random(-800, 800),
    random(-800, 800),
    random(-800, 800)
  );
  ambientMaterial(255);
  sphere(2);
  pop();
    }
  background(6, 8, 25);

  orbitControl();

  ambientLight(60);
  directionalLight(255, 255, 255, -0.4, 0.6, -1);
  pointLight(160, 180, 255, 0, -120, 220);
  pointLight(255, 120, 180, -220, 80, 120);

  push();
  translate(0, -220, -120);
  rotateY(sin(frameCount * 0.01) * 0.2);
  texture(titleTexture);
  plane(300, 80);
  pop();

  push();
  translate(0, 20, 0);
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