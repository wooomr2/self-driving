class Tree {
  constructor(center, size, height = PRE_DEFINES.TREE_HEIGHT) {
    this.center = center;
    this.size = size; // size of the base
    this.height = height;
    this.base = this.#generateLevel(center, size);
  }

  #generateLevel(point, size) {
    const points = [];
    const radius = size / 2;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
      const kindOfRandom = Math.cos(((a + this.center.x) * size) % 17) ** 2;
      const noisyRadius = radius * lerp(0.55, 1, kindOfRandom);
      points.push(translate(point, a, noisyRadius));
    }

    return new Polygon(points);
  }

  draw(ctx, viewPoint) {
    const top = getFake3dPoint(this.center, viewPoint, this.height);

    const levelCount = 7;
    for (let level = 0; level < levelCount; level++) {
      const t = level / (levelCount - 1);
      const point = lerp2D(this.center, top, t);
      const color = `rgb(30, ${lerp(50, 200, t)}, 70)`;
      const size = lerp(this.size, 40, t);

      const poly = this.#generateLevel(point, size);
      poly.draw(ctx, { fill: color, stroke: COLOR.TRANSPARENT });
      //   point.draw(ctx, { size: size, color: color });
    }
    // this.base.draw(ctx);

    // new Segment(this.center, top).draw(ctx);
  }
}
