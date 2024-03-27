class Building {
  constructor(poly, height = PRE_DEFINES.BUILDING_BASE_HEIGHT) {
    this.base = poly;
    this.height = height;
  }

  draw(ctx, viewPoint) {
    const topPoints = this.base.points.map((p) =>
      getFake3dPoint(
        p,
        viewPoint,
        this.height * (1 - PRE_DEFINES.BUILDING_ROOF_RATIO)
      )
    );

    const ceiling = new Polygon(topPoints);

    const sides = [];
    {
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
    }

    const roofs = [];
    {
      const baseMidPoints = [
        average(this.base.points[0], this.base.points[1]),
        average(this.base.points[2], this.base.points[3]),
      ];

      const topMidPoints = baseMidPoints.map((p) =>
        getFake3dPoint(p, viewPoint, this.height)
      );

      roofs.push(
        new Polygon([
          ceiling.points[0],
          ceiling.points[3],
          topMidPoints[1],
          topMidPoints[0],
        ]),
        new Polygon([
          ceiling.points[2],
          ceiling.points[1],
          topMidPoints[0],
          topMidPoints[1],
        ])
      );

      roofs.sort(
        (a, b) => b.distanceToPoint(viewPoint) - a.distanceToPoint(viewPoint)
      );
    }

    {
      this.base.draw(ctx, {
        fill: COLOR.WHITE,
        stroke: COLOR.LIGHT_GRAY,
        lineWidth: 20,
      });

      for (const side of sides) {
        side.draw(ctx, { fill: COLOR.WHITE, stroke: COLOR.LIGHT_GRAY });
      }

      ceiling.draw(ctx, {
        fill: COLOR.WHITE,
        stroke: COLOR.LIGHT_GRAY,
        lineWidth: 6,
      });

      for (const roof of roofs) {
        roof.draw(ctx, {
          fill: COLOR.DARK_ORANGE1,
          stroke: COLOR.DARK_ORANGE2,
          lineWidth: 8,
          join: "round",
        });
      }
    }
  }
}
