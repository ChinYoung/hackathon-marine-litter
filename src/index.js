
import './css/index.scss';
import { setRequestAnimFrame } from './helper';
import Waves from './waves';
import Hands from './hands';
import Robot from './robot';
import Kelps from './kelps';
import Trashs from './trashs';
import { init as zrInit } from "zrender";
import { FishManager } from './fish';

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

  const zrHandler = zrInit(canvas)
  const fishManager = new FishManager(zrHandler, canvasWidth, canvasHeight)

  waves.init(ctx, { canvasWidth, canvasHeight, rangeValue: oceanDeepth });
  hands.init(ctx, 6, { airRate, canvasHeight, canvasWidth });
  robot.init(ctx, { canvasWidth, canvasHeight, oceanDeepth });
  kelps.init(ctx, { canvasWidth, canvasHeight });

  loopDraw(ctx, { canvasWidth, canvasHeight, fishManager });

  addEvent(canvas);
}

function loopDraw(ctx, { canvasWidth, canvasHeight, fishManager }) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  let gapTime = !loopDraw.preTime ? 0 : new Date() - loopDraw.preTime;
  if (gapTime > 40) gapTime = 40;
  loopDraw.preTime = new Date();

  animate(gapTime, fishManager);
  window.requestAnimationFrame(() => loopDraw(ctx, { canvasWidth, canvasHeight, fishManager }));
}

function animate(gapTime, fishManager) {
  waves.draw();
  hands.draw(gapTime);
  kelps.draw();
  fishManager.update()
  trashs.draw(gapTime);
  robot.draw(gapTime, { mouseX, mouseY });
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
