// food.js
class Food {
  constructor(x, y, size, color) {
    this.x = x;       // x position
    this.y = y;       // y position
    this.size = size; // size of the food
    this.color = color; // fill color
  }

  display() {
    push();
    translate(this.x, this.y);

    noStroke();

    // Main shape (circle)
    fill(this.color);
    ellipse(0, 0, this.size);

    // Optional second shape (rectangle) for variation
    fill(255, 255, 255, 150);
    rectMode(CENTER);
    rect(0, -this.size / 4, this.size / 3, this.size / 2);

    pop();
  }
}