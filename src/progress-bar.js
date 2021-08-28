
class ProgressBar {
  display = 1;

  init(ctx, { x, y }) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
  }

  setDisplay(display) {
    this.display = display;
  }

  draw(rate) {
    const { ctx, display } = this;
    ctx.save();
    // ctx.rotate(-90 * Math.PI / 180);
    ctx.strokeStyle = '#FFFF00';
    ctx.fillStyle = '#FFFF00';
    ctx.strokeRect(this.x, this.y, display * 80, 7);
    ctx.fillRect(this.x, this.y, display * 80 * rate, 7);
    ctx.font = '10px Helvetica';
    ctx.textAlign = 'left';
    ctx.fillText(display ? "water quality" : "", 82, this.y + 6);
    ctx.restore();
  }
}

export default ProgressBar;
