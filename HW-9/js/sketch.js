let canvas;
let keys = {};

let player = {
  x: 200,
  y: 200,
  size: 40,
  speed: 6
};

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  // make canvas focusable
  canvas.elt.tabIndex = 0;
  canvas.elt.style.outline = "none";
  canvas.elt.focus();

  // click game to refocus it
  canvas.mousePressed(() => {
    canvas.elt.focus();
  });

  textFont("Arial");
}

function draw() {
  background(20);

  movePlayer();

  fill(255);
  textSize(28);
  textAlign(LEFT, TOP);
  text("INPUT TEST", 20, 20);
  textSize(20);
  text("Click inside the game once, then use WASD or Arrow Keys", 20, 60);
  text("If this green circle moves, keyboard input is working.", 20, 90);

  text("A: " + !!keys["a"], 20, 140);
  text("D: " + !!keys["d"], 20, 170);
  text("W: " + !!keys["w"], 20, 200);
  text("S: " + !!keys["s"], 20, 230);

  text("Left: " + !!keys["arrowleft"], 140, 140);
  text("Right: " + !!keys["arrowright"], 140, 170);
  text("Up: " + !!keys["arrowup"], 140, 200);
  text("Down: " + !!keys["arrowdown"], 140, 230);

  fill(0, 255, 120);
  noStroke();
  circle(player.x, player.y, player.size);
}

function movePlayer() {
  let dx = 0;
  let dy = 0;

  if (keys["a"] || keys["arrowleft"]) dx -= player.speed;
  if (keys["d"] || keys["arrowright"]) dx += player.speed;
  if (keys["w"] || keys["arrowup"]) dy -= player.speed;
  if (keys["s"] || keys["arrowdown"]) dy += player.speed;

  if (dx !== 0 && dy !== 0) {
    dx *= 0.7071;
    dy *= 0.7071;
  }

  player.x += dx;
  player.y += dy;

  player.x = constrain(player.x, player.size / 2, width - player.size / 2);
  player.y = constrain(player.y, player.size / 2, height - player.size / 2);
}

function keyPressed() {
  keys[key.toLowerCase()] = true;

  if (
    keyCode === LEFT_ARROW ||
    keyCode === RIGHT_ARROW ||
    keyCode === UP_ARROW ||
    keyCode === DOWN_ARROW ||
    key === " "
  ) {
    return false;
  }
}

function keyReleased() {
  keys[key.toLowerCase()] = false;

  if (
    keyCode === LEFT_ARROW ||
    keyCode === RIGHT_ARROW ||
    keyCode === UP_ARROW ||
    keyCode === DOWN_ARROW ||
    key === " "
  ) {
    return false;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}