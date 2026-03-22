let appleSprite;
let burgerSprite;
let obstacles;

let headImgs = {};
let bodyImgs = {};
let appleImg;
let burgerImg;

let snake;
let body = [];
let trail = [];

let score = 0;
let health = 100;
let level = 1;
let gameState = "menu";
let hitCooldown = 0;

let burgerDX = 3;
let burgerDY = 3;

const keys = {};
const trailSpacing = 14;

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
  createCanvas(windowWidth, windowHeight);
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

      if (gameState === "menu" && e.code === "Space") {
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

  drawWorld();
  drawEndScreen(gameState === "win" ? "YOU WIN" : "GAME OVER");
}

function drawMenu() {
  fill(255);
  textAlign(CENTER, CENTER);

  textSize(56);
  text("VentureSnake", width / 2, height / 2 - 55);

  textSize(24);
  text("Press SPACE to start", width / 2, height / 2 + 10);
  text("Use WASD or Arrow Keys to move", width / 2, height / 2 + 45);
  text("Eat apples and avoid the burger", width / 2, height / 2 + 80);
}

function drawEndScreen(message) {
  fill(255);
  textAlign(CENTER, CENTER);

  textSize(52);
  text(message, width / 2, height / 2 - 10);

  textSize(24);
  text("Press R to restart", width / 2, height / 2 + 30);
}

function startGame() {
  score = 0;
  health = 100;
  level = 1;
  hitCooldown = 0;
  clearKeys();

  resetSnake(3);
  buildLevel();

  gameState = "play";
}

function resetSnake(segmentCount) {
  snake = {
    x: width * 0.2,
    y: height * 0.5,
    size: 42,
    speed: 5,
    dir: "right"
  };

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

function buildLevel() {
  if (appleSprite) appleSprite.remove();
  if (burgerSprite) burgerSprite.remove();

  if (obstacles) {
    while (obstacles.length > 0) {
      obstacles[0].remove();
    }
  }

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

function createObstacle() {
  let tries = 0;
  let placed = false;

  while (!placed && tries < 200) {
    tries++;

    let x = random(220, width - 220);
    let y = random(140, height - 140);
    let w = random(120, 190);
    let h = 40;

    if (abs(x - snake.x) < 150 && abs(y - snake.y) < 150) continue;

    let blocked = false;
    for (let i = 0; i < obstacles.length; i++) {
      let o = obstacles[i];
      if (
        abs(x - o.x) < w / 2 + o.w / 2 + 30 &&
        abs(y - o.y) < h / 2 + o.h / 2 + 30
      ) {
        blocked = true;
        break;
      }
    }

    if (!blocked) {
      let o = new Sprite(x, y, w, h);
      o.color = "gray";
      o.collider = "static";
      obstacles.add(o);
      placed = true;
    }
  }
}

function runGame() {
  moveSnake();
  updateTrail();
  updateBody();
  moveBurger();
  checkApple();
  checkBurger();
  animateSprites();

  drawWorld();

  if (level === 1 && score >= 5) {
    level = 2;
    hitCooldown = 0;
    resetSnake(body.length);
    buildLevel();
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

function drawWorld() {
  drawSprites();
  drawSnake();
  drawHUD();
}

function moveSnake() {
  let dx = 0;
  let dy = 0;

  if (keys["ArrowLeft"] || keys["KeyA"]) dx -= snake.speed;
  if (keys["ArrowRight"] || keys["KeyD"]) dx += snake.speed;
  if (keys["ArrowUp"] || keys["KeyW"]) dy -= snake.speed;
  if (keys["ArrowDown"] || keys["KeyS"]) dy += snake.speed;

  if (dx !== 0 && dy !== 0) {
    dx *= 0.7071;
    dy *= 0.7071;
  }

  if (dx < 0) snake.dir = "left";
  else if (dx > 0) snake.dir = "right";
  else if (dy < 0) snake.dir = "up";
  else if (dy > 0) snake.dir = "down";

  let nextX = snake.x + dx;
  let nextY = snake.y + dy;

  if (!hitsObstacle(nextX, snake.y, 18, 18)) {
    snake.x = nextX;
  }

  if (!hitsObstacle(snake.x, nextY, 18, 18)) {
    snake.y = nextY;
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
    body[i].img = chooseBodyImage(prev, curr, next);
  }
}

function chooseBodyImage(prev, curr, next) {
  let d1 = getDirection(prev, curr, snake.dir);
  let d2 = getDirection(curr, next, d1);

  let left = d1 === "left" || d2 === "left";
  let right = d1 === "right" || d2 === "right";
  let up = d1 === "up" || d2 === "up";
  let down = d1 === "down" || d2 === "down";

  if ((left || right) && !(up || down)) return bodyImgs.horizontal;
  if ((up || down) && !(left || right)) return bodyImgs.vertical;
  if (up && right) return bodyImgs.upRight;
  if (up && left) return bodyImgs.upLeft;
  if (down && right) return bodyImgs.downRight;
  if (down && left) return bodyImgs.downLeft;

  return bodyImgs.horizontal;
}

function getDirection(a, b, fallback) {
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

function checkApple() {
  let d = dist(snake.x, snake.y, appleSprite.x, appleSprite.y);

  if (d < 32) {
    score++;

    let last = body.length > 0 ? body[body.length - 1] : { x: snake.x, y: snake.y };
    body.push({
      x: last.x,
      y: last.y,
      img: bodyImgs.horizontal
    });

    placeApple();
  }
}

function checkBurger() {
  if (hitCooldown > 0) {
    hitCooldown--;
  }

  let d = dist(snake.x, snake.y, burgerSprite.x, burgerSprite.y);

  if (d < 40 && hitCooldown === 0) {
    health -= level === 1 ? 5 : 8;
    hitCooldown = 16;
  }
}

function moveBurger() {
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

function animateSprites() {
  appleSprite.scale = 0.36 + 0.05 * sin(frameCount * 0.12);
  burgerSprite.rotation += 3;
}

function placeApple() {
  let tries = 0;
  let placed = false;

  while (!placed && tries < 200) {
    tries++;

    let x = random(80, width - 80);
    let y = random(80, height - 80);

    if (dist(x, y, snake.x, snake.y) < 140) continue;
    if (burgerSprite && dist(x, y, burgerSprite.x, burgerSprite.y) < 120) continue;
    if (hitsObstacle(x, y, 20, 20)) continue;

    let onBody = false;
    for (let i = 0; i < body.length; i++) {
      if (dist(x, y, body[i].x, body[i].y) < 40) {
        onBody = true;
        break;
      }
    }
    if (onBody) continue;

    appleSprite.x = x;
    appleSprite.y = y;
    placed = true;
  }

  if (!placed) {
    appleSprite.x = width * 0.7;
    appleSprite.y = height * 0.3;
  }
}

function placeBurger() {
  let tries = 0;
  let placed = false;

  while (!placed && tries < 200) {
    tries++;

    let x = random(120, width - 120);
    let y = random(120, height - 120);

    if (dist(x, y, snake.x, snake.y) < 220) continue;
    if (appleSprite && dist(x, y, appleSprite.x, appleSprite.y) < 120) continue;
    if (hitsObstacle(x, y, 26, 26)) continue;

    burgerSprite.x = x;
    burgerSprite.y = y;
    placed = true;
  }

  if (!placed) {
    burgerSprite.x = width * 0.75;
    burgerSprite.y = height * 0.7;
  }
}

function hitsObstacle(testX, testY, halfW, halfH) {
  if (!obstacles) return false;

  for (let i = 0; i < obstacles.length; i++) {
    let o = obstacles[i];

    if (
      abs(testX - o.x) < halfW + o.w / 2 &&
      abs(testY - o.y) < halfH + o.h / 2
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  if (snake) {
    snake.x = constrain(snake.x, snake.size / 2, width - snake.size / 2);
    snake.y = constrain(snake.y, snake.size / 2, height - snake.size / 2);
  }

  if (appleSprite) {
    appleSprite.x = constrain(appleSprite.x, 30, width - 30);
    appleSprite.y = constrain(appleSprite.y, 30, height - 30);
  }

  if (burgerSprite) {
    burgerSprite.x = constrain(burgerSprite.x, 30, width - 30);
    burgerSprite.y = constrain(burgerSprite.y, 30, height - 30);
  }
}