import handImage from './images/hands.png';

class Hand {
  x = 0;
  y = 0;
  positionY = 0;  // 手初始位置
  reachOut = false; // 手是否伸出来了
  speed = 0.05;  // 伸手速度
  imageScale = 0.3;
  canvasHeight = 0;
  timer = 0;
  peroid = 2000;

  image = new Image();
  imageProperty = {
    imageX: 62,
    imageY: 80,
    rawHandWidth: 145,
    rawHandLength: 405
  };

  init(
    ctx,
    { airRate, x = 0, canvasHeight, rotate = 90 } = {},
    { imageX = 62, imageY = 80, rawHandWidth = 145, rawHandLength = 405 } = {},
    { peroid = 2000, speed = 0.05 } = {}
  ) {
    this.ctx = ctx;
    this.imageProperty = { imageX, imageY, rawHandLength, rawHandWidth };
    this.peroid = peroid;
    this.speed = speed;

    const handWidth = rawHandWidth * this.imageScale;
    this.x = x;
    this.rotate = rotate
    this.y = Math.floor(Math.random() * (canvasHeight * airRate / 100 - handWidth));
    this.airRate = airRate;
    this.canvasHeight = canvasHeight;
    this.image.src = handImage;
    this.speed = Math.random() * 0.1 + 0.08;
    return this;
  }

  update(
    { imageX = 62, imageY = 80, rawHandWidth = 145, rawHandLength = 405 } = {},
    { peroid = 2000, speed = 0.05 } = {}
  ) {
    this.imageProperty = { imageX, imageY, rawHandWidth, rawHandLength };
    this.peroid = peroid;
    this.speed = speed;

    // const handWidth = rawHandWidth * this.imageScale;
    // const { canvasHeight, airRate } = this;
    // this.y = Math.floor(Math.random() * (canvasHeight * airRate / 100 - handWidth));
  }

  draw(gapTime) {
    const { ctx, image, x, y, positionY, imageScale, rotate, peroid } = this;
    this.timer += gapTime;
    if (this.timer < peroid) {
      return false;
    }

    if (positionY > 0) {
      this.positionY = 0;
      this.reachOut = false;
      this.timer = 0;
    }

    const { imageX, imageY, rawHandWidth, rawHandLength } = this.imageProperty;
    const handWidth = rawHandWidth * imageScale;
    const handLength = rawHandLength * imageScale;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotate * Math.PI / 180);

    this.positionY = !this.reachOut ? positionY - this.speed * gapTime : positionY + this.speed * gapTime;

    if (this.positionY < -handLength) {
      this.positionY = -handLength;
      this.reachOut = true;
    }

    ctx.drawImage(image, imageX, imageY, rawHandWidth, rawHandLength, 0, this.positionY, handWidth, handLength);
    ctx.restore();
  }
}

class Hands {
  list = [];
  speed = 0.05;
  peroid = 200;

  handTypes = [
    { imageX: 62, imageY: 80, rawHandWidth: 145, rawHandLength: 405 },
    { imageX: 224, imageY: 190, rawHandWidth: 140, rawHandLength: 296 },
    { imageX: 382, imageY: 62, rawHandWidth: 140, rawHandLength: 425 },
    { imageX: 540, imageY: 140, rawHandWidth: 140, rawHandLength: 347 },
  ]

  init(ctx, count = 10, { airRate, canvasWidth, canvasHeight }) {
    this.airRate = airRate;
    this.canvasHeight = canvasHeight;
    this.canvasWidth = canvasWidth;

    const { list, handTypes } = this;
    const { length } = list;
    const leftHandCount = Math.round(count / 2);
    const rightHandCount = Math.floor(count / 2);
    for (let i = 0; i < leftHandCount; i++) {
      const typeIndex = (Math.round(Math.random() * 10) + i) % 3;
      list.push(new Hand().init(ctx, { airRate, canvasHeight }, handTypes[typeIndex]));
    }
    for (let j = 0; j < rightHandCount; j++) {
      const typeIndex = (Math.round(Math.random() * 10) + j) % 3;
      list.push(new Hand().init(ctx, { airRate, canvasHeight, x: canvasWidth, rotate: -90 }, handTypes[typeIndex]));
    }
  }

  update({ speed, peroid }) {
    this.speed = speed;
    this.peroid = peroid;
  }

  draw(gapTime) {
    const { list } = this;
    list.forEach(item => {
      item.draw(gapTime)
    });
  }
}

export default Hands;
