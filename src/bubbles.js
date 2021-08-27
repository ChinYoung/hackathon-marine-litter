class Bubble {
  constructor({ bubblePointList, ctx ,oceanDeepth}) {
    this.width = 10;
    this.height = 10;
    this.ctx = ctx;
    this.img = new Image();
    this.speed = 0.05;
    this.bubblePointList = bubblePointList;
    this.bubbleIndex = 0;
    this.type = 0;
    this.oceanDeepth = oceanDeepth;
  }

  init() {
    this.curWidth = 0;
    this.curHeight = 0;
    this.bubbleIndex = Math.round(Math.random() * (this.bubblePointList.length - 4)) + 2;
    this.speed = Math.random() * 0.1 + 0.09;
    this.img.src = require('./images/blue.png').default;
    this.alive = true;
  }

  draw() {
    let { y, ctx, curHeight, curWidth, img } = this;
    if (this.curWidth < this.width) {
      this.growing();
    } else {
      this.y -= this.speed * window.gapTime;
      if (y < this.ctx.canvas.height*(1-this.oceanDeepth/100)) {
        this.init();
        return false;
      }
    }
    ctx.drawImage(img, this.x - curWidth * 0.5, this.y - curHeight * 0.5, curWidth, curHeight);
  }

  die() {
    this.alive = false;
    this.curWidth = 0;
    this.curHeight = 0;
  }

  growing() {
    this.curWidth += (0.08 * this.speed) * window.gapTime;
    this.curHeight += (0.08 * this.speed) * window.gapTime;
    this.x = this.bubblePointList[this.bubbleIndex].x;
    this.y = this.bubblePointList[this.bubbleIndex].y;
  }
}

class Bubbles {
  init(ctx, kelpList, oceanDeepth) {
    this.ctx = ctx;
    this.kelpList = [];
    this.bubbleList = [];
    this.bubbleNum = 15;

    let bubblePointList = kelpList.map(item => ({
      x: item.x,
      y: item.height
    }));
    for (let i = 0; i < this.bubbleNum; i++) {
      let bubble = new Bubble({
        bubblePointList,
        ctx: this.ctx,
        oceanDeepth: oceanDeepth
      })
      this.bubbleList.push(bubble);
      bubble.init();
    }
  }

  
  draw(bubblePointList) {
    const { ctx } = this;
    this.bubbleList.forEach(item => {
      item.bubblePointList = bubblePointList;
      item.draw();
    });
  }
}

export default Bubbles;