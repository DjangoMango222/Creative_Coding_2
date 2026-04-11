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

  orbitC