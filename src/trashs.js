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
  image = new Image();
  imageProperty = {};
  speed = 0.05;

  init(ctx) {
    this.ctx = ctx;
    const imageIndex = Math.round(Math.random() * 100) % 3;
    this.imageProperty = types[imageIndex];
    this.image.src = this.imageProperty.imageUrl;
    return this;
  }

  takeout(positionY) {
    if (!this.x && !this.y) {
      const { ctx, imageProperty, image } = this;
      const { imageX, imageY, imageWidth, imageHeight, scale } = imageProperty;
      ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight, 0, positionY, imageWidth * scale, imageHeight * scale);
    }
  }

  beginDrop({ x, y }) {
    this.x = x;
    this.y = y;
  }

  drop(gapTime) {
    const { ctx, speed, imageProperty, image } = this;
    const { imageX, imageY, imageWidth, imageHeight, scale } = imageProperty;

    this.y = this.y + speed * gapTime;

    if(this.y)

    ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight, this.x, this.y, imageWidth * scale, imageHeight * scale);
  }
}

class Trashs {
  list = [];

  addTrash(trash) {
    this.list.push(trash);
  }

  draw(gapTime) {
    this.list.forEach(item => item.x && item.y && item.drop(gapTime));
  }
}

export default Trashs;
export { Trash };
