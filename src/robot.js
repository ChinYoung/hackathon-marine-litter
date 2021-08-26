import { lerpAngle, lerpDistance } from './helper';
class Robot {
  x = 0;
  y = 0;
  angle = 0;
  imageList = [];
  curIndex = 0;
  curTimeset = 0;

  init(ctx, { canvasWidth, canvasHeight, oceanDeepth }) {
    this.ctx = ctx;
    this.x = canvasWidth / 2;
    this.y = canvasHeight * (100 - oceanDeepth / 2) / 100;
    this.minY = canvasHeight * (1 - oceanDeepth / 100);
    this.maxY = canvasHeight - 188 * 0.5;
    this.minX = 0;
    this.maxX = canvasWidth - 170 * 0.5;

    for (let i = 1; i < 3; i++) {
      const img = new Image();
      img.src = require('./images/robot_' + i + '.png').default;
      this.imageList.push(img);
    }
  }

  draw(gapTime, { mouseX, mouseY }) {
    const { ctx, curIndex } = this;
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

    this.curTimeset += gapTime;
    if (this.curTimeset % 100 > 60) {
      this.curIndex = (curIndex + 1) % 2;
    }

    this.ctx.drawImage(this.imageList[this.curIndex], 18, 11, 170, 188, 0, 0, 170 * 0.5, 188 * 0.5);
    ctx.restore();
  }
}

export default Robot;
