class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get coordinate() {
    return { x: this.x, y: this.y };
  }
}
