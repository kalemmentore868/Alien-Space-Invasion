export default class GameData {
  playerName;
  difficulty;
  timeLeft;
  ships;
  canonObj;
  bulletObj;
  hits;
  misses;
  level;

  constructor(p, d, t, s, c, b, h, m, l) {
    this.playerName = p;
    this.difficulty = d;
    this.timeLeft = t;
    this.ships = s;
    this.canonObj = c;
    this.bulletObj = b;
    this.hits = h;
    this.misses = m;
    this.level = l;
  }

  resetAllShips() {
    this.ships.map((ship) => {
      ship.resetShip();
    });
  }

  updateHits(element) {
    this.hits++;
    element.innerText = `Hits: ${this.hits}`;
  }

  updateMisses(element) {
    this.misses++;
    element.innerText = `Misses: ${this.misses}`;
  }
}
