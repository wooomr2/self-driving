class Car {
  constructor(
    x,
    y,
    width,
    height,
    controlType,
    angle = 0,
    maxSpeed = 3,
    color = COLOR.BLUE
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.type = controlType;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;

    this.angle = angle;
    this.damaged = false;

    this.fitness = 0;

    this.useBrain = controlType == CONTROL_TYPE.AI;

    if (controlType != CONTROL_TYPE.DUMMY) {
      this.sensor = new Sensor(this);
      // neuronCounts:number[] 의 마지막 layer의 개수는 [forward,left,right,reverse] 4개
      this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
    }
    this.controls = new Controls(controlType);

    this.img = new Image();
    this.img.src = "car.png";

    this.mask = document.createElement("canvas");
    this.mask.width = width;
    this.mask.height = height;

    const maskCtx = this.mask.getContext("2d");
    this.img.onload = () => {
      maskCtx.fillStyle = color;
      maskCtx.rect(0, 0, this.width, this.height);
      maskCtx.fill();

      maskCtx.globalCompositeOperation = "destination-atop";
      maskCtx.drawImage(this.img, 0, 0, this.width, this.height);
    };
  }

  load(info) {
    this.brain = info.brain;
    this.maxSpeed = info.maxSpeed;
    this.friction = info.friction;
    this.acceleration = info.acceleration;
    this.sensor.rayCount = info.sensor.rayCount;
    this.sensor.raySpead = info.sensor.raySpead;
    this.sensor.rayLength = info.sensor.rayLength;
    this.sensor.rayOffset = info.sensor.rayOffset;
  }

  update(roadBorders, traffic) {
    if (!this.damaged) {
      this.#move();
      this.fitness += this.speed;
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders, traffic);
      if (this.damaged) {
        this.speed = 0;
        if (this.type == CONTROL_TYPE.KEYS) {
          explode();
        }
      }
    }

    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
      const offsets = this.sensor.readings
        .map((s) => (s == null ? 0 : 1 - s.offset))
        .concat([this.speed / this.maxSpeed]);
      const outputs = NeuralNetwork.feedForward(offsets, this.brain);

      if (this.useBrain) {
        this.controls.forward = outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.reverse = outputs[3];
      }
    }

    if (this.engine) {
      const percent = Math.abs(this.speed / this.maxSpeed);
      this.engine.setVolume(percent);
      this.engine.setPitch(percent);
    }
  }

  draw(ctx, drawSensor = false) {
    if (this.sensor && drawSensor && this.useBrain) {
      this.sensor.draw(ctx);
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    if (!this.damaged) {
      ctx.drawImage(
        this.mask,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
      ctx.globalCompositeOperation = "multiply";
    }

    ctx.drawImage(
      this.img,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
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

  #assessDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
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
