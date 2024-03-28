class Light extends Marking {
  constructor(center, directionVector, width, height = 10) {
    super(center, directionVector, width, 18);

    this.type = MARKING_TYPE.LIGHT;

    this.state = LIGHT_STATE.OFF;
    this.border = this.poly.segments[0];
  }

  draw(ctx) {
    const perp = perpendicular(this.directionVector);
    const line = new Segment(
      add(this.center, scale(perp, this.width / 2)),
      add(this.center, scale(perp, -this.width / 2))
    );

    const green = lerp2D(line.p1, line.p2, 0.2);
    const yellow = lerp2D(line.p1, line.p2, 0.5);
    const red = lerp2D(line.p1, line.p2, 0.8);

    new Segment(red, green).draw(ctx, { width: this.height, cap: "round" });

    const size = this.height * 0.6;

    green.draw(ctx, { size: size, color: "#060" });
    yellow.draw(ctx, { size: size, color: "#660" });
    red.draw(ctx, { size: size, color: "#600" });

    switch (this.state) {
      case LIGHT_STATE.GREEN:
        green.draw(ctx, { size: size, color: "#0F0" });
        break;
      case LIGHT_STATE.YELLOW:
        yellow.draw(ctx, { size: size, color: "#FF0" });
        break;
      case LIGHT_STATE.RED:
        red.draw(ctx, { size: size, color: "#F00" });
        break;
    }
  }
}
