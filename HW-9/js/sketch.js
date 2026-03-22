let canvas;

let appleSprite;
let burgerSprite;
let obstacles;

let headImgs = {};
let bodyImgs = {};
let appleImg;
let burgerImg;

let snake = {
  x: 0,
  y: 0,
  size: 42,
  speed: 5,
  dir: "right"
};

let body = [];
let trail = [];
let trailSpacing = 14;

let score = 0;
let health = 100;
let level = 1;
let gameState = "menu";
let hitCooldown = 0;

let burgerDX = 3;
let burgerDY = 3;

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
  burgerImg = loadImage("images/fast-food-png-41613.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  textFont("Arial");

  if (typeof world !== "undefined") {
    world.gravity.y = 0;
  }

  setupKeyboard();
}

function setupKeyboard() {
  window.addEventListener(
    "keydown",
    (e) => {
      keys[e.code] = true;

      if (e.code === "Space" && gameState === "menu") {
        startGame();
      }

      if ((gameState === "win" || gameState === "lose") && e.code === "KeyR") {
        startGame();
      }

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

  if (gameState === "menu") {
    drawMenu();
    return;
  }

  if (gameState === "play") {
    runGame();
    return;
  }

  drawScene();
  drawEndScreen(gameState === "win" ? "YOU WIN" : "GAME OVER");
}

function drawMenu() {
  fill(255);
  textAlign(CENTER, CENTER);

  textSize(58);
  text("VentureSnake", width / 2, height / 2 - 60);

  textSize(24);
  text("Press SPACE to start", width / 2, height / 2 + 5);
  text("Use WASD or Arrow Keys to move", width / 2, height / 2 + 40);
  text("Eat apples, avoid the burger, hit 10 score to win", width / 2, height / 2 + 75);
}

function drawEndScreen(message) {
  fill(255);
  textAlign(CENTER, CENTER);

  textSize(56);
  text(message, width / 2, height / 2 - 20);

  textSize(24);
  text("Press R to restart", width / 2, height / 2 + 28);
}

function startGame() {
  score = 0;
  health = 100;
  level = 1;
  hitCooldown = 0;
  clearKeys();

  initSnake(3);
  setupLevel();

  gameState = "play";
}

function initSnake(segmentCount) {
  snake.x = width * 0.2;
  snake.y = height * 0.5;
  snake.size = 42;
  snake.speed = 5;
  snake.dir = "right";

  body = [];
  for (let i = 0; i < segmentCount; i++) {
    body.push({
      x: snake.x - (i + 1) * trailSpacing * 2,
      y: snake.y,
      img: bodyImgs.horizontal
    });
  }

  trail = [];
  for (let i = 0; i < 500; i++) {
    trail.push({ x: snake.x, y: snake.y });
  }
}

function setupLevel() {
  clearSprites();

  obstacles = new Group();

  let obstacleCount = level === 1 ? 3 : 4;

  for (let i = 0; i < obstacleCount; i++) {
    createObstacle();
  }

  appleSprite = new Sprite(0, 0, 30, 30);
  appleSprite.img = appleImg;
  appleSprite.scale = 0.4;
  appleSprite.collider = "static";
  placeApple();

  burgerSprite = new Sprite(0, 0, 60, 60);
  burgerSprite.img = burgerImg;
  burgerSprite.scale = 0.18;
  burgerSprite.collider = "kinematic";
  burgerSprite.rotationLock = true;
  placeBurger();

  let speed = level === 1 ? 3.2 : 4.8;
  burgerDX = random([-speed, speed]);
  burgerDY = random([-speed, speed]);
}

function clearSprites() {
  if (appleSprite) {
    appleSprite.remove();
    appleSprite = null;
  }

  if (burgerSprite) {
    burgerSprite.remove();
    burgerSprite = null;
  }

  if (obstacles) {
    while (obstacles.length > 0) {
      obstacles[0].remove();
    }
    obstacles = null;
  }
}

function createObstacle() {
  let placed = false;
  let tries = 0;

  while (!placed && tries < 300) {
    tries++;

    let w = random(120, 200);
    let h = 40;
    let x = random(220, width - 220);
    let y = random(140, height - 140);

    if (!obstacleAreaClear(x, y, w, h)) continue;

    let o = new Sprite(x, y, w, h);
    o.color = "gray";
    o.collider = "static";
    obstacles.add(o);
    placed = true;
  }
}

function obstacleAreaClear(x, y, w, h) {
  if (abs(x - snake.x) < w / 2 + 120 && abs(y - snake.y) < h / 2 + 120) {
    return false;
  }

  for (let i = 0; i < body.length; i++) {
    if (abs(x - body[i].x) < w / 2 + 60 && abs(y - body[i].y) < h / 2 + 60) {
      return false;
    }
  }

  if (obstacles) {
    for (let i = 0; i < obstacles.length; i++) {
      let o = obstacles[i];
      if (
        abs(x - o.x) < w / 2 + o.w / 2 + 40 &&
        abs(y - o.y) < h / 2 + o.h / 2 + 40
      ) {
        return false;
      }
    }
  }

  return true;
}

function runGame() {
  moveSnake();
  updateTrail();
  updateBody();

  moveBurger();
  animateSprites();

  checkApple();
  checkBurgerHit();

  drawScene();

  if (level === 1 && score >= 5) {
    level = 2;
    hitCooldown = 0;
    clearKeys();

    let keepLength = body.length;
    initSnake(max(keepLength, 3));
    setupLevel();
    return;
  }

  if (score >= 10) {
    gameState = "win";
    clearKeys();
  }

  if (health <= 0) {
    gameState = "lose";
    clearKeys();
  }
}

function drawScene() {
  if (obstacles || appleSprite || burgerSprite) {
    drawSprites();
  }

  drawSnake();
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

  if (dx < 0) snake.dir = "left";
  else if (dx > 0) snake.dir = "right";
  else if (dy < 0) snake.dir = "up";
  else if (dy > 0) snake.dir = "down";

  let newX = snake.x + dx;
  let newY = snake.y + dy;

  if (!hitsObstacle(newX, snake.y, 18, 18)) {
    snake.x = newX;
  }

  if (!hitsObstacle(snake.x, newY, 18, 18)) {
    snake.y = newY;
  }

  snake.x = constrain(snake.x, snake.size / 2, width - snake.size / 2);
  snake.y = constrain(snake.y, snake.size / 2, height - snake.size / 2);
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

function drawSnake() {
  for (let i = body.length - 1; i >= 0; i--) {
    image(body[i].img, body[i].x, body[i].y, snake.size, snake.size);
  }

  image(headImgs[snake.dir], snake.x, snake.y, snake.size, snake.size);
}

function animateSprites() {
  if (appleSprite) {
    appleSprite.rotation += 1.5;
  }

  if (burgerSprite) {
    burgerSprite.rotation += 3;
  }
}

function checkApple() {
  if (!appleSprite) return;

  if (dist(snake.x, snake.y, appleSprite.x, appleSprite.y) < 28) {
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
  if (!appleSprite) return;

  let ok = false;
  let tries = 0;

  while (!ok && tries < 300) {
    tries++;

    let testX = random(80, width - 80);
    let testY = random(80, height - 80);

    ok = true;

    if (dist(testX, testY, snake.x, snake.y) < 140) {
      ok = false;
    }

    if (hitsObstacle(testX, testY, 20, 20)) {
      ok = false;
    }

    for (let i = 0; i < body.length; i++) {
      if (dist(testX, testY, body[i].x, body[i].y) < 45) {
        ok = false;
        break;
      }
    }

    if (burgerSprite && dist(testX, testY, burgerSprite.x, burgerSprite.y) < 100) {
      ok = false;
    }

    if (ok) {
      appleSprite.x = testX;
      appleSprite.y = testY;
    }
  }

  if (!ok) {
    appleSprite.x = width * 0.7;
    appleSprite.y = height * 0.3;
  }
}

function placeBurger() {
  if (!burgerSprite) return;

  let ok = false;
  let tries = 0;

  while (!ok && tries < 300) {
    tries++;

    let testX = random(120, width - 120);
    let testY = random(120, height - 120);

    ok = true;

    if (dist(testX, testY, snake.x, snake.y) < 220) {
      ok = false;
    }

    if (hitsObstacle(testX, testY, 26, 26)) {
      ok = false;
    }

    if (appleSprite && dist(testX, testY, appleSprite.x, appleSprite.y) < 120) {
      ok = false;
    }

    if (ok) {
      burgerSprite.x = testX;
      burgerSprite.y = testY;
    }
  }

  if (!ok) {
    burgerSprite.x = width * 0.75;
    burgerSprite.y = height * 0.7;
  }
}

function moveBurger() {
  if (!burgerSprite) return;

  let half = 26;
  let nextX = burgerSprite.x + burgerDX;
  let nextY = burgerSprite.y + burgerDY;

  if (nextX < half || nextX > width - half || hitsObstacle(nextX, burgerSprite.y, half, half)) {
    burgerDX *= -1;
  } else {
    burgerSprite.x = nextX;
  }

  if (nextY < half || nextY > height - half || hitsObstacle(burgerSprite.x, nextY, half, half)) {
    burgerDY *= -1;
  } else {
    burgerSprite.y = nextY;
  }
}

function checkBurgerHit() {
  if (!burgerSprite) return;

  if (hitCooldown > 0) {
    hitCooldown--;
  }

  if (dist(snake.x, snake.y, burgerSprite.x, burgerSprite.y) < 34 && hitCooldown === 0) {
    health -= level === 1 ? 5 : 8;
    hitCooldown = 16;
  }
}

function hitsObstacle(testX, testY, halfW, halfH) {
  if (!obstacles) return false;

  for (let i = 0; i < obstacles.length; i++) {
    let o = obstacles[i];
    let oHalfW = o.w / 2;
    let oHalfH = o.h / 2;

    if (
      abs(testX - o.x) < halfW + oHalfW &&
      abs(testY - o.y) < halfH + oHalfH
    ) {
      return true;
    }
  }

  return false;
}

function drawHUD() {
  fill(255);
  textAlign(LEFT, TOP);
  textSize(28);
  text("Score: " + score, 20, 20);
  text("Health: " + health, 20, 55);
  text("Level: " + level, 20, 90);
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

  snake.x = constrain(snake.x, snake.size / 2, width - snake.size / 2);
  snake.y = constrain(snake.y, snake.size / 2, height - snake.size / 2);

  if (appleSprite) {
    appleSprite.x = constrain(appleSprite.x, 30, width - 30);
    appleSprite.y = constrain(appleSprite.y, 30, height - 30);
  }

  if (burgerSprite) {
    burgerSprite.x = constrain(burgerSprite.x, 30, width - 30);
    burgerSprite.y = constrain(burgerSprite.y, 30, height - 30);
  }
}