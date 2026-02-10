
/* Reflection Django Behunin
I used DALL·E to generate one image for this project. I chose DALL·E because it was
easy to use and helped me create an image related to my favorite food. I typed a
prompt describing the food in a colorful and playful style. The image turned out
slightly more exaggerated than expected, but it's fine.
*/
// ----------------------------------

let img1, img2, imgAI;

let x = 0;
let movingRight = true;

function preload() {
  img1 = loadImage("Assets/images/women-image1.jpg");
  img2 = loadImage("Assets/images/women-image2.jpg");
  imgAI = loadImage("Assets/images/dalle-pizza.jpg");

}

function setup() {
  createCanvas(800, 600);
  setInterval(changeDirection, 2000);
}

function draw() {
  background(240);

  textSize(40);
  fill(50);
  text("Everyone's favorite dish!", 50, 60);

  textSize(18);
  text("Django Behunin", 50, 90);

  image(img1, 50, 150, 200, 200);
  image(img2, 300, 150, 200, 200);

  image(imgAI, x, 420, 150, 150);

  if (movingRight) {
    x += 1;
  } else {
    x -= 1;
  }
}

function changeDirection() {
  movingRight = !movingRight;
}
