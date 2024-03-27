class Parking extends Marking {
  constructor(center, directionVector, width, height) {
    super(center, directionVector, width, height);

    this.borders = [this.poly.segments[0], this.poly.segments[2]];
  }

  draw(ctx) {
    for (const border of this.borders) {
      border.draw(ctx, { color: COLOR.WHITE, width: 5 });
    }

    ctx.save();
    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(angle(this.directionVector));

    ctx.beginPath();
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = COLOR.WHITE;
    ctx.font = `bold ${this.height * 0.9}px Arial`;
    ctx.fillText("P", 0, 3);

    ctx.restore();
  }
}
