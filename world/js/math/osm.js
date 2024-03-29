const Osm = {
  parseRoads: (data) => {
    const nodes = data.elements.filter((n) => n.type == "node");

    // lat => [-90,90]::real, lon => [-180,180]::real
    // 좁은 지역의 위도 경도는 소수점 차이만 있어 canvas 좌표 겹침 -> scale-up한다

    const lats = nodes.map((n) => n.lat); // 위도(latitude): ↕️
    const lons = nodes.map((n) => n.lon); // 경도(longitude): ↔️

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);

    const deltaLat = maxLat - minLat;
    const deltaLon = maxLon - minLon;
    const aspectRatio = deltaLon / deltaLat;

    // 구면좌표계(Spherical Coordinate) 생각하십쇼
    // (x,y,z) (ρ, φ, θ) (0≤r, 0≤𝜑<2π, 0≤θ≤π)
    // x = rsin(θ)cos(φ)
    // y = rsin(θ)sin(φ)
    // z = rcos(θ)
    //
    // r: 지구 반지름
    // 위도(Latitude): 지구의 중점에서 좌표까지의 각도(π/2- φ)
    // 경도(Longitude): θ

    // 1° of latitude ≈ 111km ≈ 111000m

    // 미터단위로 설정할 경우, 도로 너비(default 100px)로 설정되어 있으므로 도로가 100m가 됨
    // 다시 10배 scale-up해서 도로폭을 10m 로 설정
    const height = deltaLat * 111000 * 10;
    const width = height * aspectRatio * Math.cos(degToRad(maxLat));

    const points = [];
    const segments = [];
    for (const node of nodes) {
      const y = invLerp(maxLat, minLat, node.lat) * height;
      const x = invLerp(minLon, maxLon, node.lon) * width;
      const point = new Point(x, y);
      point.id = node.id;
      points.push(point);
    }

    const ways = data.elements.filter((w) => w.type == "way");
    for (const way of ways) {
      const ids = way.nodes;
      for (let i = 1; i < ids.length; i++) {
        const prev = points.find((p) => p.id == ids[i - 1]);
        const cur = points.find((p) => p.id == ids[i]);
        const oneWay = way.tags.oneway || way.tags.lanes == 1;
        segments.push(new Segment(prev, cur, oneWay));
      }
    }
    console.log(ways);

    return { points, segments };
  },
};
