class GraphEditor {
  constructor(canvas, graph) {
    this.canvas = canvas;
    this.graph = graph;

    this.ctx = this.canvas.getContext("2d");

    this.mouse = null;

    this.selected = null;
    this.hovered = null;
    this.dragging = false;

    this.#eventListeners();
  }

  #eventListeners() {
    // this.canvas.addEventListener("mousedown", e => this.#handleMouseDown(e));
    this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", () => (this.dragging = false));
    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  #handleMouseDown(evt) {
    if (evt.button == EVENT_BUTTON_TYPE.MOUSE_RIGHT_CLICK) {
      if (this.selected) {
        this.selected = null;
      } else if (this.hovered) {
        this.#removePoint(this.hovered);
      }
    }

    if (evt.button == EVENT_BUTTON_TYPE.MOUSE_LEFT_CLICK) {
      if (this.hovered) {
        this.#selectPoint(this.hovered);
        this.dragging = true;
        return;
      }

      this.graph.addPoint(this.mouse);
      this.#selectPoint(this.mouse);
      this.hovered = this.mouse;
    }
  }

  #handleMouseMove(evt) {
    this.mouse = new Point(evt.offsetX, evt.offsetY);

    this.hovered = getNearestPoint(
      this.mouse,
      this.graph.points,
      PREDEFINE.THRESHOLD
    );

    if (this.dragging) {
      this.selected.x = this.mouse.x;
      this.selected.y = this.mouse.y;
    }
  }

  display() {
    this.graph.draw(this.ctx);
    if (this.hovered) {
      this.hovered.draw(this.ctx, { fill: true });
    }

    if (this.selected) {
      const intent = this.hovered ?? this.mouse;
      new Segment(this.selected, intent).draw(this.ctx, { dash: [3, 3] });
      this.selected.draw(this.ctx, { outline: true });
    }
  }

  #selectPoint(point) {
    if (this.selected) {
      this.graph.tryAddSegment(new Segment(this.selected, point));
    }
    this.selected = point;
  }

  #removePoint(point) {
    this.graph.removePoint(point);
    this.hovered = null;
    if (this.selected == point) {
      this.selected = null;
    }
  }
}
