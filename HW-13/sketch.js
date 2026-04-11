let spaceTex;
let sunTex;
let planetTextures = [];
let moonTex;
let ringTex;
let cometTex;

let planets = [];
let extras = [];

function preload() {
  spaceTex = loadImage('assets/Space.jpg');
  sunTex = loadImage('assets/Sun.jpg');

  planetTextures[0] = loadImage('assets/Mercury.jpg');
  planetTextures[1] = loadImage('assets/Venus.jpg');
  planetTextures[2] = loadImage('assets/Earth.jpg');
  planetTextures[3] = loadImage('assets/Mars.jpg');
  planetTextures[4] = loadImage('assets/Jupiter.jpg');

  moonTex = loadImage('assets/Moon.jpg');
  ringTex = loadImage('assets/Saturn_Ring.png');
  cometTex = loadImage('assets/Mercury.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(RADIANS);

  planets.push(makePlanet('Mercury', 95, 13, 0.020, planetTextures[0], -18));
  planets.push(makePlanet('Venus', 145, 20, 0.015, planetTextures[1], 12));
  planets.push(makePlanet('Earth', 205, 25, 0.011, planetTextures[2], -10));
  planets.push(makePlanet('Mars', 275, 19, 0.008, planetTextures[3], 18));
  planets.push(makePlanet('Jupiter', 360, 40, 0.005, planetTextures[4], -4));

  extras.push({
    type: 'ring',
    parentPlanet: 4,
    width: 120,
    height: 120,
    tilt: 0.45
  });

  extras.push({
    type: 'moon',
    parentPlanet: 2,
    orbitRadius: 48,
    size: 8,
    orbitSpeed: 0.050,
    angleOffset: random(TWO_PI)
  });

  extras.push({
    type: 'comet',
    orbitRadiusX: 470,
    orbitRadiusZ: 255,
    size: 18,
    orbitSpeed: 0.012,
    angleOffset: random(TWO_PI),
    yOffset: -110
  });
}

function makePlanet(name, orbitRadius, size, orbitSpeed, tex, yOffset) {
  return {
    name: name,
    orbitRadius: orbitRadius,
    size: size,
    orbitSpeed: orbitSpeed,
    texture: tex,
    yOffset: yOffset,
    angleOffset: random(TWO_PI),
    spinSpeed: random(0.010, 0.025),
    spinOffset: random(TWO_PI),
    x: 0,
    y: 0,
    z: 0
  };
}

function draw() {
  background(4, 6, 18);

  orbitControl();

  ambientLight(95);
  pointLight(255, 210, 120, 0, 0, 0);
  directionalLight(110, 140, 200, -0.5, 0.3, -1);

  drawBackground();
  drawLabels();
  drawSun();
  drawOrbitLines();
  drawPlanets();
  drawExtras();
}

function drawBackground() {
  push();
  translate(0, 0, -1300);
  noStroke();
  texture(spaceTex);
  plane(3000, 2000);
  pop();
}

function drawLabels() {
  push();
  resetMatrix();
  translate(-width / 2, -height / 2);

  fill(255);
  noStroke();

  textSize(30);
  text('Solar Drift', 24, 42);

  textSize(18);
  text('Django Behunin', 24, 70);

  textSize(13);
  text('Click to rearrange the planets', 24, 94);
  pop();
}

function drawSun() {
  push();
  noStroke();
  emissiveMaterial(255, 200, 90);
  texture(sunTex);
  rotateY(frameCount * 0.004);
  sphere(58, 32, 24);
  pop();

  push();
  noFill();
  stroke(255, 180, 70, 35);
  strokeWeight(3);
  sphere(72, 20, 14);
  pop();
}

function drawOrbitLines() {
  push();
  noFill();
  stroke(130, 130, 180, 60);
  strokeWeight(1);

  for (let i = 0; i < planets.length; i++) {
    push();
    rotateX(HALF_PI);
    ellipse(0, 0, planets[i].orbitRadius * 2, planets[i].orbitRadius * 2);
    pop();
  }

  pop();
}

function drawPlanets() {
  for (let i = 0; i < planets.length; i++) {
    let p = planets[i];
    let angle = frameCount * p.orbitSpeed + p.angleOffset;

    p.x = cos(angle) * p.orbitRadius;
    p.z = sin(angle) * p.orbitRadius;
    p.y = p.yOffset;

    push();
    translate(p.x, p.y, p.z);
    rotateY(frameCount * p.spinSpeed + p.spinOffset);
    rotateX(frameCount * p.spinSpeed * 0.35);
    noStroke();
    texture(p.texture);
    sphere(p.size, 28, 20);
    pop();
  }
}

function drawExtras() {
  for (let i = 0; i < extras.length; i++) {
    let e = extras[i];

    if (e.type === 'ring') {
      let saturn = planets[e.parentPlanet];

      push();
      translate(saturn.x, saturn.y, saturn.z);
      rotateX(HALF_PI + e.tilt);
      noStroke();
      texture(ringTex);
      plane(e.width, e.height);
      pop();
    }

    if (e.type === 'moon') {
      let parent = planets[e.parentPlanet];
      let angle = frameCount * e.orbitSpeed + e.angleOffset;

      let x = parent.x + cos(angle) * e.orbitRadius;
      let z = parent.z + sin(angle) * e.orbitRadius;
      let y = parent.y + sin(angle * 1.4) * 8;

      push();
      translate(x, y, z);
      rotateY(frameCount * 0.02);
      noStroke();
      texture(moonTex);
      sphere(e.size, 20, 16);
      pop();
    }

    if (e.type === 'comet') {
      let angle = frameCount * e.orbitSpeed + e.angleOffset;
      let x = cos(angle) * e.orbitRadiusX;
      let z = sin(angle) * e.orbitRadiusZ;
      let y = e.yOffset + sin(frameCount * 0.02) * 24;

      push();
      translate(x, y, z);
      rotateZ(-PI / 6);
      rotateX(frameCount * 0.012);
      noStroke();
      texture(cometTex);
      cone(e.size * 0.6, e.size * 2.5, 20, 10);
      pop();

      push();
      translate(x - 28, y, z);
      noStroke();
      ambientMaterial(190, 225, 255);
      sphere(6, 10, 8);
      pop();

      push();
      translate(x - 55, y, z);
      noStroke();
      ambientMaterial(150, 200, 255);
      sphere(4, 8, 6);
      pop();
    }
  }
}

function mouseClicked() {
  for (let i = 0; i < planets.length; i++) {
    planets[i].orbitRadius = random(90, 390);
    planets[i].angleOffset = random(TWO_PI);
    planets[i].yOffset = random(-90, 90);
    planets[i].spinOffset = random(TWO_PI);
  }

  extras[2].orbitRadiusX = random(400, 520);
  extras[2].orbitRadiusZ = random(200, 320);
  extras[2].angleOffset = random(TWO_PI);

  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}