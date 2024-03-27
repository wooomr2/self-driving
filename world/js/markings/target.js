class Target extends Marking {
  constructor(center, directionVector, width, height) {
    super(center, directionVector, width, height);
  }

  draw(ctx) {
    this.center.draw(ctx, { color: COLOR.RED, size: 30 });
    this.center.draw(ctx, { color: COLOR.WHITE, size: 20 });
    this.center.draw(ctx, { color: COLOR.RED, size: 10 });
  }
}
