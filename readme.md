### this

JavaScript에서 화살표 함수(arrow function)와 일반 함수(function)의 this 차이점은 다음과 같습니다:

- 일반 함수: 일반 함수에서 this는 함수가 호출되는 방식에 따라 달라집니다. 만약 함수가 객체의 메소드로서 호출되면, this는 그 객체를 가리킵니다. 하지만 함수가 일반적으로 호출되면, this는 전역 객체(브라우저에서는 window, Node.js에서는 global)를 가리키거나, strict mode에서는 undefined가 됩니다.

- 화살표 함수: 화살표 함수에서 this는 함수가 정의된 시점의 this를 가리킵니다. 즉, 화살표 함수는 자신만의 this를 가지지 않고, 화살표 함수의 this는 항상 상위 스코프의 this를 가리킵니다.
  이러한 차이점 때문에, 특정 객체의 메소드 내에서 this를 보존하려는 경우에는 화살표 함수를 사용하는 것이 유용합니다.

### 속도에 따른 변화량 계산

- 차량을 상하로 움직이는 것이 기본이므로
- x축을 π/2(90도)만큼 회전한 단위원을 생각
- 후진 시 flip 변수로 회전 방향을 반대로 toggle
