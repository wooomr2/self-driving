const carCanvas = document.getElementById("carCanvas");
carCanvas.width = window.innerWidth - 330;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

carCanvas.height = window.innerHeight;
networkCanvas.height = window.innerHeight;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const worldStr = localStorage.getItem("world");
const worldInfo = worldStr ? JSON.parse(worldStr) : null;
const world = worldInfo ? World.load(worldInfo) : new World(new Graph());

const viewport = new Viewport(carCanvas, world.zoom, world.offset);

const cars = generateCars(NUM_OF_CARS);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}

const traffic = [];
const roadBorders = world.roadBorders.map((s) => [s.p1, s.p2]);

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
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
    cars.push(
      new Car(startPoint.x, startPoint.y, 30, 50, CONTROL_TYPE.AI, startAngle)
    );
  }

  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(roadBorders, []);
  }

  for (let i = 0; i < cars.length; i++) {
    cars[i].update(roadBorders, traffic);
  }

  bestCar = cars.find(
    (c) => c.fitness == Math.max(...cars.map((c) => c.fitness))
  );

  world.cars = cars;
  world.bestCar = bestCar;

  viewport.offset.x = -bestCar.x;
  viewport.offset.y = -bestCar.y;

  viewport.reset();
  // (-1)만큼 offset을 scale:: 마우스 드래그 반대방향으로 viewport를 이동시키는 패닝 효과를 주기 위함
  const viewPoint = scale(viewport.getOffset(), -1);
  world.draw(carCtx, viewPoint, false);

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, COLOR.RED);
  }

  networkCtx.lineDashOffset = -time / 50;
  networkCtx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);

  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
