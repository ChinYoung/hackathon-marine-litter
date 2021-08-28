
import './css/index.scss';
import sound from './sounds/bgm-1.mp3';
import sound2 from './sounds/bgm-2.mp3';
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
import Box from './box';

setRequestAnimFrame();
const oceanDeepth = 70;
const airRate = 30;

let mouseX = 0;
let mouseY = 0;
let gameStarted = false;
let seaClarity = 40;
let state = 'processing';
let audioElm;
let audioElm2;

const waves = new Waves();
const trashs = new Trashs();
const hands = new Hands(trashs);
const robot = new Robot(trashs);
const kelps = new Kelps();
const dusts = new Dusts();
const bubbles = new Bubbles();
const background = new Background();
const progressBar = new ProgressBar();
const box = new Box();
let fishManager

window.onload = init;

function init() {
  const { audioElm, audioElm2 } = addBackgroundSound();
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const { canvasWidth, canvasHeight } = initCanvas(canvas);

  waves.init(ctx, { canvasWidth, canvasHeight, rangeValue: oceanDeepth });
  hands.init(ctx, 6, { airRate, canvasHeight, canvasWidth }, seaClarity);
  robot.init(ctx, { canvasWidth, canvasHeight, oceanDeepth });
  kelps.init(ctx, { canvasWidth, canvasHeight });
  trashs.init(ctx, { canvasWidth, canvasHeight, airRate });
  dusts.init(ctx, { canvasWidth, canvasHeight, oceanDeepth });
  bubbles.init(ctx, kelps.kelpList, oceanDeepth);
  box.init(ctx, { canvasWidth, canvasHeight, seaClarity });
  background.init(ctx, { canvasWidth, canvasHeight, airRate });
  progressBar.init(ctx, { x: 0, y: airRate / 100 * canvasHeight + 15 });

  fishManager = new FishManager(ctx, canvasWidth, canvasHeight)

  loopDraw(ctx, { canvasWidth, canvasHeight });

  addEvent(canvas, { audioElm, audioElm2 });
}

function loopDraw(ctx, { canvasWidth, canvasHeight }) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  let gapTime = !loopDraw.preTime ? 0 : new Date() - loopDraw.preTime;
  if (gapTime > 40) gapTime = 40;
  loopDraw.preTime = new Date();
  window.gapTime = gapTime;
  animate(gapTime);
  refreshClarity();
  judge();
  window.requestAnimationFrame(() => loopDraw(ctx, { canvasWidth, canvasHeight }));
}

function animate(gapTime) {
  background.draw();
  box.draw(seaClarity,gapTime);
  waves.draw(seaClarity, state === 'failed');
  gameStarted && hands.draw(gapTime, seaClarity);
  let bubblePointList = [];
  kelps.kelpList.forEach(item => {
    item.draw(state === 'failed')
    bubblePointList.push({
      x: item.quadraticEndX,
      y: item.quadraticEndY
    })
  });

  (gameStarted || ['succeed'].includes(state)) && fishManager.update(seaClarity)

  trashs.draw(gapTime);
  (gameStarted || ['failed', 'succeed'].includes(state)) && progressBar.draw(seaClarity / 100);
  robot.draw(gapTime, { mouseX, mouseY });
  robot.collectTrashs();
  state !== 'failed' && dusts.draw();
  state !== 'failed' && bubbles.draw(bubblePointList);
}

function initCanvas(canvas) {
  let { offsetWidth, offsetHeight } = canvas.parentNode;
  canvas.width = offsetWidth;
  canvas.height = offsetHeight;

  return { canvasWidth: offsetWidth, canvasHeight: offsetHeight }
}

// 添加事件
function addEvent(canvas, { audioElm, audioElm2 }) {
  canvas.addEventListener('mousemove', handleMousemove, false);
  canvas.addEventListener('touchmove', handleTouchmove, false);

  const startDom = document.getElementById('start');
  startDom.onclick = () => {
    startDom.parentNode.classList.add("hide");
    startGame()
    audioElm.play();
    audioElm2.play();
  }

  const startDomOnFailed = document.getElementById('failed-start');
  startDomOnFailed.onclick = () => {
    startDomOnFailed.parentNode.classList.add("hide");
    startGame();
    audioElm.play();
    audioElm2.play();
  }

  const startDomOnSucceed = document.getElementById('succeed-start');
  startDomOnSucceed.onclick = () => {
    startDomOnSucceed.parentNode.classList.add("hide");
    startGame();
  }
}

function startGame() {
  gameStarted = true;
  seaClarity = 100;
  state = 'processing';
  trashs.empty();
  trashs.initTrashs();
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
  seaClarity = 100 - 2 * trashs.getTrashCountInOcean();
  seaClarity = seaClarity < 0 ? 0 : seaClarity;
}

function judge() {
  if (seaClarity === 0) {
    state = 'failed';
    audioElm.pause();
    audioElm2.pause();
  }

  if (seaClarity === 100) {
    state = 'succeed';
    trashs.emptyDroping();
  }

  if (state !== 'processing' && gameStarted !== false) {
    gameStarted = false;
    state === 'failed' ? displayFailed() : displaySucceed();
  }
}

function displaySucceed() {
  const startDom = document.getElementById('succeed-start');
  const { classList } = startDom.parentNode;
  classList.contains('hide') && classList.remove("hide");
}

function displayFailed() {
  const startDom = document.getElementById('failed-start');
  const { classList } = startDom.parentNode;
  classList.contains('hide') && classList.remove("hide");
}

function addBackgroundSound() {
  audioElm = document.getElementById("audio");
  audioElm2 = document.getElementById("audio2");
  audioElm.src = sound;
  audioElm2.src = sound2;
  audioElm.volume = 0.8;
  audioElm2.volume = 0.7;
  return { audioElm, audioElm2 };
}
