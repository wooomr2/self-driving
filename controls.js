class Controls {
  constructor(type) {
    this.forward = false;
    this.left = false;
    this.right = false;
    this.reverse = false;

    switch (type) {
      case CONTROL_TYPE.KEYS:
        this.#addKeyboardListeners();
        break;
      case CONTROL_TYPE.DUMMY:
        this.forward = true;
        break;
      default:
        break;
    }
  }

  #addKeyboardListeners() {
    // arrow function is used to preserve the value of `this`
    document.onkeydown = (event) => {
      switch (event.key) {
        case KEY_EVENT.ARROW_LEFT:
          this.left = true;
          break;
        case KEY_EVENT.ARROW_RIGHT:
          this.right = true;
          break;
        case KEY_EVENT.ARROW_UP:
          this.forward = true;
          break;
        case KEY_EVENT.ARROW_DOWN:
          this.reverse = true;
          break;
      }
      // console.table(this);
    };

    document.onkeyup = (event) => {
      switch (event.key) {
        case KEY_EVENT.ARROW_LEFT:
          this.left = false;
          break;
        case KEY_EVENT.ARROW_RIGHT:
          this.right = false;
          break;
        case KEY_EVENT.ARROW_UP:
          this.forward = false;
          break;
        case KEY_EVENT.ARROW_DOWN:
          this.reverse = false;
          break;
      }
      console.table(this);
    };
  }
}
