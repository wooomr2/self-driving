class CameraControls {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.tilt = 0;
    this.forward = true;
    this.reverse = false;

    this.markerDetector = new MarkerDetector();

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((rawData) => {
        this.video = document.createElement("video");
        this.video.srcObject = rawData;
        this.video.play();
        this.video.onloadeddata = () => {
          this.canvas.with = this.video.videoWidth / 4;
          this.canvas.height = this.video.videoHeight / 4;

          this.#loop();
        };
      })
      .catch((err) => {
        alert(err);
      });
  }

  #processMarkers({ leftMarker, rightMarker }) {
    this.tilt = Math.atan2(
      rightMarker.centroid.y - leftMarker.centroid.y,
      rightMarker.centroid.x - leftMarker.centroid.x
    );

    this.ctx.beginPath();
    this.ctx.fillStyle = "red";
    this.ctx.arc(
      leftMarker.centroid.x,
      leftMarker.centroid.y,
      20,
      0,
      Math.PI * 2
    );
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.fillStyle = "yellow";
    this.ctx.arc(
      rightMarker.centroid.x,
      rightMarker.centroid.y,
      20,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  #loop() {
    this.ctx.save();
    this.ctx.translate(this.canvas.width, 0);
    this.ctx.scale(-1, 1);
    this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();

    const imgData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    const res = this.markerDetector.detect(imgData);
    if (res) {
      this.#processMarkers(res);
    }
    requestAnimationFrame(() => this.#loop());
  }
}
