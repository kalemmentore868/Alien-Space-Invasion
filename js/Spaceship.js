export default class Spaceship {
  positionY;
  speed;
  shipExpression;

  constructor(y, s, e) {
    this.positionY = y;
    this.speed = s;
    this.shipExpression = e;

    this.num1 = Math.floor(Math.random() * 26);
    this.num2 = Math.floor(Math.random() * 9);
  }

  moveShip() {
    this.positionY += this.speed;
  }

  resetShip() {
    this.positionY = 0;
  }

  generateRandomExpression(operation) {
    let expression;

    this.num1 = Math.floor(Math.random() * 26);
    this.num2 = Math.floor(Math.random() * 9);

    if (operation === "+") {
      expression = `${this.num1} + ${this.num2}`;
    } else if (operation === "-") {
      this.num1 >= this.num2
        ? (expression = `${this.num1} - ${this.num2}`)
        : (expression = `${this.num2} - ${this.num1}`);
    }

    return expression;
  }

  adjustDifficulty(difficulty) {
    if (difficulty === "hard") {
      this.speed *= 1.4;
    }
  }

  getAnswer(level) {
    let shipAnswer;
    if (level === 1) {
      shipAnswer = this.num1 + this.num2;
    } else if (level === 2) {
      this.num1 >= this.num2
        ? (shipAnswer = this.num1 - this.num2)
        : (shipAnswer = this.num2 - this.num1);
    }
    return shipAnswer;
  }

  determineNum() {
    if (this.shipExpression[1] != " ") {
      this.num1 = parseInt(
        `${this.shipExpression[0]}${this.shipExpression[1]}`
      );
      this.num2 = parseInt(this.shipExpression[5]);
    } else {
      this.num1 = parseInt(this.shipExpression[0]);
      this.num2 = parseInt(
        `${this.shipExpression[0]}${this.shipExpression[1]}`
      );
    }
  }

  correctAnswer(element) {
    element.children[0].src = "media/explosion.jpg";
    element.children[0].style.zIndex = 7;
    element.children[2].src = "media/explosion.wav";
    element.children[2].play();
  }

  incorrectAnswer(element) {
    element.children[2].src = "media/wrong-answer.mp3";
    element.children[2].play();
  }
}
