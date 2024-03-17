class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 3;
    this.friction = 0.05;

    this.angle = 0;
    this.damaged = false;

    this.sensor = new Sensor(this);
    this.controls = new Controls();
  }

  update(roadBorders) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders);
    }

    this.sensor.update(roadBorders);
  }

  // // x축이 π/2(90도)만큼 회전된 상태
  // draw(ctx) {
  //   ctx.save();
  //   // context의 원점을 (this.x, this.y)로 옮김
  //   ctx.translate(this.x, this.y);
  //   ctx.rotate(-this.angle);

  //   ctx.beginPath();
  //   ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
  //   ctx.fill();
  //   ctx.restore();

  //   this.sensor.draw(ctx);
  // }

  draw(ctx) {
    if (this.damaged) {
      ctx.fillStyle = "gray";
    } else {
      ctx.fillStyle = "black";
    }

    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);

    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }

    ctx.fill();

    this.sensor.draw(ctx);
  }

  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }

    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    if (this.speed !== 0) {
      // 후진 시 회전방향을 반대로
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  #assessDamage(roadBorders) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    return false;
  }

  //  -----width----
  //  -      |   /
  //  -      |  /
  //  h      |a/ rad
  //  e      |/
  //  i      *(x,y)
  //  g
  //  t
  //  -
  //  --------------
  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    const p1 = new Point(
      this.x - Math.sin(this.angle - alpha) * rad,
      this.y - Math.cos(this.angle - alpha) * rad
    );
    const p2 = new Point(
      this.x - Math.sin(this.angle + alpha) * rad,
      this.y - Math.cos(this.angle + alpha) * rad
    );
    const p3 = new Point(
      this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      this.y - Math.cos(Math.PI + this.angle - alpha) * rad
    );
    const p4 = new Point(
      this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      this.y - Math.cos(Math.PI + this.angle + alpha) * rad
    );

    points.push(p1.coordinate, p2.coordinate, p3.coordinate, p4.coordinate);
    return points;
  }
}
