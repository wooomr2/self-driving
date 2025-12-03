const RIGHT_PANEL_WIDTH = 300;

const carCanvas = document.getElementById("carCanvas");
carCanvas.width = window.innerWidth;
carCanvas.height = window.innerHeight;

const miniMapCanvas = document.getElementById("miniMapCanvas");
miniMapCanvas.width = RIGHT_PANEL_WIDTH;
miniMapCanvas.height = RIGHT_PANEL_WIDTH;

statistics.style.width = RIGHT_PANEL_WIDTH + "px";
statistics.style.height = window.innerHeight - RIGHT_PANEL_WIDTH - 60 + "px";

const carCtx = carCanvas.getContext("2d");

const viewport = new Viewport(carCanvas, world.zoom, world.offset);
const miniMap = new MiniMap(miniMapCanvas, world.graph, RIGHT_PANEL_WIDTH);

const cars = generateCars(1, CONTROL_TYPE.KEYS).concat(
  generateCars(NUM_OF_CARS - 1, CONTROL_TYPE.AI)
);
const myCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i > 1) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}

for (let ii = 0; ii < cars.length; ii++) {
  const div = document.createElement("div");
  div.id = "stat_" + ii;
  div.innerText = ii;
  div.style.color = cars[ii].color;
  div.classList.add("stat");
  statistics.appendChild(div);
}

let roadBorders = [];
const target = world.markings.find((m) => m instanceof Target);
if (target) {
  world.generateCorridor(myCar, target.center);
  roadBorders = world.corridor.borders.map((s) => [s.p1, s.p2]);
} else {
  roadBorders = world.roadBorders.map((s) => [s.p1, s.p2]);
}

let frameCount = 0;

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(myCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N, type = CONTROL_TYPE.AI) {
  const startPoints = world.markings.filter((m) => m instanceof Start);
  const startPoint =
    startPoints.length > 0 ? startPoints[0].center : new Point(100, 100);

  const directionVector =
    startPoints.length > 0 ? startPoints[0].directionVector : new Point(0, -1);

  // 축 방향                         x
  // world Editor ---- x   Car    \a|
  //              |\ a             \|  // 실제로는 각(a)이 서로 같음
  //              | \         y -----
  //              y
  const startAngle = -angle(directionVector) + Math.PI / 2;

  const cars = [];
  for (let i = 1; i <= N; i++) {
    const color = type == CONTROL_TYPE.AI ? getRandomColor() : "blue";
    const car = new Car(
      startPoint.x,
      startPoint.y,
      30,
      50,
      type,
      startAngle,
      3,
      color
    );
    car.load(carInfo);
    cars.push(car);
  }

  return cars;
}

function updateCarProgress(car) {
  if (!car.finishTime) {
    car.progress = 0;
    const carSeg = getNearestSegment(car, world.corridor.skeleton);
    for (let ii = 0; ii < world.corridor.skeleton.length; ii++) {
      const s = world.corridor.skeleton[ii];

      if (s.equals(carSeg)) {
        const proj = s.projectPoint(car);
        // proj.point.draw(carCtx);
        const firstPartOfSegment = new Segment(s.p1, proj.point);
        // firstPartOfSegment.draw(carCtx, { color: "red", width: 5 });
        car.progress += firstPartOfSegment.length();
        break;
      } else {
        // s.draw(carCtx, { color: "red", width: 5 });
        car.progress += s.length();
      }
    }
    const totalDistance = world.corridor.skeleton.reduce(
      (acc, s) => acc + s.length(),
      0
    );
    car.progress /= totalDistance;
    if (car.progress >= 1) {
      car.progress = 1;
      car.finishTime = frameCount;
    }
    // console.log(car.progress);
  }
}

function animate() {
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(roadBorders, []);
  }

  world.cars = cars;
  world.bestCar = myCar;

  viewport.offset.x = -myCar.x;
  viewport.offset.y = -myCar.y;

  viewport.reset();
  // (-1)만큼 offset을 scale:: 마우스 드래그 반대방향으로 viewport를 이동시키는 패닝 효과를 주기 위함
  const viewPoint = scale(viewport.getOffset(), -1);

  world.draw(carCtx, viewPoint, false);
  miniMap.update(viewPoint);

  for (let ii = 0; ii < cars.length; ii++) {
    updateCarProgress(cars[ii]);
  }

  cars.sort((a, b) => b.progress - a.progress);

  for (let ii = 0; ii < cars.length; ii++) {
    const stat = document.getElementById("stat_" + ii);
    stat.style.color = cars[ii].color;
    stat.innerText = ii + 1 + ": " + (cars[ii].progress * 100).toFixed(1) + "%";
    stat.style.backgroundColor =
      cars[ii].type == CONTROL_TYPE.AI ? "black" : "white";
    if (cars[ii].finishTime) {
      stat.innerText += " (" + cars[ii].finishTime / 60 + ")";
    }
  }

  frameCount++;
  requestAnimationFrame(animate);
}
