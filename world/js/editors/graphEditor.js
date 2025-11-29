class GraphEditor {
  constructor(viewport, graph) {
    this.viewport = viewport;
    this.graph = graph;

    this.canvas = viewport.canvas;
    this.ctx = this.canvas.getContext("2d");

    this.mouse = null;

    this.selected = null;
    this.hovered = null;
    this.dragging = false;
  }

  enable() {
    this.#addEventListeners();
  }

  disable() {
    this.#removeEventListeners();
    this.selected = null;
    this.hovered = null;
  }

  #addEventListeners() {
    // this.boundMouseDown = this.#handleMouseDown.bind(this);
    // this.boundMouseMove = this.#handleMouseMove.bind(this);
    this.mouseDown = (e) => this.#handleMouseDown(e);
    this.mouseMove = (e) => this.#handleMouseMove(e);
    this.mouseUp = () => (this.dragging = false);
    this.contextMenu = (e) => e.preventDefault();

    this.canvas.addEventListener("mousedown", this.mouseDown);
    this.canvas.addEventListener("mousemove", this.mouseMove);
    this.canvas.addEventListener("mouseup", this.mouseUp);
    this.canvas.addEventListener("contextmenu", this.contextMenu);

    window.addEventListener("keydown", (evt) => {
      if (this.hovered) {
        if (evt.key == "s") {
          this.start = this.hovered;
        }
        if (evt.key == "e") {
          this.end = this.hovered;
        }
      }
    });
  }

  #removeEventListeners() {
    this.canvas.removeEventListener("mousedown", this.mouseDown);
    this.canvas.removeEventListener("mousemove", this.mouseMove);
    this.canvas.removeEventListener("mouseup", this.mouseUp);
    this.canvas.removeEventListener("contextmenu", this.contextMenu);
  }

  #handleMouseMove(evt) {
    this.mouse = this.viewport.getMouse(evt, true);

    this.hovered = getNearestPoint(
      this.mouse,
      this.graph.points,
      PRE_DEFINES.THRESHOLD * this.viewport.zoom
    );

    if (this.dragging) {
      this.selected.x = this.mouse.x;
      this.selected.y = this.mouse.y;
    }
  }

  #handleMouseDown(evt) {
    if (evt.button == EVT_BTN_TYPE.MOUSE_RIGHT) {
      if (this.selected) {
        this.selected = null;
      } else if (this.hovered) {
        this.#removePoint(this.hovered);
      }
    }

    // USE-ALT-KEY::
    if (!evt.altKey && evt.button == EVT_BTN_TYPE.MOUSE_LEFT) {
      // if (evt.button == EVT_BTN_TYPE.MOUSE_LEFT) {
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

    if (this.start && this.end) {
      const path = this.graph.getShortestPath(this.start, this.end);

      for (const point of path) {
        point.draw(this.ctx, { size: 50, color: "blue" });
        if (point.prev) {
          new Segment(point, point.prev).draw(this.ctx, { width: 20 });
        }
      }
    }
  }

  dispose() {
    this.graph.dispose();
    this.selected = null;
    this.hovered = null;
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
