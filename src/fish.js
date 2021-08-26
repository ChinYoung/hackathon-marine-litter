import { Image } from "zrender";
import rFish from "./images/rFish.png";

export class FishManager {
  constructor(zrHandler, canvasWidth, canvasHeight) {
    this.zrHandler = zrHandler
    this.fishList = []
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
  }

  addFish(fish) {
    this.zrHandler.add(fish.canvasEl)
    this.fishList.push({fish})
  }

  update() {
    if (!this.fishList.length) {
      const width = this.canvasWidth * 0.05
      const height = width * 0.48
      const newFish = new Fish(rFish, this.canvasWidth, this.canvasHeight * 0.7, width, height)
      this.addFish(newFish)
    }
  }
}


export class Fish {
  constructor(image, initX, initY, width, height, scale) {
    const zInstance = new Image({
      style: {
        x: initX,
        y: initY,
        width,
        height
      }
    })
    this.canvasEl = zInstance
  }
}