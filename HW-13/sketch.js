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

  planets = [
    makePlanet(95, 13, 0.020, bodyTextures.mercury, -18),
    makePlanet(145, 20, 0.015, bodyTextures.venus, 12),
    makePlanet(205, 25, 0.011, bodyTextures.earth, -10),
    makePlanet(275, 19, 0.008, bodyTextures.mars, 18),
    makePlanet(360, 40, 0.005, bodyTextures.jupiter, -4)
  ];

  moonData = {
    parent: 2,
    orbitRadius: 48,
    size: 8,
    speed: 0.05,
    offset: random(TWO_PI)
  };

  cometData = {
    rx: 470,
    rz: 255,
    size: 18,
    speed: 0.012,
    offset: random(TWO_PI),
    y: -110
  };

  ringData = {
    parent: 4,
    major: 72,
    tube: 4,
    tiltX: 1.18,
    tiltZ: 0.28
  };

  stationData = {
    parent: 2,
    radius: 95,
    speed: 0.018,
    offset: random(TWO_PI)
  };

  stationParts = [
    { type: 'box', pos: [0,0,0], size:[24,10,10], col:[185] },
    { type: 'cylinder', pos:[0,0,0], r:2, h:40, col:[130] },
    { type: 'box', pos:[-26,0,0], size:[24,2,12], col:[70,120,220] },
    { type: 'box', pos:[26,0,0], size:[24,2,12], col:[70,120,220] },
    { type: 'sphere', pos:[0,-10,0], r:4, col:[220] },
    { type: 'box', pos:[0,10,0], size:[8,4,8], col:[160] }
  ];

  let shapes = ['sphere','box','ellipsoid'];

  for (let i = 0; i < 18; i++) {
    asteroids.push({
      radius: random(300, 330),
      offset: map(i,0,18,0,TWO_PI) + random(-0.08,0.08),
      speed: random(0.004,0.007),
      y: random(-10,10),
      size: random(14,22), // 🔥 bigger = visible
      shape: random(shapes),
      rx: random(TWO_PI),
      ry: random(TWO_PI),
      rz: random(TWO_PI),
      sx: random(0.005,0.02),
      sy: random(0.005,0.02),
      sz: random(0.005,0.02)
    });
  }
}

function makePlanet(r,s,sp,tex,y) {
  return {
    r:r, size:s, speed:sp, tex:tex, y:y,
    offset: random(TWO_PI),
    spin: random(0.01,0.025),
    x:0,yPos:0,z:0
  };
}

function draw() {
  background(5);

  orbitControl();

  ambientLight(90);
  pointLight(255,200,120,0,0,0);

  drawBackground();
  updateBodies();
  drawSun();
  drawPlanets();
  drawMoon();
  drawAsteroids();
  drawRing();
  drawComet();
  drawStation();
}

function updateBodies() {
  for (let p of planets) {
    let a = frameCount * p.speed + p.offset;
    p.x = cos(a)*p.r;
    p.z = sin(a)*p.r;
    p.yPos = p.y;
  }
}

function drawBackground() {
  push();
  translate(0,0,-1200);
  texture(spaceTex);
  noStroke();
  plane(3000,2000);
  pop();
}

function drawSun() {
  push();
  emissiveMaterial(255,200,90);
  texture(sunTex);
  rotateY(frameCount*0.004);
  sphere(60,32,24);
  pop();
}

function drawPlanets() {
  for (let p of planets) {
    push();
    translate(p.x,p.yPos,p.z);
    rotateY(frameCount*p.spin);
    texture(p.tex);
    noStroke();
    sphere(p.size,28,20);
    pop();
  }
}

function drawMoon() {
  let p = planets[moonData.parent];
  let a = frameCount*moonData.speed + moonData.offset;

  let x = p.x + cos(a)*moonData.orbitRadius;
  let z = p.z + sin(a)*moonData.orbitRadius;
  let y = p.yPos;

  push();
  translate(x,y,z);
  texture(moonTex);
  sphere(moonData.size);
  pop();
}

function drawAsteroids() {
  for (let a of asteroids) {
    let ang = frameCount*a.speed + a.offset;

    let x = cos(ang)*a.radius;
    let z = sin(ang)*a.radius;

    push();
    translate(x,a.y,z);
    rotateX(frameCount*a.sx + a.rx);
    rotateY(frameCount*a.sy + a.ry);
    rotateZ(frameCount*a.sz + a.rz);

    texture(mercuryTex);
    noStroke();

    if (a.shape==='sphere') sphere(a.size);
    if (a.shape==='box') box(a.size);
    if (a.shape==='ellipsoid') ellipsoid(a.size,a.size*0.7,a.size*1.2);

    pop();
  }
}

function drawRing() {
  let p = planets[ringData.parent];

  push();
  translate(p.x,p.yPos,p.z);
  rotateX(ringData.tiltX);
  rotateZ(ringData.tiltZ);
  texture(ringTex);
  torus(ringData.major,ringData.tube,64,20);
  pop();
}

function drawComet() {
  let a = frameCount*cometData.speed + cometData.offset;

  let x = cos(a)*cometData.rx;
  let z = sin(a)*cometData.rz;

  push();
  translate(x,cometData.y,z);
  rotateZ(-PI/6);
  texture(mercuryTex);
  cone(cometData.size*0.6,cometData.size*2);
  pop();
}

function drawStation() {
  let p = planets[stationData.parent];
  let a = frameCount*stationData.speed + stationData.offset;

  let x = p.x + cos(a)*stationData.radius;
  let z = p.z + sin(a)*stationData.radius;
  let y = p.yPos;

  push();
  translate(x,y,z);
  rotateY(-a);

  for (let part of stationParts) {
    push();
    translate(...part.pos);
    ambientMaterial(...part.col);

    if (part.type==='box') box(...part.size);
    if (part.type==='cylinder') cylinder(part.r,part.h);
    if (part.type==='sphere') sphere(part.r);

    pop();
  }

  pop();
}

function mouseClicked() {
  for (let p of planets) {
    p.r = random(90,390);
    p.offset = random(TWO_PI);
  }

  for (let a of asteroids) {
    a.radius = random(300,330);
    a.offset = random(TWO_PI);
  }
}