class Wave {
  constructor({
    canvasWidth, // 轴长
    canvasHeight, // 轴高
    waveWidth = 0.055, // 波浪宽度,数越小越宽
    waveHeight = 6, // 波浪高度,数越大越高
    xOffset = 0,
    speed = 0.04,
    colors = ['#DBB77A', '#BF8F3B'], // 波浪颜色
  } = {}) {
    this.points = [];
    this.startX = 0;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.waveWidth = waveWidth;
    this.waveHeight = waveHeight;
    this.xOffset = xOffset;
    this.speed = speed;
    this.colors = colors;
  }
  getChartColor(ctx) {
    const radius = this.canvasWidth / 2;
    const grd = ctx.createLinearGradient(radius, radius, radius, this.canvasHeight);
    grd.addColorStop(0, this.colors[0]);
    grd.addColorStop(1, this.colors[1]);
    return grd;
  }
  draw(ctx) {
    ctx.save();
    const points = this.points;
    ctx.beginPath();
    for (let i = 0; i < points.length; i += 1) {
      const point = points[i];
      ctx.lineTo(point[0], point[1]);
    }
    ctx.lineTo(this.canvasWidth, this.canvasHeight);
    ctx.lineTo(this.startX, this.canvasHeight);
    ctx.lineTo(points[0][0], points[0][1]);
    ctx.fillStyle = this.getChartColor(ctx);
    ctx.fill();
    ctx.restore();
  }
  update({
    nowRange,
  } = {}) {
    this.points = [];
    const {
      startX, waveHeight, waveWidth, canvasWidth, canvasHeight, xOffset,
    } = this;
    for (let x = startX; x < startX + canvasWidth; x += 20 / canvasWidth) {
      const y = Math.sin(((startX + x) * waveWidth) + xOffset);
      const dY = canvasHeight * (1 - (nowRange / 100));
      this.points.push([x, dY + (y * waveHeight)]);
    }
    this.xOffset += this.speed;
  }
}

class Waves {
  init(ctx, { canvasWidth, canvasHeight, rangeValue }) {
    this.ctx = ctx;
    this.nowRange = 0;
    this.rangeValue = rangeValue || 60;

    this.wave1 = new Wave({
      canvasWidth, // 轴长
      canvasHeight, // 轴高
      waveWidth: 0.055, // 波浪宽度,数越小越宽
      waveHeight: 4, // 波浪高度,数越大越高
      colors: ['#6495ED','#4169E1'], // 波浪颜色
      xOffset: 0, // 初始偏移
      speed: 0.04, // 速度
    });
    this.wave2 = new Wave({
      canvasWidth, // 轴长
      canvasHeight, // 轴高
      waveWidth: 0.04, // 波浪宽度,数越小越宽
      waveHeight: 3, // 波浪高度,数越大越高
      colors: ['rgba(100, 149, 237, 0.48)', 'rgba(65, 105, 225, 0.48)'], // 波浪颜色
      xOffset: 2, // 初始偏移
      speed: 0.02, // 速度
    });
  }

  draw() {
    const { ctx } = this;

    if (this.nowRange <= this.rangeValue) {
      this.nowRange += 1;
    }
    if (this.nowRange > this.rangeValue) {
      this.nowRange -= 1;
    }
    this.wave2.update({
      nowRange: this.nowRange,
    });
    this.wave2.draw(ctx);
    this.wave1.update({
      nowRange: this.nowRange,
    });
    this.wave1.draw(ctx);
  }
}

export default Waves;
