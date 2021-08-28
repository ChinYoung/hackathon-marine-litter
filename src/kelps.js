class Kelp {
  constructor({ x, y, height, width = 15, ctx }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.ctx = ctx;
    this.color = '#37524b';
    this.alpha = 0.7;
    this.deltaTime = 0;
    this.quadraticEndX = 0;
    this.quadraticEndY = 0;
  }

  draw(stopSwing = false) {
    let { x, ctx, height, width, color, alpha } = this;
    if (!stopSwing) {
      this.deltaTime += 0.01;
    }
    let sin = Math.sin(this.deltaTime);
    this.quadraticEndX = x + sin * 70;
    this.quadraticEndY = (ctx.canvas.height - height) + Math.abs(sin * 8);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, ctx.canvas.height);
    // ctx.lineTo(x, (ctx.canvas.height - height) * 1.18);
    ctx.quadraticCurveTo(x, (ctx.canvas.height - height) * 1.18, this.quadraticEndX, this.quadraticEndY);
    ctx.stroke(); // 进行绘制
    ctx.closePath();
    ctx.restore();
  }
}

class Kelps {

  init(ctx, { canvasWidth, canvasHeight }) {
    this.ctx = ctx;
    this.kelpList = [];
    this.kelpNum = 60;
    let gap = -50;
    for (let i = 0; i < this.kelpNum; i++) {
      let x = gap + (Math.random() * 1.2 + 0.3) * 15;
      let kelp = new Kelp({
        x,
        y: canvasHeight,
        height: 120 + Math.random() * 100,
        ctx: ctx
      })
      gap = x;
      this.kelpList.push(kelp);
    }
  }

  draw(stopSwing) {
    const { ctx } = this;
    for (let i = 0; i < this.kelpList.length; i++) {
      this.kelpList[i].draw(stopSwing);
    }
  }
}

export default Kelps;
