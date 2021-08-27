class Background {

	init(ctx, {canvasWidth, canvasHeight, airRate}) {
		this.ctx = ctx;
		this.canWidth = canvasWidth;
		this.canHeight = canvasHeight;
		this.img = new Image();
		this.airRate = airRate;
		this.img.src = require('./images/sky.png').default;
		this.skyHeight = this.canHeight * this.airRate/100;
	}

	draw() {
		this.ctx.drawImage(this.img, 0, 0, this.canWidth, this.skyHeight-10);
	}
}

export default Background;
