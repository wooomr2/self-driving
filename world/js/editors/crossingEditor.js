class CrossingEditor extends MarkingEditor {
  constructor(viewport, world) {
    super(viewport, world, world.graph.segments);
  }

  /** @override */
  createMarking(center, directionVector) {
    return new Crossing(
      center,
      directionVector,
      world.roadWidth,
      world.roadWidth / 2
    );
  }
}
