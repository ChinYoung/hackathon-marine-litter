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

const configMap = {
  100: { maxFishCount: 20, chance: 300, maxFishGroupCount: 8, groupFishNumber: 10, addGroupGap: 120, randomAddGroupGap: 100 },
  90: { maxFishCount: 20, chance: 300, maxFishGroupCount: 6, groupFishNumber: 10, addGroupGap: 200, randomAddGroupGap: 100 },
  80: { maxFishCount: 20, chance: 200, maxFishGroupCount: 6, groupFishNumber: 8, addGroupGap: 200, randomAddGroupGap: 100 },
  70: { maxFishCount: 17, chance: 200, maxFishGroupCount: 3, groupFishNumber: 8, addGroupGap: 200, randomAddGroupGap: 100 },
  60: { maxFishCount: 15, chance: 150, maxFishGroupCount: 3, groupFishNumber: 7, addGroupGap: 400, randomAddGroupGap: 100 },
  50: { maxFishCount: 10, chance: 120, maxFishGroupCount: 3, groupFishNumber: 5, addGroupGap: 400, randomAddGroupGap: 100 },
  40: { maxFishCount: 6, chance: 100, maxFishGroupCount: 3, groupFishNumber: 4, addGroupGap: 500, randomAddGroupGap: 100 },
  30: { maxFishCount: 5, chance: 100, maxFishGroupCount: 1, groupFishNumber: 2, addGroupGap: 1000, randomAddGroupGap: 100 },
  20: { maxFishCount: 5, chance: 100, maxFishGroupCount: 1, groupFishNumber: 2, addGroupGap: 1000, randomAddGroupGap: 100 },
  10: { maxFishCount: 0, chance: 100, maxFishGroupCount: 0, groupFishNumber: 0, addGroupGap: 9999, randomAddGroupGap: 100 },
  0: { maxFishCount: 0, chance: 0, maxFishGroupCount: 0, groupFishNumber: 0, addGroupGap: 9999, randomAddGroupGap: 100 },
}

export class FishManager {
  constructor(context, canvasWidth, canvasHeight) {
    this.maxClarity = 100
    this.fishList = []
    this.fishGroupList = []
    this.context = context
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    const initConfig = configMap[50]
    const { maxFishCount, chance, maxFishGroupCount, groupFishNumber, addGroupGap } = initConfig

    // 最大鱼数量
    this.maxFishCount = maxFishCount

    // 出现鱼的机率
    this.chance = chance

    // 机率系数
    this.chanceFactor = 10000

    // 最大鱼群数
    this.maxFishGroupCount = maxFishGroupCount
    // 鱼群中的鱼数量
    this.groupFishNumber = groupFishNumber

    // 添加鱼群间隔系数
    this.addGroupGap = addGroupGap
    // 鱼群间隔计数器
    this.addFishGroupCounter = addGroupGap
  }

  // 根据环境系数调整数值
  reactToEnv(env) {
    const quality = parseInt((env / 100) * 10) * 10
    const { maxFishCount, chance, maxFishGroupCount, groupFishNumber, addGroupGap, randomAddGroupGap } = configMap[quality]
    this.maxFishCount = maxFishCount
    this.chance = chance
    this.maxFishGroupCount = maxFishGroupCount
    this.groupFishNumber = groupFishNumber
    this.addGroupGap = addGroupGap + Math.random() * randomAddGroupGap
    console.log(
      '环境系数:', quality,
      '最大鱼数量:', this.maxFishCount,
      '当前鱼数量:', this.fishList.length,
      '出鱼机率:', this.chance,
      '最大鱼群数:', this.maxFishGroupCount,
      '当前鱼群数:', this.fishGroupList.length,
      '鱼群的鱼数量:', this.groupFishNumber,
      '添加鱼群间隔:', this.addGroupGap,
      '添加鱼群间隔计数器:', this.addFishGroupCounter
    );
    if (!this.fishList.length < this.maxFishCount) {
      this.addFish()
    } else {
      this.reduceFish()
    }
    if (this.fishGroupList.length < this.maxFishGroupCount) {
      this.addFishGroup()
    } else {
      this.reduceFishGroup()
    }
  }

  reduceFish() {
    const gap = this.fishList.length - this.maxFishCount
    if (gap > 0) {
      let curFish
      for (let i = 0; i < gap; i++) {
        curFish = this.fishList[i]
        curFish.flee()
      }
    }
  }
  reduceFishGroup() {
    const gap = this.fishGroupList.length - this.maxFishGroupCount
    if (gap > 0) {
      let curGroup
      for (let i = 0; i < gap; i++) {
        curGroup = this.fishGroupList[i]
        curGroup.flee()
      }
    }
  }

  // 添加鱼
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

  // 添加鱼群
  addFishGroup() {
    if (this.addFishGroupCounter < this.addGroupGap) {
      this.addFishGroupCounter += 1
      this.addFishGroupCounter = this.addFishGroupCounter > this.addGroupGap ? 0 : this.addFishGroupCounter
      return false
    }
    const randomCount = parseInt((Math.random() + 0.5) * this.groupFishNumber)
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
    this.addFishGroupCounter = this.addFishGroupCounter > this.addGroupGap ? 0 : this.addFishGroupCounter
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

  update(env) {
    this.destoryOutRanged()
    this.reactToEnv(env)
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

// 鱼群
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
    this.isInFlee = false
  }

  arrange() {
    this.fishGroup.forEach((fish, index) => {
      if (index) {
        fish.x = fish.x + this.factor * this.fishWidth * (0.5 + Math.random()) * index
        fish.y = fish.y + (Math.random() > 0.5 ? 1 : -1) * (Math.random() + Math.random()) * this.fishHeight
      }
    });
  }

  flee() {
    if (!this.isInFlee) {
      this.fishGroup.forEach(fish => fish.flee())
      this.isInFlee = true
    }
  }

  draw(context) {
    this.fishGroup.forEach(fish => fish.draw(context));
  }
}

// 鱼
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
    this.isInFlee = false
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

  flee() {
    if (!this.isInFlee) {
      this.currentSpeedX = this.currentSpeedX * 6
      this.isInFlee = true
    }
  }

  draw(context) {
    this.move()
    context.drawImage(this.image, this.x, this.y, this.width * this.scale, this.height * this.scale);
  }
}