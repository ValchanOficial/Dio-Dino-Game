const dino = document.querySelector(".dino");
const background = document.querySelector(".background");

let isJumping = false;
let isGameOver = false;
let dinoPosition = 10;

const jumpInterval = 20;
const jumpHeight = 200;
const groundHeight = 10;
const gravity = 20;

const timeFrame = 200;
let dinoFrame = 0;

let cactusTimer;
let cactusTimeout;
let dinoTimer;

// Dino Actions

function handleKeyUp(event) {
  if (event.keyCode === 32 && !isGameOver) {
    if (!isJumping) {
      jump();
    }
  }
}

function jump() {
  isJumping = true;

  let upInterval = setInterval(() => {
    if (dinoPosition >= jumpHeight) {
      clearInterval(upInterval);
      let downInterval = setInterval(() => {
        if (dinoPosition <= groundHeight) {
          clearInterval(downInterval);
          isJumping = false;
        } else {
          dinoPosition -= gravity;
          dino.style.bottom = `${dinoPosition}px`;
        }
      }, jumpInterval);
    } else {
      dinoPosition += gravity;
      dino.style.bottom = `${dinoPosition}px`;
    }
  }, 20);
}

function movimentDino() {
  if (!isGameOver) {
    dinoTimer = setInterval(() => {
      if (isJumping) {
        dino.src = `imgs/dino-jump.png`;
        return;
      } else {
        if (dinoFrame === 0) {
          dino.src = `imgs/dino-${dinoFrame}.png`;
          dinoFrame++;
        } else {
          dino.src = `imgs/dino-${dinoFrame}.png`;
          dinoFrame--;
        }
      }
    }, timeFrame);
  }
}

// Enemy

function createCactus() {
  if (!isGameOver) {
    let cactus = document.createElement("div");
    let cactusPosition = parseInt(getComputedStyle(background).width) - 100;
    let randomTime = Math.floor(Math.random() * (6000 - 100 + 1) + 100);

    cactus.classList.add("cactus");
    background.appendChild(cactus);
    cactus.style.left = `${cactusPosition}px`;

    cactusTimer = setInterval(() => {
      if (cactusPosition < -60) {
        cactus.remove();
      } else if (
        cactusPosition > 0 &&
        cactusPosition < 60 &&
        dinoPosition < 60
      ) {
        // Game over
        gameOver();
      } else {
        cactusPosition -= 10;
        cactus.style.left = cactusPosition + "px";
      }
    }, 20);

    setTimeout(createCactus, randomTime);
  }
}

// Game Over

function gameOver() {
  if (!isGameOver) {
    clearInterval(dinoTimer);
    clearInterval(cactusTimer);
    clearTimeout(cactusTimeout);
    let allCactus = document.querySelectorAll(".cactus");
    allCactus.forEach((cactus) => cactus.remove());

    isGameOver = true;
    dino.src = `imgs/dino-lose.png`;
    background.classList.remove("background-animation");

    var p = document.createElement("p");
    p.innerHTML = "Fim de jogo";
    p.classList.add("game-over");
    document.body.appendChild(p);
  }
}

movimentDino();
createCactus();
document.addEventListener("keyup", handleKeyUp);
