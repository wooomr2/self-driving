class Viewport {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.zoom = 1;
    this.center = new Point(canvas.width / 2, canvas.height / 2);
    this.offset = scale(this.center, -1);

    this.drag = {
      start: new Point(0, 0),
      end: new Point(0, 0),
      offset: new Point(0, 0),
      active: false,
    };

    this.#addEventListeners();
  }

  #addEventListeners() {
    this.canvas.addEventListener(
      "mousewheel",
      this.#handleMouseWheel.bind(this)
    );
    this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.#handleMouseUp.bind(this));
  }

  #handleMouseDown(evt) {
    // USE-ALT-KEY::
    if (evt.altKey && evt.button == EVT_BTN_TYPE.MOUSE_LEFT) {
      // if (evt.button == EVT_BTN_TYPE.MOUSE_LEFT) {
      this.drag.start = this.getMouse(evt);
      this.drag.active = true;
    }
  }

  #handleMouseMove(evt) {
    if (this.drag.active) {
      this.drag.end = this.getMouse(evt);
      this.drag.offset = subtract(this.drag.end, this.drag.start);
    }
  }

  #handleMouseUp(evt) {
    if (this.drag.active) {
      this.offset = add(this.offset, this.drag.offset);
      this.drag = {
        start: new Point(0, 0),
        end: new Point(0, 0),
        offset: new Point(0, 0),
        active: false,
      };
    }
  }

  #handleMouseWheel(evt) {
    const dir = Math.sign(evt.deltaY);
    const step = PRE_DEFINES.MOUSE_WHEEL.STEP;

    this.zoom += dir * step;
    this.zoom = Math.max(
      PRE_DEFINES.MOUSE_WHEEL.ZOOM_MIN,
      Math.min(PRE_DEFINES.MOUSE_WHEEL.ZOOM_MAX, this.zoom)
    );
  }

  reset() {
    this.ctx.restore();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.center.x, this.center.y);
    this.ctx.scale(1 / this.zoom, 1 / this.zoom);

    const offset = this.getOffset();
    this.ctx.translate(offset.x, offset.y);
  }

  getMouse(evt, subtractDragOffset = false) {
    const p = new Point(
      (evt.offsetX - this.center.x) * this.zoom - this.offset.x,
      (evt.offsetY - this.center.x) * this.zoom - this.offset.y
    );

    return subtractDragOffset ? subtract(p, this.drag.offset) : p;
  }

  getOffset() {
    return add(this.offset, this.drag.offset);
  }
}
