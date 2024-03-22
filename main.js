const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, CONTROL_TYPE.AI);
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, CONTROL_TYPE.DUMMY, 2),
];

animate();

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  car.update(road.borders, traffic);

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();

  // 원점을 y축 방향으로 이동
  // car 객체가 항상 캔버스의 아래쪽 70% 위치에 그려짐.
  carCtx.translate(0, -car.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, COLOR.RED);
  }
  car.draw(carCtx, COLOR.BLUE);

  carCtx.restore();

  networkCtx.lineDashOffset = time/50;
  Visualizer.drawNetwork(networkCtx, car.brain);
  requestAnimationFrame(animate);
}
