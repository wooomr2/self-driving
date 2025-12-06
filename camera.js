class Camera {
  constructor({ x, y, angle }, range = 1000, distanceBehind = 150) {
    this.range = range;
    this.distanceBehind = distanceBehind;
    this.moveSimple({ x, y, angle });
  }

  move({ x, y, angle }) {
    const t = 1;
    this.x = lerp(this.x, x + this.distanceBehind * Math.sin(angle), t);
    this.y = lerp(this.y, y + this.distanceBehind * Math.cos(angle), t);
    this.z = -40;
    this.angle = lerp(this.angle, angle, t);
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

  moveSimple({ x, y, angle }) {
    this.x = x + this.distanceBehind * Math.sin(angle);
    this.y = y + this.distanceBehind * Math.cos(angle);
    this.z = -40;
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

  #projectPoint(ctx, p) {
    const seg = new Segment(this.center, this.tip);
    const { point: p1 } = seg.projectPoint(p);
    /**
     *   p1 --------- p
     *   |
     *   |
     *   |  x
     *    ----
     * 1 |
     *   . c
     *
     *   p1p / p1c = x/1
     *
     */
    const c = cross(subtract(p1, this), subtract(p, this));
    const x = (Math.sign(c) * distance(p, p1)) / distance(this, p1);
    const y = (p.z - this.z) / distance(this, p1);

    const cx = ctx.canvas.width / 2;
    const cy = ctx.canvas.height / 2;
    const scaler = Math.max(cx, cy);

    return new Point(cx + x * scaler, cy + y * scaler);
  }

  #filter(polys) {
    const filteredPolys = [];
    for (const poly of polys) {
      if (poly.intersectsPoly(this.poly)) {
        const copy1 = new Polygon(poly.points);
        const copy2 = new Polygon(this.poly.points);
        Polygon.break(copy1, copy2, true);
        const points = copy1.segments.map((s) => s.p1);
        const filteredPoints = points.filter(
          (p) => p.intersection || this.poly.containsPoint(p)
        );
        filteredPolys.push(new Polygon(filteredPoints));
      } else if (this.poly.containsPoly(poly)) {
        filteredPolys.push(poly);
      }
    }
    return filteredPolys;
  }

  #extrude(polys, height = 10) {
    const extrudedPolys = [];
    for (const poly of polys) {
      const ceiling = new Polygon(
        poly.points.map((p) => new Point(p.x, p.y, -height))
      );

      const sides = [];
      for (let ii = 0; ii < poly.points.length; ii++) {
        sides.push(
          new Polygon([
            poly.points[ii],
            poly.points[(ii + 1) % poly.points.length],
            ceiling.points[(ii + 1) % ceiling.points.length],
            ceiling.points[ii],
          ])
        );
      }
      extrudedPolys.push(...sides, ceiling);
    }
    return extrudedPolys;
  }

  #getPolys(world) {
    const buildingPolys = this.#extrude(
      this.#filter(world.buildings.map((b) => b.base)),
      200
    );

    const roadPolys = this.#extrude(
      this.#filter(
        world.corridor.borders.map((s) => new Polygon([s.p1, s.p2]))
      ),
      10
    );

    let polys = [];
    if (SHOW_OTHER_CARS) {
      const carPolys = this.#extrude(
        this.#filter(
          world.cars.map(
            (c) => new Polygon(c.polygon.map((p) => new Point(p.x, p.y)))
          )
        ),
        10
      );

      polys = [...buildingPolys, ...carPolys, ...roadPolys];
    } else {
      const bestCarPoly = this.#extrude(
        this.#filter([
          new Polygon(world.bestCar.polygon.map((p) => new Point(p.x, p.y))),
        ]),
        10
      );

      polys = [...buildingPolys, ...bestCarPoly, ...roadPolys];
    }

    return polys;
  }

  render(ctx, world) {
    const polys = this.#getPolys(world);

    const projPolys = polys.map(
      (poly) => new Polygon(poly.points.map((p) => this.#projectPoint(ctx, p)))
    );

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const poly of projPolys) {
      poly.draw(ctx);
    }

    // for (const poly of polys) {
    //   poly.draw(carCtx);
    // }
  }

  draw(ctx) {
    // this.center.draw(ctx, { color: "red" });
    // this.tip.draw(ctx);
    this.poly.draw(ctx);
  }
}
