class StartEditor extends MarkingEditor {
    constructor(viewport, world) {
      super(viewport, world, world.laneGuides);
    }
  
    /** @override */
    createMarking(center, directionVector) {
      return new Start(
        center,
        directionVector,
        world.roadWidth / 2,
        world.roadWidth / 2
      );
    }
  }
  