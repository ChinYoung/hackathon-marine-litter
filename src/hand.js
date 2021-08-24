class Hand {
  constructor({ airRate, canvasWidth, canvasHeight }) {
    const dY = canvasHeight * (1 - (airRate / 100));
    this.x = 0;
    this.y = 0.5 * dY;
  }

  draw() {

  }
}

export default Hand;
