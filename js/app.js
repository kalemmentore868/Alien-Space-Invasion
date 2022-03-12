import Spaceship from "./Spaceship.js";
import Canon from "./Canon.js";
import GameData from "./GameData.js";
import Bullet from "./Bullet.js";

const main = (() => {
  // let key = "Lco6hKibew1GgmTcgxvGyLfmwzm0QSNauCXKdXaw"
  // fetch(`https://images-api.nasa.gov`)
  //Dom Elements
  const splayArea = document.querySelector("#playArea");
  const spaceshipList = document.querySelectorAll(".spaceships");
  const problemsHeader = document.querySelectorAll(".problem");
  const cannon = document.querySelector("#cannon");
  const bullet = document.querySelector("#bullet");
  const canonText = document.querySelector("#canonAnswer");

  const timer = document.querySelector("#timer");
  const hitsCounter = document.querySelector("#hits");
  const missesCounter = document.querySelector("#misses");
  const saveButton = document.querySelector("#save-game");

  const gameRulesBtn = document.querySelector("#gameRulesBtn");
  const rulesContainer = document.querySelector("#rulesContainer");

  const startGameBtn = document.querySelector("#startGameBtn");
  const welcomeScreen = document.querySelector("#welcomeScreen");
  const youWinContainer = document.querySelector("#youWinContainer");
  const loadGameBtn = document.querySelector("#load-game");

  const imageSoundToggle = document.querySelector("#startOrStopImg");
  const audioToggle = document.querySelector("#audio");

  const playerDetails = document.querySelector("#playerScreen");
  const playerScreen = document.querySelector("#playerScreen");
  const playerNameInput = document.querySelector("#playerName");

  const difficultyContainer = document.querySelector("#difficulty");

  const gameOverScreen = document.querySelector("#gameOverContainer");

  //Game variables

  let gameData;
  let detectCollision;

  //Helpful Functions

  const makeSpaceshipObjectsList = (operation, difficulty) => {
    const spaceshipObjectsList = [];
    for (let i = 0; i < spaceshipList.length; i++) {
      const ship = new Spaceship(
        0,
        getRandomSpeed(),
        `${Math.floor(Math.random() * 25)} ${operation} ${Math.floor(
          Math.random() * 9
        )}`
      );
      ship.adjustDifficulty(difficulty);
      spaceshipObjectsList.push(ship);
    }
    return spaceshipObjectsList;
  };

  const populateProblems = (spaceshipObjectsList, operation) => {
    for (let i = 0; i < spaceshipObjectsList.length; i++) {
      spaceshipObjectsList[i].shipExpression =
        spaceshipObjectsList[i].generateRandomExpression(operation);
      problemsHeader[i].innerText = spaceshipObjectsList[i].shipExpression;
    }
  };

  //it returns the answer for the expression of the ship that was randomly picked to be correct
  const getCorrectAnswer = (level, spaceShipObjectsList) => {
    const randomIndex = Math.floor(Math.random() * 5);
    return spaceShipObjectsList[randomIndex].getAnswer(level);
  };

  const hasCollided = (object1, object2) => {
    let obj1Box = object1.getBoundingClientRect();
    let obj2Box = object2.getBoundingClientRect();
    if (obj1Box.top <= obj2Box.bottom) {
      return true;
    }
  };

  const generateNewProblems = (spaceShipObjectsList, level) => {
    let operation;
    const { canonObj } = gameData;
    level === 1 ? (operation = "+") : (operation = "-");
    populateProblems(spaceShipObjectsList, operation);
    canonObj.canonAnswer = getCorrectAnswer(level, spaceShipObjectsList);
    canonObj.updateCanonText(canonText);
  };

  const getRandomSpeed = () => {
    return 0.1 + 1 / (Math.floor(Math.random() * 2) + 1.5);
  };

  const decrementTimer = () => {
    gameData.timeLeft--;
    timer.innerText = gameData.timeLeft;
  };

  const nextLevel = (detectCollision) => {
    gameData.timeLeft = 30;
    gameData.level = 2;

    if (gameData.canonObj.shotFired) {
      gameData.bulletObj.resetBullet(bullet);
      gameData.canonObj.shotFired = false;
    }
    clearInterval(detectCollision);
    gameData.ships = makeSpaceshipObjectsList("-", gameData.difficulty);
    generateNewProblems(gameData.ships, gameData.level);
  };

  const setUpGame = (operation, playerName, gameDifficulty, level) => {
    const spaceShipObjectsList = makeSpaceshipObjectsList(
      operation,
      gameDifficulty
    );

    populateProblems(spaceShipObjectsList, operation);

    gameData = new GameData(
      playerName,
      gameDifficulty,
      30,
      spaceShipObjectsList,
      new Canon(1, getCorrectAnswer(level, spaceShipObjectsList), false),
      new Bullet(0, 5),
      0,
      0,
      level
    );

    gameData.canonObj.updateCanonText(canonText);
  };

  const loadGame = () => {
    for (let i = 0; i < problemsHeader.length; i++) {
      problemsHeader[i].innerText = gameData.ships[i].shipExpression;
    }
    gameData.ships.map((ship) => ship.determineNum());
    hitsCounter.innerText = `Hits: ${gameData.hits}`;
    missesCounter.innerText = `Misses: ${gameData.misses}`;
    canonText.innerText = gameData.canonObj.canonAnswer;
    cannon.style.gridColumn = gameData.canonObj.positionX;
  };
  const startGame = () => {
    setInterval(decrementTimer, 1000);
    const moveShip = setInterval(() => {
      for (let i = 0; i < spaceshipList.length; i++) {
        let conceptShip = gameData.ships[i];

        conceptShip.moveShip();
        spaceshipList[i].style.marginTop = `${conceptShip.positionY}px`;

        if (hasCollided(cannon, spaceshipList[i])) {
          clearInterval(moveShip);
          playArea.style.display = "none";
          gameOverScreen.style.display = "block";
        }

        if (gameData.timeLeft <= 0 && gameData.level === 1) {
          nextLevel(detectCollision);
        } else if (gameData.timeLeft <= 0 && gameData.level === 2) {
          playArea.style.display = "none";
          clearInterval(moveShip);
          alert("you win");
        }
      }
    }, 10);
  };

  //Event Listeners
  gameRulesBtn.addEventListener("click", () => {
    rulesContainer.classList.toggle("displayRules");
  });

  imageSoundToggle.addEventListener("click", () => {
    if (audioToggle.paused) {
      audioToggle.play();
      imageSoundToggle.src = "media/volume.png";
    } else {
      imageSoundToggle.src = "media/mute.png";
      imageSoundToggle.alt = "Pause Button";
      audioToggle.pause();
    }
  });

  startGameBtn.addEventListener("click", () => {
    welcomeScreen.style.display = "none";
    playerDetails.style.display = "block";
  });

  loadGameBtn.addEventListener("click", () => {
    gameData = JSON.parse(localStorage.getItem("gameData"));

    gameData = new GameData(
      gameData.playerName,
      gameData.difficulty,
      gameData.timeLeft,
      gameData.ships,
      gameData.canonObj,
      gameData.bulletObj,
      gameData.hits,
      gameData.misses,
      gameData.level
    );

    gameData.ships = gameData.ships.map(
      (ship) => new Spaceship(ship.positionY, ship.speed, ship.shipExpression)
    );

    gameData.canonObj = new Canon(
      gameData.canonObj.positionX,
      gameData.canonObj.canonAnswer,
      false
    );

    gameData.bulletObj = new Bullet(
      gameData.bulletObj.positionY,
      gameData.bulletObj.speed
    );

    welcomeScreen.style.display = "none";
    playArea.style.display = "block";

    loadGame();

    startGame();
  });

  difficultyContainer.addEventListener("click", (event) => {
    let playerName;
    let gameDifficulty;
    if (event.target.tagName == "BUTTON" && event.target.innerText == "Easy") {
      playerDetails.style.display = "none";
      playArea.style.display = "block";
      playerName = playerNameInput.value;
      gameDifficulty = "easy";
      setUpGame("+", playerName, gameDifficulty, 1);
      startGame();
    } else if (
      event.target.tagName == "BUTTON" &&
      event.target.innerText == "Hard"
    ) {
      playerDetails.style.display = "none";
      playArea.style.display = "block";
      playerName = playerNameInput.value;
      gameDifficulty = "hard";
      setUpGame("+", playerName, gameDifficulty, 1);

      startGame();
    }
  });

  saveButton.addEventListener("click", () => {
    localStorage.setItem("gameData", JSON.stringify(gameData));
  });

  document.addEventListener("keydown", (event) => {
    const { canonObj, ships, level, bulletObj } = gameData;

    if (event.key === "ArrowRight") {
      canonObj.moveCanonRight(cannon);
    } else if (event.key === "ArrowLeft") {
      canonObj.moveCanonLeft(cannon);
    } else if (event.key === " " && canonObj.shotFired === false) {
      canonObj.shotFired = true;
      bullet.style.display = "block";

      detectCollision = setInterval(() => {
        bulletObj.moveBullet(bullet);

        for (let i = 0; i < spaceshipList.length; i++) {
          if (hasCollided(bullet, spaceshipList[i])) {
            let shipAnswer = ships[i].getAnswer(level);

            if (
              canonObj.canonAnswer === shipAnswer &&
              i + 1 === canonObj.positionX
            ) {
              ships[i].correctAnswer(spaceshipList[i]);
              gameData.updateHits(hitsCounter);

              setTimeout(() => {
                spaceshipList[i].children[0].src = "media/spaceship.png";
                spaceshipList[i].children[0].style.zIndex = "0";
                gameData.resetAllShips();
              }, 500);

              bulletObj.resetBullet(bullet);

              generateNewProblems(ships, level);
              canonObj.shotFired = false;
              clearInterval(detectCollision);
            } else if (
              canonObj.canonAnswer !== shipAnswer &&
              i + 1 === canonObj.positionX
            ) {
              ships[i].incorrectAnswer(spaceshipList[i]);
              gameData.updateMisses(missesCounter);
              bulletObj.resetBullet(bullet);
              generateNewProblems(ships, level);
              canonObj.shotFired = false;
              clearInterval(detectCollision);
            }
          }
        }
      }, 20);
    }
  });
})();
