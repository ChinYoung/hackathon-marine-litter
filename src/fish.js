import lFishImage from "./images/lfish.png";
import rFishImage from "./images/rfish.png";

const LEFT = 'left'
const RIGHT = 'right'

export class FishManager {
  constructor(context, canvasWidth, canvasHeight) {
    this.fishList = []
    this.context = context
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.imageMap = {
      left: lFishImage,
      right: rFishImage
    }
    this.maxFishCount = 10
    this.chance = 40
  }

  addFish() {
    const config = this.randomFishConfig()
    if (!config) {
      return false
    }
    const { direction, initX, initY, speedX, speedY, width, height } = config
    const fishUrl = this.imageMap[direction]
    const fishImage = new Image()
    fishImage.src = fishUrl
    const newFish = new Fish(fishImage, direction, initX, initY, width, height, speedX, speedY)
    this.fishList.push(newFish)
  }

  randomFishConfig() {
    const randomValue = Math.random() * 10000
    if (randomValue > this.chance) {
      return false
    }
    const direction = randomValue > (0.5 * this.chance) ? LEFT : RIGHT
    const speedyValue = Math.random()
    const speedY = (speedyValue > 0.7 ? 0.7 : speedyValue) * (Math.random() > 0.5 ? 1 : -1)
    return {
      direction: RIGHT,
      initX: 0,
      initY: this.canvasHeight - 150 - Math.random() * 100,
      speedX: 1,
      speedY,
      width: 50,
      height: 50
    }
  }

  draw() {
    this.fishList.forEach(fish => fish.draw(this.context))
  }

  reactToEnv(env) {
    if (!this.fishList.length < this.maxFishCount) {
      this.addFish()
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
  }
}

export class Fish {
  constructor(image, direction, initX, initY, width, height, speedX = 0.3, speedY = 0) {
    this.image = image
    this.direction = direction
    this.x = initX - width
    this.y = initY
    this.initialSpeedX = speedX
    this.currentSpeedX = speedX
    this.speedY = speedY
    this.yDirection = 1
    this.width = width
    this.height = height
    this.counter = 0
  }

  move() {
    if (!(this.counter % 260)) {
      const xRandomValue = Math.random()
      this.currentSpeedX = this.initialSpeedX + (xRandomValue < 0.5 ? xRandomValue : xRandomValue * 0.5 * -1)
    }
    if (!(this.counter % 150)) {
      const yRandomValue = Math.random()
      this.yDirection = yRandomValue > 0.5 ? 1 : -1
    }
    this.counter += 1

    this.x += (this.currentSpeedX) * (this.direction === LEFT ? -1 : 1)
    this.y += this.speedY * this.yDirection
  }

  draw(context) {
    this.move()
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}