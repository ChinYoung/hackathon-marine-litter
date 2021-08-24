
import './css/index.scss';
import { setRequestAnimFrame } from './helper';
import Waves from './waves';

setRequestAnimFrame();

const waves = new Waves();

window.onload = init;

function init() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const { canvasWidth, canvasHeight } = initCanvas(canvas);
  waves.init(ctx, { canvasWidth, canvasHeight });

  loopDraw(ctx, { canvasWidth, canvasHeight });
}

function loopDraw(ctx, { canvasWidth, canvasHeight }) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  loopDraw.gapTime = new Date() - loopDraw.preTime;
  if (loopDraw.gapTime > 40) loopDraw.gapTime = 40;
  loopDraw.preTime = new Date();

  animate();
  window.requestAnimationFrame(() => loopDraw(ctx, { canvasWidth, canvasHeight }));
}

function animate(params) {
  waves.draw();
}

function initCanvas(canvas) {
  let { offsetWidth, offsetHeight } = canvas.parentNode;
  canvas.width = offsetWidth;
  canvas.height = offsetHeight;

  return { canvasWidth: offsetWidth, canvasHeight: offsetHeight }
}