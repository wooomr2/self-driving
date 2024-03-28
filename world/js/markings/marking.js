class Marking {
  constructor(center, directionVector, width, height) {
    this.center = center;
    this.directionVector = directionVector;
    this.width = width;
    this.height = height;

    this.support = new Segment(
      translate(center, angle(directionVector), height / 2),
      translate(center, angle(directionVector), -height / 2)
    );
    this.poly = new Envelope(this.support, width, 0).poly;

    this.type = MARKING_TYPE.MARKING;
  }

  static load(info) {
    const point = new Point(info.center.x, info.center.y);
    const direction = new Point(info.directionVector.x, info.directionVector.y);
    switch (info.type) {
      case MARKING_TYPE.CROSSING:
        return new Crossing(point, direction, info.width, info.height);
      case MARKING_TYPE.LIGHT:
        return new Light(point, direction, info.width, info.height);
      case MARKING_TYPE.MARKING:
        return new Marking(point, direction, info.width, info.height);
      case MARKING_TYPE.PARKING:
        return new Parking(point, direction, info.width, info.height);
      case MARKING_TYPE.START:
        return new Start(point, direction, info.width, info.height);
      case MARKING_TYPE.STOP:
        return new Stop(point, direction, info.width, info.height);
      case MARKING_TYPE.TARGET:
        return new Target(point, direction, info.width, info.height);
      case MARKING_TYPE.YIELD:
        return new Yield(point, direction, info.width, info.height);
    }
  }

  draw(ctx) {
    this.poly.draw(ctx, { color: COLOR.WHITE, width: 5 });
  }
}
