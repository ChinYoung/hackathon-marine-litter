import handImage from './images/hands.png';
class Hand {
  x = 0;
  y = 0;
  speed = 0.05;
  image = new Image();

  init(ctx, { airRate, canvasWidth, canvasHeight, handWidth, handLength }) {
    this.ctx = ctx;
    const dY = Math.floor(canvasHeight * airRate / 100);
    this.x = 0;
    this.y = Math.floor(0.5 * dY);
    this.image.src = handImage;
    this.handWidth = handWidth;
    this.handLength = handLength;

    this.speed = Math.random() * 0.1 + 0.09;
  }

  draw() {
    const { ctx, image, x, y } = this;
    ctx.save();
    const originY = y - 405 * 0.3;
    ctx.translate(x, originY);
    ctx.rotate(90 * Math.PI / 180);
    ctx.drawImage(image, 62, 80, 145, 405, 0, -405 * 0.3, 145 * 0.3, 405 * 0.3);
    ctx.restore();
  }
}

export default Hand;
