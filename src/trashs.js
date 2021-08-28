import canImage from './images/can.png';
import circuitBoardImage from './images/circuit-board.png';
import plasticImage from './images/plastics.png';

const types = [
  {
    imageUrl: canImage,
    imageX: 305,
    imageY: 630,
    imageWidth: 1423,
    imageHeight: 817,
    scale: 0.03
  },
  {
    imageUrl: circuitBoardImage,
    imageX: 0,
    imageY: 0,
    imageWidth: 330,
    imageHeight: 510,
    scale: 0.08
  },
  {
    imageUrl: plasticImage,
    imageX: 315,
    imageY: 195,
    imageWidth: 1245,
    imageHeight: 1430,
    scale: 0.03
  }
]

class Trash {
  x = 0;
  y = 0;
  startX = 0;
  startY = 0;
  image = new Image();
  imageProperty = {};
  speed = 0.03;
  throwDirection = 'toLeft';
  status = 'takeout';

  throwRate = Math.random() * 0.2;
  dropX = 0;
  dropY = 0;

  hoverArea = 50 + Math.random() * 500;

  init(ctx, { rotate, canvasHeight, canvasWidth }, status) {
    this.ctx = ctx;
    this.rotate = rotate;
    this.canvasHeight = canvasHeight;
    this.canvasWidth = canvasWidth;
    this.status = status;

    const imageIndex = Math.round(Math.random() * 100) % 3;
    this.imageProperty = types[imageIndex];
    this.image.src = this.imageProperty.imageUrl;
    return this;
  }

  takeout(positionY) {
    if (this.status === 'takeout') {
      const { ctx, imageProperty, image } = this;
      const { imageX, imageY, imageWidth, imageHeight, scale } = imageProperty;
      ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight, 0, positionY, imageWidth * scale, imageHeight * scale);
    }
  }

  beginDrop({ x, y }) {
    this.status = 'droping';
    this.startX = x;
    this.startY = y;
    this.settle({ x, y });
  }

  settle({ x, y }) {
    this.x = x;
    this.y = y;
  }

  draw(gapTime) {
    // having started position
    if (this.status === 'droping' || this.status === 'done') {
      this.drop(gapTime)
    }

    if (this.status === 'static') {
      this.stay();
    }
  }

  stay() {
    const { ctx, imageProperty, image } = this;
    const { imageX, imageY, imageWidth, imageHeight, scale } = imageProperty;
    ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight, this.x, this.y, imageWidth * scale, imageHeight * scale);
  }

  drop(gapTime) {
    const { ctx, speed, imageProperty, image } = this;
    ctx.save();
    const { imageX, imageY, imageWidth, imageHeight, scale } = imageProperty;
    ctx.translate(this.startX, this.startY);

    // this.dropX += (this.rotate < 0 ? -speed * gapTime : speed * gapTime);
    // this.dropY = Math.pow(Math.abs(this.dropX), 2) * this.throwRate;

    // this.x += (this.rotate < 0 ? -speed * gapTime : speed * gapTime);

    // 是否到达海底
    if (this.y + this.hoverArea < this.canvasHeight) {
      this.dropX += (this.rotate < 0 ? -speed * gapTime : speed * gapTime);
      this.dropY = Math.pow(Math.abs(this.dropX), 2) * this.throwRate;
      this.y = this.startY + this.dropY;
      this.x += (this.rotate < 0 ? -speed * gapTime : speed * gapTime);
    } else {
      this.status = 'done';
    }

    ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight, this.dropX, this.dropY, imageWidth * scale, imageHeight * scale);
    ctx.restore();
  }
}

class Trashs {
  list = [];

  init(ctx, { canvasWidth, canvasHeight, airRate }, initTrashNum) {
    this.ctx = ctx;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.airRate = airRate;
    this.initTrashs(initTrashNum);
  }

  initTrashs(initTrashNum) {
    const { ctx, canvasHeight, canvasWidth, airRate } = this;

    const hadInited = !!this.list.find(item => item.status === 'static');
    if (hadInited) return;

    Array(initTrashNum).fill(0).forEach(() => {
      const trash = new Trash().init(ctx, { canvasHeight, canvasWidth }, 'static');
      const { imageWidth, imageHeight, scale } = trash.imageProperty;
      const x = (canvasWidth - imageWidth * scale) * (1 - Math.random());
      const yRangeStart = canvasHeight * (airRate + 30) / 100;
      const y = yRangeStart + (canvasHeight - yRangeStart - imageHeight * scale - 10) * (1 - Math.random());
      trash.settle({ x, y })
      this.list.push(trash);
    })
  }

  addTrash(trash) {
    this.list.push(trash);
  }

  getList() {
    return this.list;
  }

  setList(list) {
    this.list = list;
  }

  empty() {
    this.list = this.list.filter(item => {
      return item.status === 'takeout' || item.status === 'static';
    });
  }

  emptyDroping() {
    this.list = this.list.filter(item => {
      return item.status !== 'droping';
    });
  }

  getTrashCountInOcean() {
    const { canvasHeight, airRate } = this;
    return this.list.filter(item => item.y > canvasHeight * airRate / 100).length;
  }

  draw(gapTime) {
    // filter trash which is out of boundary.
    this.list = this.list.filter(item => {
      const { imageProperty: { imageWidth, scale } } = item;

      return !item.startX || (item.x > 0 && item.x < this.canvasWidth - imageWidth * scale)
    });

    this.list.forEach(item => item.draw(gapTime));
  }
}

export default Trashs;
export { Trash };
