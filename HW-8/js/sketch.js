// Images
let playerImg, goodFoodImg, badFoodImg;

// Sounds
let bgMusic, goodSound, badSound;
let musicStarted = false;

// Player and food
let player;
let goodFood;
let badFood;

// Score and health
let score = 0;
let health = 100;

function preload() {

  // Images
  playerImg = loadImage("images/player.png");
  goodFoodImg = loadImage("images/goodfood.png");
  badFoodImg = loadImage("images/badfood.png");

  // Sounds
  bgMusic = loadSound("sounds/music.mp3");
  goodSound = loadSound("sounds/good.wav");
  badSound = loadSound("sounds/bad.wav");

}

function setup() {

  createCanvas(600,400);
  imageMode(CENTER);

  player = createVector(width/2,height/2);

  goodFood = createVector(random(width),random(height));
  badFood = createVector(random(width),random(height));

}

function draw() {

  background(100,150,200);

  movePlayer();

  image(playerImg,player.x,player.y,50,50);
  image(goodFoodImg,goodFood.x,goodFood.y,40,40);
  image(badFoodImg,badFood.x,badFood.y,40,40);

  checkCollisions();
  drawUI();
  checkGameOver();

}

function movePlayer(){

  if(keyIsDown(LEFT_ARROW)) player.x -=5;
  if(keyIsDown(RIGHT_ARROW)) player.x +=5;
  if(keyIsDown(UP_ARROW)) player.y -=5;
  if(keyIsDown(DOWN_ARROW)) player.y +=5;

  if(keyIsDown(65)) player.x -=5; //A
  if(keyIsDown(68)) player.x +=5; //D
  if(keyIsDown(87)) player.y -=5; //W
  if(keyIsDown(83)) player.y +=5; //S

  player.x = constrain(player.x,25,width-25);
  player.y = constrain(player.y,25,height-25);

}

function checkCollisions(){

  if(dist(player.x,player.y,goodFood.x,goodFood.y) < 40){

    score +=10;
    goodSound.play();

    goodFood = createVector(random(width),random(height));

  }

  if(dist(player.x,player.y,badFood.x,badFood.y) < 40){

    health -=10;
    badSound.play();

    badFood = createVector(random(width),random(height));

  }

}

function drawUI(){

  fill(255);
  textSize(20);

  text("Score: " + score,20,30);
  text("Health: " + health,20,60);

}

function mousePressed(){

  if(!musicStarted){

    bgMusic.loop();
    musicStarted = true;

  }

}

function checkGameOver(){

  if(health <=0){

    textAlign(CENTER,CENTER);
    textSize(50);
    fill(255,0,0);

    text("GAME OVER",width/2,height/2);

    noLoop();

  }

}
