class Crossing extends Marking {
  constructor(center, directionVector, width, height) {
    super(center, directionVector, width, height);

    this.type = MARKING_TYPE.CROSSING;

    this.borders = [this.poly.segments[0], this.poly.segments[2]];
  }

  draw(ctx) {
    const perp = perpendicular(this.directionVector);
    const line = new Segment(
      add(this.center, scale(perp, this.width / 2)),
      add(this.center, scale(perp, -this.width / 2))
    );
    line.draw(ctx, { color: COLOR.WHITE, width: this.height, dash: [11, 11] });

    // for (const border of this.borders) {
    //   border.draw(ctx);
    // }
  }
}
