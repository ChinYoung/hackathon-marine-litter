import handImage from './images/hands.png';
import { Trash } from './trashs';

class Hand {
  x = 0;
  y = 0;
  positionY = 0;  // 手初始位置
  reachOut = false; // 手是否伸出来了
  imageScale = 0.3;
  canvasHeight = 0;
  canvasWidth = 0;
  timer = 0;

  peroid = 0;
  speed = 0;  // 伸手速度
  nextSpeed = 0.05;
  nextPeroid = 2000;

  image = new Image();
  imageProperty = {
    imageX: 62,
    imageY: 80,
    rawHandWidth: 145,
    rawHandLength: 405
  };

  trashs;
  trash;

  constructor(trashs) {
    this.trashs = trashs;
  }

  init(
    ctx,
    { airRate, x = 0, canvasWidth, canvasHeight, rotate = 90 } = {},
    { imageX = 62, imageY = 80, rawHandWidth = 145, rawHandLength = 405 } = {},
    { noThrowThreshold, qualityValuePerTrash }
  ) {
    this.ctx = ctx;
    this.noThrowThreshold = noThrowThreshold;
    this.qualityValuePerTrash = qualityValuePerTrash;
    this.imageProperty = { imageX, imageY, rawHandLength, rawHandWidth };
    // this.nextPeroid = peroid;
    // this.nextSpeed = speed;
    this.canvasWidth = canvasWidth;

    const handWidth = rawHandWidth * this.imageScale;
    this.x = x;
    this.rotate = rotate
    this.y = Math.floor(Math.random() * (canvasHeight * airRate / 100 - handWidth));
    this.airRate = airRate;
    this.canvasHeight = canvasHeight;
    this.image.src = handImage;
    // this.speed = Math.random() * 0.1 + 0.08;
    return this;
  }

  update(
    // { imageX = 62, imageY = 80, rawHandWidth = 145, rawHandLength = 405 } = {},
    { nextPeroid = 2000, nextSpeed = 0.05 } = {}
  ) {
    // this.imageProperty = { imageX, imageY, rawHandWidth, rawHandLength };
    this.nextPeroid = nextPeroid;
    this.nextSpeed = nextSpeed;
    // const handWidth = rawHandWidth * this.imageScale;
    // const { canvasHeight, airRate } = this;
    // this.y = Math.floor(Math.random() * (canvasHeight * airRate / 100 - handWidth));
  }

  draw(gapTime, seaClarity) {
    const { ctx, image, x, y, positionY, imageScale, rotate, canvasWidth, canvasHeight, airRate } = this;
    this.timer += gapTime;
    if (this.peroid && this.timer < this.peroid) {
      return false;
    }

    if (positionY >= 0) {
      this.speed = this.nextSpeed;
      this.peroid = this.nextPeroid;
      this.positionY = 0;
      this.reachOut = false;
      this.timer = 0;
      this.trash = new Trash().init(ctx, { rotate, canvasHeight, canvasWidth }, 'takeout');
      this.trashs.addTrash(this.trash);
    }

    const { imageX, imageY, rawHandWidth, rawHandLength } = this.imageProperty;
    const handWidth = rawHandWidth * imageScale;
    const handLength = rawHandLength * imageScale;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotate * Math.PI / 180);

    this.positionY = !this.reachOut ? positionY - this.speed * gapTime : positionY + this.speed * gapTime;

    ctx.drawImage(image, imageX, imageY, rawHandWidth, rawHandLength, 0, this.positionY, handWidth, handLength);
    this.trash.takeout(this.positionY);
    ctx.restore();
    if (this.positionY < -handLength) {
      this.positionY = -handLength;
      this.reachOut = true;
      if (seaClarity < 100 - this.noThrowThreshold * this.qualityValuePerTrash) {
        this.trash.beginDrop({ x: x === 0 ? handLength : canvasWidth - handLength, y });
      }
    }
  }
}

class Hands {
  list = [];
  trashs = [];

  handTypes = [
    { imageX: 62, imageY: 80, rawHandWidth: 145, rawHandLength: 405 },
    { imageX: 224, imageY: 190, rawHandWidth: 140, rawHandLength: 296 },
    { imageX: 382, imageY: 62, rawHandWidth: 140, rawHandLength: 425 },
    { imageX: 540, imageY: 140, rawHandWidth: 140, rawHandLength: 347 },
  ]

  constructor(trashs) {
    this.trashs = trashs;
  }

  init(ctx, count = 10, { airRate, canvasWidth, canvasHeight }, seaClarity, { noThrowThreshold, qualityValuePerTrash }) {
    this.airRate = airRate;
    this.canvasHeight = canvasHeight;
    this.canvasWidth = canvasWidth;

    const { list, handTypes } = this;
    const leftHandCount = Math.round(count / 2);
    const rightHandCount = Math.floor(count / 2);
    for (let i = 0; i < leftHandCount; i++) {
      const typeIndex = (Math.round(Math.random() * 10) + i) % 3;
      const hand = new Hand(this.trashs).init(ctx, { airRate, canvasHeight, canvasWidth }, handTypes[typeIndex], { noThrowThreshold, qualityValuePerTrash });
      hand.update(this.calculateSpeedAndPeriod(seaClarity));
      list.push(hand);
    }
    for (let j = 0; j < rightHandCount; j++) {
      const typeIndex = (Math.round(Math.random() * 10) + j) % 3;
      const hand = new Hand(this.trashs).init(ctx, { airRate, canvasHeight, canvasWidth, x: canvasWidth, rotate: -90 }, handTypes[typeIndex], { noThrowThreshold, qualityValuePerTrash });
      hand.update(this.calculateSpeedAndPeriod(seaClarity));
      list.push(hand);
    }
  }

  calculateSpeedAndPeriod(seaClarity) {
    const nextSpeed = 0.8 - (seaClarity / 100 * 0.7622);
    const nextPeroid = 100 + seaClarity / 100 * 5900;

    return { nextSpeed, nextPeroid };
  }

  draw(gapTime, seaClarity) {
    const { list } = this;
    const { nextPeroid, nextSpeed } = this.calculateSpeedAndPeriod(seaClarity);
    list.forEach(item => {
      item.update({ nextSpeed, nextPeroid });
      item.draw(gapTime, seaClarity)
    });
  }
}

export default Hands;
