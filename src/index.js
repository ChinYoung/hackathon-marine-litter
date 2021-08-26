
import './css/index.scss';
import { setRequestAnimFrame } from './helper';
import Waves from './waves';
import Hands from './hands';
import Robot from './robot';
import Kelps from './kelps';
import Trashs from './trashs';

setRequestAnimFrame();
const oceanDeepth = 70;
const airRate = 30;

let mouseX = 0;
let mouseY = 0;

const waves = new Waves();
const trashs = new Trashs();
const hands = new Hands(trashs);
const robot = new Robot();
const kelps = new Kelps();

window.onload = init;

function init() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const { canvasWidth, canvasHeight } = initCanvas(canvas);
  waves.init(ctx, { canvasWidth, canvasHeight, rangeValue: oceanDeepth });
  hands.init(ctx, 6, { airRate, canvasHeight, canvasWidth });
  robot.init(ctx, { canvasWidth, canvasHeight, oceanDeepth });
  kelps.init(ctx, { canvasWidth, canvasHeight });
  // trash.init(ctx);

  loopDraw(ctx, { canvasWidth, canvasHeight });

  addEvent(canvas);
}

function loopDraw(ctx, { canvasWidth, canvasHeight }) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  let gapTime = !loopDraw.preTime ? 0 : new Date() - loopDraw.preTime;
  if (gapTime > 40) gapTime = 40;
  loopDraw.preTime = new Date();

  animate(gapTime);
  window.requestAnimationFrame(() => loopDraw(ctx, { canvasWidth, canvasHeight }));
}

function animate(gapTime) {
  waves.draw();
  hands.draw(gapTime);
  kelps.draw();
  robot.draw(gapTime, { mouseX, mouseY });
  trashs.draw(gapTime);
  // trash.takeout();
}

function initCanvas(canvas) {
  let { offsetWidth, offsetHeight } = canvas.parentNode;
  canvas.width = offsetWidth;
  canvas.height = offsetHeight;

  return { canvasWidth: offsetWidth, canvasHeight: offsetHeight }
}

// 添加事件
function addEvent(canvas) {
  canvas.addEventListener('mousemove', handleMousemove, false);
  canvas.addEventListener('touchmove', handleTouchmove, false);
}

function handleMousemove(e) {
  mouseX = e.offsetX;
  mouseY = e.offsetY;
}

function handleTouchmove(e) {
  mouseX = e.touches[0].pageX;
  mouseY = e.touches[0].pageY;
}
