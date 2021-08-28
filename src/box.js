class Box {

	lastTime = -1;

	init(ctx, { canvasWidth, canvasHeight }) {
		this.ctx = ctx;
		this.canWidth = canvasWidth;
		this.canHeight = canvasHeight;
		this.img = new Image();
		this.img.src = require('./images/box-4.png').default;
		this.skyHeight = this.canHeight * this.airRate / 100;
	}

	draw(seaClarity, gapTime) {
		if (this.lastTime <= 3000 && this.lastTime >= 0) {
			this.lastTime = this.lastTime + gapTime;
			this.drawBox();
			if (this.lastTime >= 5000) {
				this.lastTime = -1;
			}
		} else {
			if (seaClarity > 90 && seaClarity < 100 && Math.random() > 0.9) {
				this.text = "The sea is too clean. I can't go on throwing rubbish away.";
				this.drawBox();
				this.lastTime = 0;
			}else if(seaClarity < 10 && seaClarity > 0 && Math.random() > 0.9){
				this.text = "The sea is so dirty, it shouldn't be a problem to throw out some trash.";
				this.drawBox();
				this.lastTime = 0;
			}
		}
	}

	drawBox() {
		this.img.setAttribute('crossOrigin', 'anonymous');
		this.ctx.drawImage(this.img, 130, -15, 440, 150);
		this.ctx.font = '18px Helvetica';
		this.ctx.textAlign = 'center';
		this.ctx.fillText(this.text, 350, 75, 300);
	}
}

export default Box;
