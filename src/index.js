import './css/index.scss';
import img_body from "./images/babyFade3.png";

class Demo {
  count = 1;

  increase() {
    this.count += 1;
  }
}

const demo = new Demo();
demo.increase();

let img = new Image();
img.src = img_body;