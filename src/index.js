
import './css/index.scss';
import { setRequestAnimFrame } from './helper';
import Waves from './waves';
import Hand from './hands';
import * as zrender from "zrender";
import handsImage from "./images/hands.png";
import canImage from "./images/can.png";
import robotImage from "./images/robot.png";

setRequestAnimFrame();

window.onload = init;
const eleMap = {}
const robotPosition = {
  x: 0,
  y: 0
}
function init() {
  const canvas = document.getElementById('canvas');
  const { canvasWidth, canvasHeight } = initCanvas(canvas);
  const zrHandler = zrender.init(canvas)
  console.log("🚀 ~ file: index.js ~ line 23 ~ init ~ zrender", zrender)
  let robot = eleMap['robot']
  if (!robot) {
    robot = new zrender.Image({
      style: {
        image: robotImage,
        x: 0,
        y: 0,
        width: 225,
        height: 56
      },
      zlevel: 1000
    })
    eleMap['robot'] = robot
    zrHandler.add(robot)
  }
  canvas.addEventListener('mousemove', function (event) {
    const { clientX, clientY, screenX, screenY, x, y, offsetX, offsetY } = event
    drawRobot(zrHandler, offsetX, offsetY)
  })
  setInterval(() => {
    playRobotAction(zrHandler)
  }, 100);
  const can = new zrender.Image({
    style: {
      image: canImage,
      x: 0,
      y: 0,
      width: 100,
      height: 100
    },
    zlevel: 100
  })
  zrHandler.add(can)
  can.animateTo({
    style: { x: 0, y: canvasHeight * 0.8, }
  },
    {
      duration: 5000,
      delay: 0,
      easing: 'exponentialOut',
      during: (cur) => { },
      done: () => { }
    }
  )
}

let clipPathCounter = 0
function playRobotAction(zrHandler) {
  const { x, y } = robotPosition
  clipPathCounter += 1
  drawRobot(zrHandler, x, y)
}

function drawRobot(zrHandler, x, y) {
  robotPosition.x = x
  robotPosition.y = y
  let robot = eleMap['robot']
  if (!robot) {
    robot = new zrender.Image({
      style: {
        image: robotImage,
        x,
        y,
        width: 225,
        height: 56
      },
      zlevel: 1000
    })
    eleMap['robot'] = robot
    zrHandler.add(robot)
  }
  const newX = x - 28 - (clipPathCounter % 4) * 56
  const newY = y - 28
  const newClipX = newX + (clipPathCounter % 4) * 56
  const path = zrender.path.createFromString(`M ${newClipX} ${newY} h 56 v 56 h -56 z`)
  robot.setClipPath(path)
  robot.attr({
    style: { x: newX, y: newY },
  })
}

function initCanvas(canvas) {
  let { offsetWidth, offsetHeight } = canvas.parentNode;
  canvas.width = offsetWidth;
  canvas.height = offsetHeight;
  return { canvasWidth: offsetWidth, canvasHeight: offsetHeight }
}