// food.js
class Food {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }

  display() {
    push();
    translate(this.x, this.y);

    noStroke();

    // Main shape (circle)
    fill(this.color);
    ellipse(0, 0, this.size);

    // Optional second shape for variation
    fill(255, 255, 255, 150);
    rectMode(CENTER);
    rect(0, -this.size / 4, this.size / 3, this.size / 2);

    pop();
  }
}