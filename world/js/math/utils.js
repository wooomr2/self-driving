function getNearestPoint(loc, points, threshold = Number.MAX_SAFE_INTEGER) {
  let minDist = Number.MAX_SAFE_INTEGER;
  let nearest = null;

  for (const point of points) {
    const dist = distance(point, loc);
    if (dist < minDist && dist < threshold) {
      minDist = dist;
      nearest = point;
    }
  }

  return nearest;
}

function getNearestSegment(loc, segments, threshold = Number.MAX_SAFE_INTEGER) {
  let minDist = Number.MAX_SAFE_INTEGER;
  let nearest = null;

  for (const seg of segments) {
    const dist = seg.distanceToPoint(loc);
    if (dist < minDist && dist < threshold) {
      minDist = dist;
      nearest = seg;
    }
  }

  return nearest;
}

function distance(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function average(p1, p2) {
  return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}

/** 내적: 정규화된(normalized) 한 벡터가 다른 벡터에 투영된 길이 값
 *  - Dot(A, B): B를 A위치로 회전했을 때 투영되어 직교되는 위치만큼의 크기 값
 *  - cos(theta) = Dot(A, B) / (|A| * |B|)
 */
function dot(p1, p2) {
  return p1.x * p2.x + p1.y * p2.y;
}

function cross(p1, p2) {
  return p1.x * p2.y - p1.y * p2.x;
}

function add(p1, p2) {
  return new Point(p1.x + p2.x, p1.y + p2.y);
}

function subtract(p1, p2) {
  return new Point(p1.x - p2.x, p1.y - p2.y);
}

function scale(p, scaler) {
  return new Point(p.x * scaler, p.y * scaler);
}

function normalize(p) {
  return scale(p, 1 / magnitude(p));
}

function magnitude(p) {
  return Math.hypot(p.x, p.y);
}

// (1, 2) => (-2, 1)
/** 수직선 */
function perpendicular(p) {
  return new Point(-p.y, p.x);
}

/** 위치 변환 */
function translate(loc, angle, offset) {
  return new Point(
    loc.x + Math.cos(angle) * offset,
    loc.y + Math.sin(angle) * offset
  );
}

function angle(p) {
  return Math.atan2(p.y, p.x);
}

// TODO:: util-function 통합하기
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerp2D(A, B, t) {
  return new Point(lerp(A.x, B.x, t), lerp(A.y, B.y, t));
}

/** 두 알려진 값 a와 b가 주어지고,
 *  a와 b 사이에 있는 값 v가 주어졌을 때,
 *  v가 a에서 b까지의 범위에서 어디에 위치하는지 비율 추정 */
function invLerp(a, b, v) {
  return (v - a) / (b - a);
}

function degToRad(degree) {
  return degree * (Math.PI / 180);
}

function getIntersection(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  const epsilon = 1e-3;
  if (Math.abs(bottom) > epsilon) {
    const t = tTop / bottom;
    const u = uTop / bottom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}

function getRandomColor() {
  const hue = 290 + Math.random() * 260;

  return `hsl(${hue},100%, 60%)`;
}

function getFake3dPoint(point, viewPoint, height) {
  const dir = normalize(subtract(point, viewPoint));
  const dist = distance(point, viewPoint);
  // (-π/2 ~ π/2) -> (-1, 1)
  // dist가 클수록 scaler가 1에 가까워짐
  const scaler = Math.atan(dist / 300) / (Math.PI / 2);

  return add(point, scale(dir, height * scaler));
}
