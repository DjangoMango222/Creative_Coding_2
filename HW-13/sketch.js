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
    majorRadius: 62,
    tubeRadius: 7,
    tiltX: 1.15,
    tiltZ: 0.22
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

  extras.push({
    type: 'station',
    parentPlanet: 2,
    orbitRadius: 78,
    orbitSpeed: 0.022,
    angleOffset: random(TWO_PI)
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
  text