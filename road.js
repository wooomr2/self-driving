class Road {
  constructor(x, width, laneCount = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    const infinity = 1000000;
    this.top = -infinity;
    this.bottom = infinity;

    const topLeft = new Point(this.left, this.top);
    const topRight = new Point(this.right, this.top);
    const bottomLeft = new Point(this.left, this.bottom);
    const bottomRight = new Point(this.right, this.bottom);
    this.borders = [
      [topLeft.coordinate, bottomLeft.coordinate],
      [topRight.coordinate, bottomRight.coordinate],
    ];
  }

  getLaneCenter(laneIndex) {
    const lineWidth = this.width / this.laneCount;
    const laneIdx = Math.min(laneIndex, this.laneCount - 1);

    return this.left + lineWidth * (laneIdx + 1 / 2);
  }

  draw(ctx) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    for (let i = 0; i <= this.laneCount; i++) {
      const x = lerp(this.left, this.right, i / this.laneCount);

      if (i > 0 && i < this.laneCount) {
        ctx.setLineDash([20, 20]);
      }

      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });
  }
}
