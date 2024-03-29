class Stop extends Marking {
  constructor(center, directionVector, width, height) {
    super(center, directionVector, width, height);

    this.type = MARKING_TYPE.STOP;

    this.border = this.poly.segments[2];
  }

  /** @override */
  draw(ctx) {
    // this.support.draw(ctx);
    // this.poly.draw(ctx);
    this.border.draw(ctx, { color: COLOR.WHITE, width: 5 });

    ctx.save();

    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(angle(this.directionVector) - Math.PI / 2);
    ctx.scale(1, 3);

    ctx.beginPath();
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = COLOR.WHITE;
    ctx.font = `bold ${this.height * 0.3}px Arial`;
    ctx.fillText("STOP", 0, 1);

    ctx.restore();
  }
}
