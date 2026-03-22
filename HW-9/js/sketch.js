let canvas;

let headImgs = {};
let bodyImgs = {};
let appleImg;

let snake = {
  x: 0,
  y: 0,
  size: 42,
  speed: 4.5,
  dir: "right"
};

let body = [];
let trail = [];
let trailSpacing = 14;

let apple = {
  x: 0,
  y: 0,
  size: 30
};

let score = 0;
const keys = Object.create(null);

function preload() {
  headImgs.up = loadImage("images/snake-head-up.png");
  headImgs.down = loadImage("images/snake-head-down.png");
  headImgs.left = loadImage("images/snake-head-left.png");
  headImgs.right = loadImage("images/snake-head-right.png");

  bodyImgs.horizontal = loadImage("images/snake-body-left-to-right.png");
  bodyImgs.vertical = loadImage("images/snake-body-up-to-down.png");
  bodyImgs.upRight = loadImage("images/snake-body-up-to-right-curve.png");
  bodyImgs.upLeft = loadImage("images/snake-body-up-to-left-curve.png");
  bodyImgs.downRight = loadImage("images/snake-body-down-to-right-curve.png");
  bodyImgs.downLeft = loadImage("images/snake-body-down-to-left-curve.png");

  appleImg = loadImage("images/apple.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  textFont("Arial");

  setupKeyboard();
  resetTest();
}

function resetTest() {
  snake.x = width * 0.35;
  snake.y = height * 0.5;
  snake.dir = "right";

  body = [];
  for (let i = 0; i < 3; i++) {
    body.push({
      x: snake.x - (i + 1) * trailSpacing * 2,
      y: snake.y,
      img: bodyImgs.horizontal
    });
  }

  trail = [];
  for (let i = 0; i < 400; i++) {
    trail.push({ x: snake.x, y: snake.y });
  }

  score = 0;
  placeApple();
}

function setupKeyboard() {
  window.addEventListener(
    "keydown",
    (e) => {
      keys[e.code] = true;

      if (
        e.code === "ArrowLeft" ||
        e.code === "ArrowRight" ||
        e.code === "ArrowUp" ||
        e.code === "ArrowDown" ||
        e.code === "KeyW" ||
        e.code === "KeyA" ||
        e.code === "KeyS" ||
        e.code === "KeyD" ||
        e.code === "Space"
      ) {
        e.preventDefault();
      }

      if (e.code === "KeyR") {
        resetTest();
      }
    },
    { passive: false }
  );

  window.addEventListener("keyup", (e) => {
    keys[e.code] = false;
  });

  window.addEventListener("blur", clearKeys);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearKeys();
  });
}

function clearKeys() {
  for (let k in keys) {
    keys[k] = false;
  }
}

function draw() {
  background(25);

  moveSnake();
  updateTrail();
  updateBody();
  checkApple();

  drawApple();
  drawBody();
  drawHead();
  drawHUD();
}

function moveSnake() {
  let dx = 0;
  let dy = 0;

  if (isLeftDown()) dx -= snake.speed;
  if (isRightDown()) dx += snake.speed;
  if (isUpDown()) dy -= snake.speed;
  if (isDownDown()) dy += snake.speed;

  if (dx !== 0 && dy !== 0) {
    dx *= 0.7071;
    dy *= 0.7071;
  }

  snake.x += dx;
  snake.y += dy;

  snake.x = constrain(snake.x, snake.size / 2, width - snake.size / 2);
  snake.y = constrain(snake.y, snake.size / 2, height - snake.size / 2);

  if (abs(dx) > abs(dy) && abs(dx) > 0) {
    snake.dir = dx > 0 ? "right" : "left";
  } else if (abs(dy) > 0) {
    snake.dir = dy > 0 ? "down" : "up";
  }
}

function updateTrail() {
  trail.unshift({ x: snake.x, y: snake.y });

  let maxTrail = (body.length + 8) * trailSpacing + 40;
  while (trail.length > maxTrail) {
    trail.pop();
  }
}

function updateBody() {
  for (let i = 0; i < body.length; i++) {
    let idx = (i + 1) * trailSpacing;

    let prev = trail[max(0, idx - trailSpacing)] || trail[0];
    let curr = trail[idx] || trail[trail.length - 1];
    let next = trail[min(trail.length - 1, idx + trailSpacing)] || curr;

    body[i].x = curr.x;
    body[i].y = curr.y;
    body[i].img = getBodyImage(prev, curr, next);
  }
}

function getBodyImage(prev, curr, next) {
  let d1 = directionBetween(prev, curr, snake.dir);
  let d2 = directionBetween(curr, next, d1);

  let hasLeft = d1 === "left" || d2 === "left";
  let hasRight = d1 === "right" || d2 === "right";
  let hasUp = d1 === "up" || d2 === "up";
  let hasDown = d1 === "down" || d2 === "down";

  if ((hasLeft || hasRight) && !(hasUp || hasDown)) {
    return bodyImgs.horizontal;
  }

  if ((hasUp || hasDown) && !(hasLeft || hasRight)) {
    return bodyImgs.vertical;
  }

  if (hasUp && hasRight) return bodyImgs.upRight;
  if (hasUp && hasLeft) return bodyImgs.upLeft;
  if (hasDown && hasRight) return bodyImgs.downRight;
  if (hasDown && hasLeft) return bodyImgs.downLeft;

  return bodyImgs.horizontal;
}

function directionBetween(a, b, fallback) {
  let dx = b.x - a.x;
  let dy = b.y - a.y;

  if (abs(dx) > abs(dy) && abs(dx) > 0.2) {
    return dx > 0 ? "right" : "left";
  }

  if (abs(dy) > 0.2) {
    return dy > 0 ? "down" : "up";
  }

  return fallback;
}

function checkApple() {
  if (dist(snake.x, snake.y, apple.x, apple.y) < 28) {
    score++;
    addBodySegment();
    placeApple();
  }
}

function addBodySegment() {
  let last = body.length > 0 ? body[body.length - 1] : { x: snake.x, y: snake.y };

  body.push({
    x: last.x,
    y: last.y,
    img: bodyImgs.horizontal
  });
}

function placeApple() {
  let ok = false;
  let tries = 0;

  while (!ok && tries < 200) {
    tries++;

    let testX = random(80, width - 80);
    let testY = random(80, height - 80);

    ok = dist(testX, testY, snake.x, snake.y) > 140;

    for (let i = 0; i < body.length; i++) {
      if (dist(testX, testY, body[i].x, body[i].y) < 50) {
        ok = false;
        break;
      }
    }

    if (ok) {
      apple.x = testX;
      apple.y = testY;
    }
  }

  if (!ok) {
    apple.x = width * 0.7;
    apple.y = height * 0.5;
  }
}

function drawApple() {
  image(appleImg, apple.x, apple.y, apple.size, apple.size);
}

function drawBody() {
  for (let i = body.length - 1; i >= 0; i--) {
    image(body[i].img, body[i].x, body[i].y, snake.size, snake.size);
  }
}

function drawHead() {
  image(headImgs[snake.dir], snake.x, snake.y, snake.size, snake.size);
}

function drawHUD() {
  fill(255);
  textAlign(LEFT, TOP);
  textSize(28);
  text("Score: " + score, 20, 20);

  textSize(18);
  text("Animation Test Build", 20, 58);
  text("Eat apples to grow", 20, 82);
  text("Press R to reset", 20, 106);
}

function isLeftDown() {
  return keys["ArrowLeft"] || keys["KeyA"];
}

function isRightDown() {
  return keys["ArrowRight"] || keys["KeyD"];
}

function isUpDown() {
  return keys["ArrowUp"] || keys["KeyW"];
}

function isDownDown() {
  return keys["ArrowDown"] || keys["KeyS"];
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}