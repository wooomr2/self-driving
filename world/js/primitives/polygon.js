class Polygon {
  constructor(points) {
    this.points = points;
    this.segments = [];
    for (let i = 1; i <= points.length; i++) {
      this.segments.push(new Segment(points[i - 1], points[i % points.length]));
    }
  }

  static union(polys) {
    Polygon.multiBreak(polys);
    const keptSegments = [];
    for (let i = 0; i < polys.length; i++) {
      for (const seg of polys[i].segments) {
        let keep = true;
        for (let j = 0; j < polys.length; j++) {
          if (i != j) {
            if (polys[j].containsSegment(seg)) {
              keep = false;
              break;
            }
          }
        }
        if (keep) {
          keptSegments.push(seg);
        }
      }
    }

    return keptSegments;
  }

  static multiBreak(polys) {
    for (let i = 0; i < polys.length - 1; i++) {
      for (let j = i + 1; j < polys.length; j++) {
        Polygon.break(polys[i], polys[j]);
      }
    }
  }

  static break(poly1, poly2) {
    const segs1 = poly1.segments;
    const segs2 = poly2.segments;
    for (let i = 0; i < segs1.length; i++) {
      for (let j = 0; j < segs2.length; j++) {
        const intersect = getIntersection(
          segs1[i].p1,
          segs1[i].p2,
          segs2[j].p1,
          segs2[j].p2
        );

        if (intersect && intersect.offset != 1 && intersect.offset != 0) {
          const point = new Point(intersect.x, intersect.y);

          // polygon1의 각 segment들을 intersect로 나누고 새로운 segment를 추가
          {
            const aux = segs1[i].p2;
            segs1[i].p2 = point;
            segs1.splice(i + 1, 0, new Segment(point, aux));
          }

          // polygon2도 동일한 작업
          {
            const aux = segs2[j].p2;
            segs2[j].p2 = point;
            segs2.splice(j + 1, 0, new Segment(point, aux));
          }
        }
      }
    }
  }

  distanceToPoint(point) {
    return Math.min(...this.segments.map((s) => s.distanceToPoint(point)));
  }

  distanceToPoly(poly) {
    return Math.min(...this.points.map((p) => poly.distanceToPoint(p)));
  }

  intersectsPoly(poly) {
    for (let s1 of this.segments) {
      for (let s2 of poly.segments) {
        if (getIntersection(s1.p1, s1.p2, s2.p1, s2.p2)) {
          return true;
        }
      }
    }
    return false;
  }

  containsSegment(seg) {
    const midPoint = average(seg.p1, seg.p2);
    return this.containsPoint(midPoint);
  }

  /**
   * outerPoint:: 유저가 생성할 수 없는 임의의 한 점
   * 선분(outerPoint, point) 의 segments와의 교점이
   * 홀수 => polygon 내부 // 짝수 => polygon 외부 point
   * @returns {boolean}
   */
  containsPoint(point) {
    const outerPoint = new Point(-1000, -1000);
    let intersectionCount = 0;
    for (const seg of this.segments) {
      const intersect = getIntersection(outerPoint, point, seg.p1, seg.p2);
      if (intersect) {
        intersectionCount++;
      }
    }

    return intersectionCount % 2 == 1;
  }

  draw(
    ctx,
    { stroke = COLOR.BLUE, lineWidth = 2, fill = COLOR.BLUE_OPACITY_30 } = {}
  ) {
    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.moveTo(this.points[0].x, this.points[0].y);

    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  drawSegments(ctx) {
    for (const seg of this.segments) {
      seg.draw(ctx, { color: getRandomColor(), width: 5 });
    }
  }
}
