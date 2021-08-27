import lFishImage from "./images/lfish.png";
import rFishImage from "./images/rfish.png";

const LEFT = 'left'
const RIGHT = 'right'

const lFishImageInstance = new Image()
lFishImageInstance.src = lFishImage

const rFishImageInstance = new Image()
rFishImageInstance.src = rFishImage
const imageMap = {
  left: lFishImageInstance,
  right: rFishImageInstance
}

export class FishManager {
  constructor(context, canvasWidth, canvasHeight) {
    this.fishList = []
    this.fishGroupList = []
    this.context = context
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.maxFishCount = 10
    this.maxFishGroupCount = 3
    this.chance = 40
    this.addFishGroupCounter = 0
    this.addGroupGapBase = 600
  }

  addFish() {
    const randomValue = Math.random() * 10000
    if (randomValue > this.chance) {
      return false
    }
    const config = this.randomFishConfig()
    const { canvasWidth, canvasHeight } = this
    const { direction, initX, initY, speedX, speedY, scale } = config
    const fishImage = imageMap[direction]
    const newFish = new Fish({ image: fishImage, direction, initX, initY, speedX, speedY, scale, enableRandom: true })
    this.fishList.push(newFish)
  }

  addFishGroup() {
    console.log(this.addFishGroupCounter);
    if ((this.addFishGroupCounter % this.addGroupGapBase) !== 0) {
      this.addFishGroupCounter += 1
      this.addFishGroupCounter = this.addFishGroupCounter % this.addGroupGapBase
      return false
    }
    console.log('add group');
    let randomCount = parseInt(Math.random() * 100) % 6
    randomCount = randomCount < 3 ? 3 : randomCount
    const newFishGroup = new FishGroup({
      count: randomCount,
      canvasHeight: this.canvasHeight,
      canvasWidth: this.canvasWidth,
      direction: RIGHT,
      scale: 0.02,
      speedX: 0.2
    })
    this.fishGroupList.push(newFishGroup)
    this.addFishGroupCounter += 1
    this.addGroupGapBase = 600 + parseInt(Math.random() * 200)
  }


  randomFishConfig() {
    const randomValue = Math.random()
    const direction = randomValue > 0.5 ? LEFT : RIGHT
    const speedyValue = Math.random()
    const speedY = (speedyValue > 0.7 ? 0.7 : speedyValue) * (Math.random() > 0.5 ? 1 : -1)
    return {
      direction: RIGHT,
      initX: 0,
      initY: this.canvasHeight - 150 - Math.random() * 100,
      speedX: 1,
      speedY,
      scale: 0.03
    }
  }

  draw() {
    this.fishList.forEach(fish => fish.draw(this.context))
    this.fishGroupList.forEach(group => group.draw(this.context))
  }

  reactToEnv(env) {
    if (!this.fishList.length < this.maxFishCount) {
      this.addFish()
    }
    if (this.fishGroupList.length < this.maxFishGroupCount) {
      this.addFishGroup()
    }
  }

  update(env) {
    this.destoryOutRanged()
    this.reactToEnv()
    this.draw()
  }

  destoryOutRanged() {
    const self = this
    this.fishList = this.fishList.filter(fish => {
      if (fish.direction === LEFT && fish.x < -1 * (fish.width)) {
        console.log('destory');
        return false
      }
      if (fish.direction === RIGHT && fish.x > self.canvasWidth) {
        console.log('destory');
        return false
      }
      return true
    })
    this.fishGroupList = this.fishGroupList.filter(group => {
      const sortedXList = group.fishGroup.map(fish => fish.x).sort((a, b) => (a > b ? 1 : -1))
      // console.log(sortedXList);
      const mostLeftX = sortedXList[0]
      const mostRightX = sortedXList[sortedXList.length - 1]
      if (group.direction === RIGHT && mostLeftX > this.canvasWidth) {
        return false
      }
      if (group.direction === LEFT && mostRightX < 0) {
        return false
      }
      return true
    })
  }
}

export class FishGroup {
  constructor({ count, scale, speedX, direction, canvasWidth, canvasHeight }) {
    this.fishImage = imageMap[direction]
    this.fishWidth = this.fishImage.width * scale
    this.fishHeight = this.fishImage.height * scale

    this.fishGroup = new Array(count).fill().map(_ => new Fish({
      image: this.fishImage,
      direction: direction,
      initX: direction === RIGHT ? (-1 * this.fishWidth) : canvasWidth,
      initY: canvasHeight * 0.5 + (canvasHeight * 0.1 * Math.random()),
      scale,
      enableRandom: false,
      speedX: speedX,
      speedY: 0
    }))
    this.scale = scale
    this.direction = direction
    this.factor = direction === RIGHT ? -1 : 1
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.arrange()
  }

  arrange() {
    this.fishGroup.forEach((fish, index) => {
      if (index) {
        fish.x = fish.x + this.factor * this.fishWidth * (0.5 + Math.random()) * index
        fish.y = fish.y + (Math.random() > 0.5 ? 1 : -1) * (Math.random() + Math.random()) * this.fishHeight
      }
    });
  }

  draw(context) {
    this.fishGroup.forEach(fish => fish.draw(context));
  }
}

export class Fish {
  constructor({ image, direction, initX, initY, speedX = 0.3, speedY = 0, scale, enableRandom = false }) {
    this.image = image
    this.width = image.width
    this.height = image.height
    this.scale = scale
    this.enableRandom = enableRandom
    this.direction = direction
    this.x = initX
    this.y = initY
    this.initialSpeedX = speedX
    this.currentSpeedX = speedX
    this.speedY = speedY
    this.yDirection = 1
    this.counter = 0
  }

  move() {
    if (!(this.counter % 260) && this.enableRandom) {
      const xRandomValue = Math.random()
      this.currentSpeedX = this.initialSpeedX + (xRandomValue < 0.5 ? xRandomValue : xRandomValue * 0.5 * -1)
    }
    if (!(this.counter % 150) && this.enableRandom) {
      const yRandomValue = Math.random()
      this.yDirection = yRandomValue > 0.5 ? 1 : -1
    }
    this.counter += 1
    this.x += (this.currentSpeedX) * (this.direction === LEFT ? -1 : 1)
    this.y += this.speedY * this.yDirection
  }

  draw(context) {
    this.move()
    context.drawImage(this.image, this.x, this.y, this.width * this.scale, this.height * this.scale);
  }
}