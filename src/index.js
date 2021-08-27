
import './css/index.scss';
import { setRequestAnimFrame } from './helper';
import Waves from './waves';
import Hands from './hands';
import Robot from './robot';
import Kelps from './kelps';
import Trashs from './trashs';
import { FishManager } from './fish';
import Dusts from './dusts';
import Bubbles from './bubbles';
import Background from './background';
import ProgressBar from './progress-bar';

setRequestAnimFrame();
const oceanDeepth = 70;
const airRate = 30;

let mouseX = 0;
let mouseY = 0;
let gameStarted = false;
let seaClarity = 100;

const waves = new Waves();
const trashs = new Trashs();
const hands = new Hands(trashs);
const robot = new Robot(trashs);
const kelps = new Kelps();
const dusts = new Dusts();
const bubbles = new Bubbles();
const background = new Background();
const progressBar = new ProgressBar();
let fishManager

window.onload = init;

function init() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const { canvasWidth, canvasHeight } = initCanvas(canvas);

  waves.init(ctx, { canvasWidth, canvasHeight, rangeValue: oceanDeepth });
  hands.init(ctx, 6, { airRate, canvasHeight, canvasWidth });
  robot.init(ctx, { canvasWidth, canvasHeight, oceanDeepth });
  kelps.init(ctx, { canvasWidth, canvasHeight });
  trashs.init({ canvasWidth, canvasHeight });
  dusts.init(ctx, { canvasWidth, canvasHeight, oceanDeepth });
  bubbles.init(ctx, kelps.kelpList, oceanDeepth);
  background.init(ctx, { canvasWidth, canvasHeight, airRate });
  progressBar.init(ctx, { x: 0, y: airRate / 100 * canvasHeight + 15 });

  fishManager = new FishManager(ctx, canvasWidth, canvasHeight)

  loopDraw(ctx, { canvasWidth, canvasHeight });

  addEvent(canvas);
}

function loopDraw(ctx, { canvasWidth, canvasHeight }) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  let gapTime = !loopDraw.preTime ? 0 : new Date() - loopDraw.preTime;
  if (gapTime > 40) gapTime = 40;
  loopDraw.preTime = new Date();
  window.gapTime = gapTime;
  animate(gapTime);
  refreshClarity();
  window.requestAnimationFrame(() => loopDraw(ctx, { canvasWidth, canvasHeight }));
}

function animate(gapTime) {
  background.draw();
  waves.draw();
  gameStarted && hands.draw(gapTime);
  let bubblePointList = [];
  kelps.kelpList.forEach(item => {
    item.draw()
    bubblePointList.push({
      x: item.quadraticEndX,
      y: item.quadraticEndY
    })
  });
  gameStarted && fishManager.update()
  trashs.draw(gapTime);
  robot.draw(gapTime, { mouseX, mouseY });
  robot.collectTrashs();
  dusts.draw();
  bubbles.draw(bubblePointList);
  gameStarted && progressBar.draw(seaClarity / 100);
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

  const startDom = document.getElementById('start');
  startDom.onclick = () => {
    startDom.parentNode.classList.add("hide");
    gameStarted = true;
  }
}

function handleMousemove(e) {
  mouseX = e.offsetX;
  mouseY = e.offsetY;
}

function handleTouchmove(e) {
  mouseX = e.touches[0].pageX;
  mouseY = e.touches[0].pageY;
}

function refreshClarity() {
  seaClarity = 100 - 5 * trashs.getList().length;
}
