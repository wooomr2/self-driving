class Camera {
  constructor({ x, y, angle }, range = 100) {
    this.range = range;
    this.move({ x, y, angle });
  }

  move({ x, y, angle }) {
    this.x = x;
    this.y = y;
    this.z = -20;
    this.angle = angle;
    this.center = new Point(this.x, this.y);
    this.tip = new Point(
      this.x - this.range * Math.sin(this.angle),
      this.y - this.range * Math.cos(this.angle)
    );
    this.left = new Point(
      this.x - this.range * Math.sin(this.angle - Math.PI / 4),
      this.y - this.range * Math.cos(this.angle - Math.PI / 4)
    );
    this.right = new Point(
      this.x - this.range * Math.sin(this.angle + Math.PI / 4),
      this.y - this.range * Math.cos(this.angle + Math.PI / 4)
    );
    this.poly = new Polygon([this.center, this.left, this.right]);
  }

  draw(ctx) {
    // this.center.draw(ctx, { color: "red" });
    // this.tip.draw(ctx);
    this.poly.draw(ctx);
  }
}
