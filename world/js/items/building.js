class Building {
  constructor(poly, heightCoef = 0.3) {
    this.base = poly;
    this.heightCoef = heightCoef;
  }

  draw(ctx, viewPoint) {
    const topPoints = this.base.points.map((p) =>
      add(p, scale(subtract(p, viewPoint), this.heightCoef))
    );

    const ceiling = new Polygon(topPoints);

    const sides = [];
    for (let i = 0; i < this.base.points.length; i++) {
      const nextI = (i + 1) % this.base.points.length;
      const poly = new Polygon([
        this.base.points[i],
        this.base.points[nextI],
        topPoints[nextI],
        topPoints[i],
      ]);
      sides.push(poly);
    }

    // viewPoint에서 가장 먼 side면부터 그리기위해 정렬
    sides.sort(
      (a, b) => b.distanceToPoint(viewPoint) - a.distanceToPoint(viewPoint)
    );

    this.base.draw(ctx, { fill: COLOR.WHITE, stroke: COLOR.LIGHT_GRAY });
    for (const side of sides) {
      side.draw(ctx, { fill: COLOR.WHITE, stroke: COLOR.LIGHT_GRAY });
    }
    ceiling.draw(ctx, { fill: COLOR.WHITE, stroke: COLOR.LIGHT_GRAY });
  }
}
