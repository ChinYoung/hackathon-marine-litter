let img_dustList = [];
for (let i = 0; i < 7; i++) {
  let img = new Image();
  img.src = require('./images/dust' + i + '.png').default;
  img_dustList.push(img);
}

class Dust{
  constructor({ctx, canvasWidth, canvasHeight, oceanDeepth}) {
    this.ctx = ctx;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.oceanDeepth = oceanDeepth;
    this.deltaTime = 0;
  }
  init() {
    this.yMin = this.canvasHeight * (1 - this.oceanDeepth / 100);
    this.x = Math.random() * this.canvasWidth;
    this.y = this.yMin + Math.random() * this.canvasHeight * (this.oceanDeepth / 100);
    this.img = img_dustList[Math.floor(Math.random() * 7)];
    this.amplitude = Math.random() * 60 + 10;
  }
  draw(){
    this.deltaTime += 0.01;
    let sin = Math.sin(this.deltaTime);
    let quadraticEndX = this.x + sin * this.amplitude;
    this.ctx.drawImage(this.img, quadraticEndX, this.y);
  }
}

class Dusts {

  init(ctx, { canvasWidth, canvasHeight, oceanDeepth }) {
    this.ctx = ctx;
    this.dustList = [];
    this.dustNum = 30;
    for (let i = 0; i < this.dustNum; i++) {
      let dust = new Dust({
        ctx: this.ctx,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        oceanDeepth: oceanDeepth
      });
      this.dustList.push(dust);
      dust.init();
    }
  }

  draw() {
    const { ctx } = this;
    this.dustList.forEach(item => {
      item.draw();
    })
  }
}

export default Dusts;
