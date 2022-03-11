export default class Bullet {
  positionY;
  speed;

  constructor(y, s) {
    this.positionY = y;
    this.speed = s;
  }

  moveBullet(element) {
    this.positionY -= this.speed;
    element.style.marginTop = `${this.positionY}px `;
  }

  resetBullet(element) {
    this.positionY = 0;
    element.style.marginTop = this.positionY;
    element.style.display = "none";
  }
}
