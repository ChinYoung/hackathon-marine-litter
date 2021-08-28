class Background {

	init(ctx, {canvasWidth, canvasHeight, airRate}) {
		this.ctx = ctx;
		this.canWidth = canvasWidth;
		this.canHeight = canvasHeight;
		this.img = new Image();
		this.airRate = airRate;
		this.img.src = require('./images/sky.png').default;
		this.skyHeight = this.canHeight * this.airRate/100;
		this.moveCounterBase = 8000
		this.moveCounter = 0
		this.moveFactor = 1
		this.bouncingPercent = 0.25
	}

	draw() {
		this.ctx.drawImage(this.img, this.canWidth * (-1 * 0.25 + this.moveCounter / this.moveCounterBase), 0, this.canWidth * 1.5, this.skyHeight * 1.1 - 10);
		this.moveCounter += this.moveFactor
		if (this.moveCounter >= this.moveCounterBase * this.bouncingPercent) {
			this.moveFactor = -1
		}
		if (this.moveCounter <= -1 * this.moveCounterBase * this.bouncingPercent) {
			this.moveFactor = 1
		}
	}
}

export default Background;
