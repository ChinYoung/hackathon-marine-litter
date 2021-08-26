import robotImage from './images/robot.png';
import { lerpAngle, lerpDistance } from './helper';
class Robot {
  x = 0;
  y = 0;
  angle = 0;
  image = new Image();

  init(ctx, { canvasWidth, canvasHeight, oceanDeepth }) {
    this.ctx = ctx;
    this.image.src = robotImage;
    this.x = canvasWidth / 2;
    this.y = canvasHeight * (100 - oceanDeepth / 2) / 100;
    this.minY = canvasHeight * (1 - oceanDeepth / 100);
    this.maxY = canvasHeight - 112 * 0.8;
    this.minX = 0;
    this.maxX = canvasWidth - 115 * 0.8;
  }

  draw(gapTime, { mouseX, mouseY }) {
    const { ctx } = this;
    ctx.save();
    let betaAngle = Math.atan2(this.y - mouseY, this.x - mouseX);
    this.angle = lerpAngle(betaAngle, this.angle, 0.6);
    this.x = lerpDistance(mouseX, this.x, 0.9);
    this.y = lerpDistance(mouseY, this.y, 0.9);

    this.x = this.x < this.minX ? this.minX : this.x;
    this.x = this.x > this.maxX ? this.maxX : this.x;
    this.y = this.y < this.minY ? this.minY : this.y;
    this.y = this.y > this.maxY ? this.maxY : this.y;

    ctx.translate(this.x, this.y);
    // ctx.rotate(this.angle);

    this.ctx.drawImage(this.image, 0, 0, 115, 112, 0, 0, 115 * 0.8, 112 * 0.8);
    ctx.restore();
  }
}

export default Robot;
