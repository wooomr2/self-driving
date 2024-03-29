## Osm Data 
- https://overpass-turbo.eu/
- https://www.openstreetmap.org/export#map

```
[out:json];
(
  way['highway']
  ['highway' !~ 'pedestrian']
  ['highway' !~ 'footway']
  ['highway' !~ 'cycleway']
  ['highway' !~ 'path']
  ['highway' !~ 'service']
  ['highway' !~ 'corridor']
  ['highway' !~ 'track']
  ['highway' !~ 'steps']
  ['highway' !~ 'raceway']
  ['highway' !~ 'bridleway']
  ['highway' !~ 'proposed']
  ['highway' !~ 'construction']
  ['highway' !~ 'elevator']
  ['highway' !~ 'bus_guideway']
  ['highway' !~ 'private']
  ['highway' !~ 'no']
  ['highway' !~ 'residential']
  ['highway' !~ 'living_street']
    ({{bbox}});
);
out body;
>;
out skel;
```

## 속도에 따른 변화량 계산

- 차량을 상하로 움직이는 것이 기본이므로
- x축을 π/2(90도)만큼 회전한 단위원을 생각
- 후진 시 flip 변수로 회전 방향을 반대로 toggle

## Segment Intersection

- 네 개의 Point A, B, C, D를 입력 받아 두 선분 AB와 CD의 교점을 계산.

- tTop, uTop, bottom은 선분의 교점을 찾기 위한 계산에 사용되는 중간 변수들입니다. 이들은 선분의 방향과 위치를 나타내는 벡터 연산의 결과입니다.

- bottom이 0이 아니라면, 선분 AB와 CD는 평행하지 않습니다. 이 경우에만 교점이 존재할 수 있습니다.

- t와 u는 각각 선분 AB와 CD에 대한 교점의 위치를 나타내는 매개변수입니다. 이들 값이 0과 1 사이라면, 교점은 해당 선분 위에 있습니다.(0<=t<=1, 0<=u<=1)

- lerp(A.x, B.x, t)와 lerp(A.y, B.y, t)는 선형 보간(linear interpolation) 함수로, 선분 AB 위의 교점의 x와 y 좌표를 계산.

- 선분 AB 사이의 교점의 위치가 offset(t)가 됨.

- 만약 교점이 선분 위에 없다면, 함수는 null을 반환합니다.

## 자바스크립트의 this

JavaScript에서 화살표 함수(arrow function)와 일반 함수(function)의 this 차이점은 다음과 같습니다:

- 일반 함수: 일반 함수에서 this는 함수가 호출되는 방식에 따라 달라집니다. 만약 함수가 객체의 메소드로서 호출되면, this는 그 객체를 가리킵니다. 하지만 함수가 일반적으로 호출되면, this는 전역 객체(브라우저에서는 window, Node.js에서는 global)를 가리키거나, strict mode에서는 undefined가 됩니다.

- arrow function: 화살표 함수에서 this는 함수가 정의된 시점의 this를 가리킵니다. 즉, 화살표 함수는 자신만의 this를 가지지 않고, 화살표 함수의 this는 항상 상위 스코프의 this를 가리킵니다. 이러한 차이점 때문에, 특정 객체의 메소드 내에서 this를 보존하려는 경우에는 화살표 함수를 사용하는 것이 유용합니다.