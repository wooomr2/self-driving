class MarkingEditor {
  constructor(viewport, world, targetSegments) {
    this.viewport = viewport;
    this.world = world;

    this.canvas = viewport.canvas;
    this.ctx = this.canvas.getContext("2d");

    this.mouse = null;
    this.intent = null;

    this.targetSegments = targetSegments;

    this.markings = world.markings;
  }

  /** to be overwritten by sub-class */
  createMarking(center, directionVector) {
    return center;
  }

  enable() {
    this.#addEventListeners();
  }

  disable() {
    this.#removeEventListeners();
  }

  #addEventListeners() {
    this.mouseDown = (e) => this.#handleMouseDown(e);
    this.mouseMove = (e) => this.#handleMouseMove(e);
    this.contextMenu = (e) => e.preventDefault();

    this.canvas.addEventListener("mousedown", this.mouseDown);
    this.canvas.addEventListener("mousemove", this.mouseMove);
    this.canvas.addEventListener("contextmenu", this.contextMenu);
  }

  #removeEventListeners() {
    this.canvas.removeEventListener("mousedown", this.mouseDown);
    this.canvas.removeEventListener("mousemove", this.mouseMove);
    this.canvas.removeEventListener("contextmenu", this.contextMenu);
  }

  #handleMouseMove(evt) {
    this.mouse = this.viewport.getMouse(evt, true);

    const seg = getNearestSegment(
      this.mouse,
      this.targetSegments,
      PRE_DEFINES.THRESHOLD * this.viewport.zoom
    );

    if (seg) {
      this.intent = seg;
      const proj = seg.projectPoint(this.mouse);
      if (proj.offset >= 0 && proj.offset <= 1) {
        this.intent = this.createMarking(proj.point, seg.directionVector());
      } else {
        this.intent = null;
      }
    } else {
      this.intent = null;
    }
  }

  #handleMouseDown(evt) {
    if (evt.button == EVT_BTN_TYPE.MOUSE_LEFT) {
      if (this.intent) {
        this.markings.push(this.intent);
        this.intent = null;
      }
    }

    if (evt.button == EVT_BTN_TYPE.MOUSE_RIGHT) {
      for (let i = 0; i < this.markings.length; i++) {
        const poly = this.markings[i].poly;
        if (poly.containsPoint(this.mouse)) {
          this.markings.splice(i, 1);
          return;
        }
      }
    }
  }

  display() {
    if (this.intent) {
      this.intent.draw(this.ctx);
    }
  }
}
