let titleTexture;
let stars = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont("Georgia");

  titleTexture = createGraphics(900, 180);
  titleTexture.clear();
  titleTexture.textAlign(CENTER, CENTER);

  titleTexture.fill(255);
  titleTexture.textSize(42);
  titleTexture.text("DJ's 3D Creations", 450, 70);

  titleTexture.fill(210);
  titleTexture.textSize(20);
  titleTexture.text("Dj", 450, 120);

  for (let i = 0; i < 140; i++) {
    stars.push({
      x: random(-1200, 1200),
      y: random(-900, 900),
      z: random(-1200, 200),
      s: random(2, 6)
    });
  }
}

function draw() {
  background(4, 6, 18);

  let camX = sin(frameCount * 0.004) * 80;
  let camY = cos(frameCount * 0.003) * 35;
  camera(camX, camY, 650, 0, 0, 0, 0, 1, 0);

  orbitControl();

  ambientLight(45, 45, 60);
  directionalLight(220, 230, 255, -0.4, 0.5, -1);
  pointLight(130, 180, 255, -220, -140, 260);
  pointLight(255, 120, 190, 240, 80, 220);
  pointLight(140, 255, 200, 0, 220, 180);

  for (let star of stars) {
    push();
    translate(star.x, star.y, star.z);
    ambientMaterial(255);
    sphere(star.s);
    pop();
  }

  push();
  translate(0, -240, -140);
  rotateY(sin(frameCount * 0.01) * 0.18);
  texture(titleTexture);
  plane(360, 72);
  pop();

  push();
  translate(0, 0, 0);
  rotateY(frameCount * 0.012);
  rotateX(frameCount * 0.009);
  specularMaterial(120, 220, 255);
  shininess(100);
  sphere(72);
  pop();

  push();
  translate(-210, 35, -80);
  rotateX(frameCount * 0.015);
  rotateY(frameCount * 0.02);
  ambientMaterial(255, 130, 140);
  box(105);
  pop();

  push();
  translate(220, 15, -60);
  rotateX(frameCount * 0.02);
  rotateZ(frameCount * 0.016);
  normalMaterial();
  cone(58, 130);
  pop();

  push();
  translate(-135, 120, 165);
  rotateY(frameCount * 0.022);
  rotateZ(frameCount * 0.012);
  specularMaterial(255, 220, 150);
  shininess(70);
  cylinder(42, 118);
  pop();

  push();
  translate(150, 110, 145);
  rotateX(frameCount * 0.019);
  rotateY(frameCount * 0.017);
  ambientMaterial(180, 120, 255);
  torus(62, 16);
  pop();

  push();
  translate(160, -65, -190);
  rotateY(frameCount * 0.016);
  rotateZ(frameCount * 0.021);
  specularMaterial(130, 255, 175);
  shininess(95);
  ellipsoid(95, 55, 55);
  pop();

  push();
  translate(-255, -55, 120);
  rotateY(frameCount * 0.03);
  ambientMaterial(120, 170, 255);
  sphere(38);
  pop();

  push();
  translate(10, -90, 210);
  r