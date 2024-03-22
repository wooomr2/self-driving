class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 3;
    this.rayLength = 150;
    this.raySpread = Math.PI / 4;

    this.rays = [];
    this.readings = [];
  }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1];
      // Ray의 충돌지점이 있는 경우 endPoint를 충돌지점으로 변경
      if (this.readings[i]) {
        end = this.readings[i];
      }

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = COLOR.YELLOW;
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      // ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = COLOR.BLACK;
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }

  update(roadBorders, traffic) {
    this.#castRays();
    this.readings = [];
    for (let i = 0; i < this.rayCount; i++) {
      this.readings.push(this.#getReading(this.rays[i], roadBorders, traffic));
    }
  }

  #getReading(ray, roadBorders, traffic) {
    let touches = [];
    for (let i = 0; i < roadBorders.length; i++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      );

      if (touch) {
        touches.push(touch);
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      const poly = traffic[i].polygon;
      for (let j = 0; j < poly.length; j++) {
        const value = getIntersection(
          ray[0],
          ray[1],
          poly[j],
          poly[(j + 1) % poly.length]
        );
        
        if (value) {
          touches.push(value);
        }
      }
    }

    if (touches.length === 0) {
      return null;
    } else {
      const offsets = touches.map((e) => e.offset);
      const minOffset = Math.min(...offsets);

      return touches.find((e) => e.offset === minOffset);
    }
  }

  #castRays() {
    this.rays = [];

    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle; // 차의 이동 각도만큼 변화량 추가

      const start = new Point(this.car.x, this.car.y);
      const end = new Point(
        this.car.x - Math.sin(rayAngle) * this.rayLength,
        this.car.y - Math.cos(rayAngle) * this.rayLength
      );

      this.rays.push([start.coordinate, end.coordinate]);
    }
  }
}
