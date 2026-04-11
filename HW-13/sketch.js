let spaceTex;
let sunTex;
let moonTex;
let ringTex;
let mercuryTex;

let bodyTextures = {};
let planets = [];
let asteroids = [];
let stationParts = [];

let moonData;
let cometData;
let ringData;
let stationData;

function preload() {
  spaceTex = loadImage('assets/Space.jpg');
  sunTex = loadImage('assets/Sun.jpg');
  moonTex = loadImage('assets/Moon.jpg');
  ringTex = loadImage('assets/Saturn_Ring.png');
  mercuryTex = loadImage('assets/Mercury.jpg');

  bodyTextures.mercury = loadImage('assets/Mercury.jpg');
  bodyTextures.venus = loadImage('assets/Venus.jpg');
  bodyTextures.earth = loadImage('assets/Earth.jpg');
  bodyTextures.mars = loadImage('assets/Mars.jpg');
  bodyTextures.jupiter = loadImage('assets/Jupiter.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(RADIANS);

  planets = [
    makePlanet('Mercury', 95, 13, 0.020, bodyTextures.mercury, -18),
    makePlanet('Venus', 145, 20, 0.015, bodyTextures.venus, 12),
    makePlanet('Earth', 205, 25, 0.011, bodyTextures.earth, -10),
    makePlanet('Mars', 275, 19, 0.008, bodyTextures.mars, 18),
    makePlanet('Jupiter', 360, 40, 0.005, bodyTextures.jupiter, -4)
  ];

  moonData = {
    parentPlanet: 2,
    orbitRadius: 48,
    size: 8,
    orbitSpeed: 0.050,
    angleOffset: random(TWO_PI),
    x: 0,
    y: 0,
    z: 0
  };

  cometData = {
    orbitRadiusX: 470,
    orbitRadiusZ: 255,
    size: 18,
    orbitSpeed: 0.012,
    angleOffset: random(TWO_PI),
    yOffset: -110,
    x: 0,
    y: 0,
    z: 0
  };

  ringData = {
    parentPlanet: 4,
    majorRadius: 72,
    tubeRadius: 4,
    tiltX: 1.18,
    tiltZ: 0.28
  };

  stationData = {
    parentPlanet: 2,
    orbitRadius: 95,
    orbitSpeed: 0.018,
    angleOffset: random(TWO_PI),
    x: 0,
    y: 0,
    z: 0,
    angle: 0
  };

  stationParts = [
    {
      shape: 'box',
      tx: 0,
      ty: 0,
      tz: 0,
      sx: 24,
      sy: 10,
      sz: 10,
      material: [185]
    },
    {
      shape: 'cylinder',
      tx: 0,
      ty: 0,
      tz: 0,
      radius: 2,
      height: 40,
      material: [130]
    },
    {
      shape: 'box',
      tx: -26,
      ty: 0,
      tz: 0,
      sx: 24,
      sy: 2,
      sz: 12,
      material: [70, 120, 220]
    },
    {
      shape: 'box',
      tx: 26,
      ty: 0,
      tz: 0,
      sx: 24,
      sy: 2,
      sz: 12,
      material: [70, 120, 220]
    },
    {
      shape: 'sphere',
      tx: 0,
      ty: -10,
      tz: 0,
      radius: 4,
      detailX: 10,
      detailY: 8,
      material: [220]
    },
    {
      shape: 'box',
      tx: 0,
      ty: 10,
      tz: 0,
      sx: 8,
      sy: 4,
      sz: 8,
      material: [160]
    }
  ];

  let asteroidShapes = ['sphere', 'box', 'ellipsoid'];

  for (let i = 0; i < 12; i++) {
    asteroids.push({
      orbitRadius: random(300, 345),
      angleOffset: map(i, 0, 12, 0, TWO_PI) + random(-0.15, 0.15),
      orbitSpeed: random(0.004, 0.007),
      yOffset: random(-18, 18),
      size: random(6, 12),
      shape: random(asteroidShapes),
      rotX: random(TWO_PI),
      rotY: random(TWO_PI),
      rotZ: random(TWO_PI),
      spinX: random(0.005, 0.02),
      spinY: random(0.005, 0.02),
      spinZ: random(0.005, 0.02)
    });
  }
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
  updateBodies();
  drawLabels();
  drawSun();
  drawOrbitLines();
  drawPlanets();
  drawMoon();
  drawAsteroidBelt();
  drawRing();
  drawComet();
  drawStation();
}

function updateBodies() {
  for (let i = 0; i < planets.length; i++) {
    let p = planets[i];
    let angle = frameCount * p.orbitSpeed + p.angleOffset;

    p.x = cos(angle) * p.orbitRadius;
    p.z = sin(angle) * p.orbitRadius;
    p.y = p.yOffset;
  }

  let moonParent = planets[moonData.parentPlanet];
  let moonAngle = frameCount * moonData.orbitSpeed + moonData.angleOffset;
  moonData.x = moonParent.x + cos(moonAngle) * moonData.orbitRadius;
  moonData.z = moonParent.z + sin(moonAngle) * moonData.orbitRadius;
  moonData.y = moonParent.y + sin(moonAngle * 1.4) * 8;

  let cometAngle = frameCount * cometData.orbitSpeed + cometData.angleOffset;
  cometData.x = cos(cometAngle) * cometData.orbitRadiusX;
  cometData.z = sin(cometAngle) * cometData.orbitRadiusZ;
  cometData.y = cometData.yOffset + sin(frameCount * 0.02) * 24;

  let stationParent = planets[stationData.parentPlanet];
  let stationAngle = frameCount * stationData.orbitSpeed + stationData.angleOffset;
  stationData.x = stationParent.x + cos(stationAngle) * stationData.orbitRadius;
  stationData.z = stationParent.z + sin(stationAngle) * stationData.orbitRadius;
  stationData.y = stationParent.y + cos(stationAngle * 1.3) * 12;
  stationData.angle = stationAngle;
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

function drawMoon() {
  push();
  translate(moonData.x, moonData.y, moonData.z);
  rotateY(frameCount * 0.02);
  noStroke();
  texture(moonTex);
  sphere(moonData.size, 20, 16);
  pop();
}

function drawAsteroidBelt() {
  for (let i = 0; i < asteroids.length; i++) {
    let a = asteroids[i];
    let angle = frameCount * a.orbitSpeed + a.angleOffset;

    let x = cos(angle) * a.orbitRadius;
    let z = sin(angle) * a.orbitRadius;
    let y = a.yOffset;

    push();
    translate(x, y, z);
    rotateX(frameCount * a.spinX + a.rotX);
    rotateY(frameCount * a.spinY + a.rotY);
    rotateZ(frameCount * a.spinZ + a.rotZ);
    noStroke();
    texture(mercuryTex);

    if (a.shape === 'sphere') {
      sphere(a.size, 10, 8);
    } else if (a.shape === 'box') {
      box(a.size, a.size * 0.8, a.size * 1.2);
    } else if (a.shape === 'ellipsoid') {
      ellipsoid(a.size * 0.9, a.size * 0.6, a.size * 1.3, 10, 8);
    }

    pop();
  }
}

function drawRing() {
  let saturn = planets[ringData.parentPlanet];

  push();
  translate(saturn.x, saturn.y, saturn.z);
  rotateX(ringData.tiltX);
  rotateZ(ringData.tiltZ);
  rotateY(frameCount * 0.003);
  noStroke();

  push();
  texture(ringTex);
  torus(ringData.majorRadius, ringData.tubeRadius, 64, 20);
  pop();

  push();
  ambientMaterial(210, 180, 120);
  torus(ringData.majorRadius + 2, 1.3, 64, 12);
  pop();

  pop();
}

function drawComet() {
  push();
  translate(cometData.x, cometData.y, cometData.z);
  rotateZ(-PI / 6);
  rotateX(frameCount * 0.012);
  noStroke();
  texture(mercuryTex);
  cone(cometData.size * 0.6, cometData.size * 2.5, 20, 10);
  pop();

  push();
  translate(cometData.x - 28, cometData.y, cometData.z);
  noStroke();
  ambientMaterial(190, 225, 255);
  sphere(6, 10, 8);
  pop();

  push();
  translate(cometData.x - 55, cometData.y, cometData.z);
  noStroke();
  ambientMaterial(150, 200, 255);
  sphere(4, 8, 6);
  pop();
}

function drawStation() {
  push();
  translate(stationData.x, stationData.y, stationData.z);
  rotateY(-stationData.angle + HALF_PI);
  rotateZ(sin(frameCount * 0.02) * 0.12);
  scale(1.5);
  noStroke();

  for (let i = 0; i < stationParts.length; i++) {
    let part = stationParts[i];

    push();
    translate(part.tx, part.ty, part.tz);
    ambientMaterial(...part.material);

    if (part.shape === 'box') {
      box(part.sx, part.sy, part.sz);
    } else if (part.shape === 'cylinder') {
      cylinder(part.radius, part.height, 12, 4);
    } else if (part.shape === 'sphere') {
      sphere(part.radius, part.detailX, part.detailY);
    }

    pop();
  }

  pop();
}

function mouseClicked() {
  for (let i = 0; i < planets.length; i++) {
    planets[i].orbitRadius = random(90, 390);
    planets[i].angleOffset = random(TWO_PI);
    planets[i].yOffset = random(-90, 90);
    planets[i].spinOffset = random(TWO_PI);
  }

  for (let i = 0; i < asteroids.length; i++) {
    asteroids[i].orbitRadius = random(295, 350);
    asteroids[i].angleOffset = random(TWO_PI);
    asteroids[i].yOffset = random(-20, 20);
  }

  moonData.angleOffset = random(TWO_PI);

  cometData.orbitRadiusX = random(400, 520);
  cometData.orbitRadiusZ = random(200, 320);
  cometData.angleOffset = random(TWO_PI);

  stationData.orbitRadius = random(80, 110);
  stationData.angleOffset = random(TWO_PI);

  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}