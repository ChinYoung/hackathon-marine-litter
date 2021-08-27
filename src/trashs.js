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

  throwRate = Math.random() * 0.2;
  dropX = 0;
  dropY = 0;

  hoverArea = 50 + Math.random() * 500;

  init(ctx, { rotate, canvasHeight, canvasWidth }) {
    this.ctx = ctx;
    this.rotate = rotate;
    this.canvasHeight = canvasHeight;
    this.canvasWidth = canvasWidth;

    const imageIndex = Math.round(Math.random() * 100) % 3;
    this.imageProperty = types[imageIndex];
    this.image.src = this.imageProperty.imageUrl;
    return this;
  }

  takeout(positionY) {
    if (!this.startX && !this.startY) {
      const { ctx, imageProperty, image } = this;
      const { imageX, imageY, imageWidth, imageHeight, scale } = imageProperty;
      ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight, 0, positionY, imageWidth * scale, imageHeight * scale);
    }
  }

  beginDrop({ x, y }) {
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
  }

  drop(gapTime) {
    const { ctx, speed, imageProperty, image } = this;
    ctx.save();
    const { imageX, imageY, imageWidth, imageHeight, scale } = imageProperty;
    ctx.translate(this.startX, this.startY);

    // this.dropX += (this.rotate < 0 ? -speed * gapTime : speed * gapTime);
    // this.dropY = Math.pow(Math.abs(this.dropX), 2) * this.throwRate;

    // this.x += (this.rotate < 0 ? -speed * gapTime : speed * gapTime);

    // 到达海底
    if (this.y + this.hoverArea < this.canvasHeight) {
      this.dropX += (this.rotate < 0 ? -speed * gapTime : speed * gapTime);
      this.dropY = Math.pow(Math.abs(this.dropX), 2) * this.throwRate;
      this.y = this.startY + this.dropY;
      this.x += (this.rotate < 0 ? -speed * gapTime : speed * gapTime);
    }

    ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight, this.dropX, this.dropY, imageWidth * scale, imageHeight * scale);
    ctx.restore();
  }
}

class Trashs {
  list = [];

  init({ canvasWidth }) {
    this.canvasWidth = canvasWidth;
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

  getDropingTrashCount() {
    return this.list.filter(item => item.startX && item.startY).length;
  }

  draw(gapTime) {
    // filter trash which is out of boundary.
    this.list = this.list.filter(item => {
      const { imageProperty: { imageWidth, scale } } = item;

      return !item.startX || (item.x > 0 && item.x < this.canvasWidth - imageWidth * scale)
    });

    this.list.forEach(item => item.startX && item.startY && item.drop(gapTime));
  }
}

export default Trashs;
export { Trash };
