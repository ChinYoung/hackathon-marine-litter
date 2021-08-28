import { lerpAngle, lerpDistance, calLength2 } from './helper';
class Robot {
  x = 0;
  y = 0;
  angle = 0;
  imageList = [];
  curIndex = 0;
  curTimeset = 0;
  collectNum = 0;

  // 台词列表
  robotLineList = []
  // 间隔时间内收集垃圾计数
  collectedCount = 0
  // 台词显示间隔
  initRobotLineCount = 300
  // 台词显示计数器
  robotLineCounter = this.initRobotLineCount
  // 触发台词所需收集数
  triggerLineCount = 5

  trashs;

  constructor(trashs) {
    this.trashs = trashs;
  }

  init(ctx, { canvasWidth, canvasHeight, oceanDeepth }) {
    this.ctx = ctx;
    this.x = 0;
    this.y = canvasHeight * (100 - oceanDeepth) / 100;
    this.minY = canvasHeight * (1 - oceanDeepth / 100);
    this.maxY = canvasHeight - 188 * 0.4;
    this.minX = 0;
    this.maxX = canvasWidth - 170 * 0.4;

    for (let i = 1; i < 3; i++) {
      const img = new Image();
      img.src = require('./images/robot_' + i + '.png').default;
      this.imageList.push(img);
    }

    for (let i = 1; i < 5; i++) {
      const img = new Image();
      img.src = require('./images/robot_lines/line' + i + '.png').default;
      this.robotLineList.push(img);
    }
  }

  draw(gapTime, { mouseX, mouseY }) {
    const { ctx, curIndex } = this;
    ctx.save();
    let betaAngle = Math.atan2(this.y - mouseY, this.x - mouseX);
    this.angle = lerpAngle(betaAngle, this.angle, 0.6);
    this.x = lerpDistance(mouseX, this.x, 0.99);
    this.y = lerpDistance(mouseY, this.y, 0.99);

    this.x = this.x < this.minX ? this.minX : this.x;
    this.x = this.x > this.maxX ? this.maxX : this.x;
    this.y = this.y < this.minY ? this.minY : this.y;
    this.y = this.y > this.maxY ? this.maxY : this.y;

    ctx.translate(this.x, this.y);
    // ctx.rotate(this.angle);

    // this.curTimeset += gapTime;
    // if (this.curTimeset % 100 > 60) {
    //   this.curIndex = (curIndex + 1) % 2;
    // }

    this.ctx.drawImage(this.imageList[this.curIndex], 18, 11, 170, 188, 0, 0, 170 * 0.4, 188 * 0.4);
    this.drawRobotLine()
    ctx.restore();
  }

  // 绘制台词
  drawRobotLine() {
    if (!this.randomLineImage && this.collectedCount > this.triggerLineCount && this.robotLineCounter > 0) {
      this.randomLineImage = this.robotLineList[(parseInt(Math.random() * 100) % 4)]
      this.robotLineLife = 200
    }
    if (this.randomLineImage && this.robotLineLife >= 0) {
      const image = this.randomLineImage
      const scale = 0.5
      const lineWith = image.width * scale
      const lineHeight = image.height * scale
      this.ctx.drawImage(image, -2, -1 * lineHeight, lineWith, lineHeight)
      this.robotLineLife -= 1
    }
    if (this.robotLineLife < 0) {
      this.robotLineLife = 0
      this.randomLineImage = null
      this.robotLineCounter = this.initRobotLineCount
      this.collectedCount = 0
    }
    if (this.robotLineCounter < 0) {
      this.robotLineCounter = this.initRobotLineCount
      this.collectedCount = 0
    }
    this.robotLineCounter -= 1
  }

  collectTrashs() {
    const trashList = this.trashs.getList();
    const newTrashList = trashList.filter(item => {
      let gap = calLength2(item.x, item.y, this.x, this.y);
      return gap >= 4000
    });

    this.collectNum += trashList.length - newTrashList.length;
    this.collectedCount += (trashList.length - newTrashList.length)
    this.trashs.setList(newTrashList);
  }
}

export default Robot;
