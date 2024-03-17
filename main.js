const canvas = document.getElementById("myCanvas");

canvas.width = 200;

const ctx = canvas.getContext("2d");

const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50);

animate();

function animate() {
  car.update(road.borders);

  canvas.height = window.innerHeight;

  ctx.save();

  // 원점을 y축 방향으로 이동
  // car 객체가 항상 캔버스의 아래쪽 70% 위치에 그려짐.
  ctx.translate(0, -car.y + canvas.height * 0.7);

  road.draw(ctx);
  car.draw(ctx);

  ctx.restore();

  requestAnimationFrame(animate);
}
