class MarkerDetector {
  constructor() {
    // this.canvas = document.createElement("canvas");
    // this.ctx = this.canvas.getContext("2d");

    this.threshold = document.createElement("input");
    this.threshold.type = "range";
    this.threshold.min = 0;
    this.threshold.max = 255;
    this.threshold.value = 10;

    // document.body.appendChild(this.canvas);
    // document.body.appendChild(this.threshold);
  }

  #averagePoints(points) {
    const center = { x: 0, y: 0 };
    for (const point of points) {
      center.x += point.x;
      center.y += point.y;
    }
    center.x /= points.length;
    center.y /= points.length;

    return center;
  }

  detect(imgData) {
    const points = [];
    // debugger;
    for (let i = 0; i < imgData.data.length; i += 4) {
      const r = imgData.data[i + 0];
      const g = imgData.data[i + 1];
      const b = imgData.data[i + 2];

      const blueness = b - Math.max(r, g);
      if (blueness > this.threshold.value) {
        const pIndex = i / 4;
        const y = Math.floor(pIndex / imgData.width);
        const x = pIndex % imgData.width;
        points.push({ x, y, blueness });
      }
    }

    let centroid1 = points[0];
    let centroid2 = points[points.length - 1];

    let group1 = [];
    let group2 = [];

    for (let i = 1; i <= 10; i++) {
      group1 = points.filter(
        (p) => distance(p, centroid1) < distance(p, centroid2)
      );
      group2 = points.filter(
        (p) => distance(p, centroid1) >= distance(p, centroid2)
      );

      centroid1 = this.#averagePoints(group1);
      centroid2 = this.#averagePoints(group2);
    }

    const size1 = Math.sqrt(group1.length);
    const radius1 = size1 / 2;

    const size2 = Math.sqrt(group1.length);
    const radius2 = size2 / 2;

    // this.canvas.width = imgData.width;
    // this.canvas.height = imgData.height + 255;

    // this.ctx.fillStyle = "red";
    // for (const point of group1) {
    //   this.ctx.globalAlpha = point.blueness / 255;
    //   this.ctx.fillRect(point.x, point.y, 1, 1);
    // }

    // this.ctx.fillStyle = "yellow";
    // for (const point of group2) {
    //   this.ctx.globalAlpha = point.blueness / 255;
    //   this.ctx.fillRect(point.x, point.y, 1, 1);
    // }

    // this.ctx.globalAlpha = 1;

    // this.ctx.beginPath();
    // this.ctx.arc(centroid1.x, centroid1.y, radius1, 0, Math.PI * 2);
    // this.ctx.stroke();

    // this.ctx.beginPath();
    // this.ctx.arc(centroid2.x, centroid2.y, radius2, 0, Math.PI * 2);
    // this.ctx.stroke();

    // this.ctx.translate(0, imgData.height);

    // points.sort((a, b) => b.blueness - a.blueness);

    // for (let i = 0; i < points.length; i++) {
    //   const y = points[i].blueness;
    //   const x = (this.canvas.width * i) / points.length;
    //   this.ctx.fillRect(x, y, 1, 1);
    // }

    const marker1 = {
      centroid: centroid1,
      points: group1,
      radius: radius1,
    };

    const marker2 = {
      centroid: centroid2,
      points: group2,
      radius: radius2,
    };

    return {
      leftMarker: centroid1.x < centroid2.x ? marker1 : marker2,
      rightMarker: centroid1.x < centroid2.x ? marker2 : marker1,
    };
  }
}
