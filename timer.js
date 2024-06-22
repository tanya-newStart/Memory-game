let timerID;
let seconds;
let secondsLeft;
let totalSeconds;
let timerStarted = false;

const loseSound = new Audio("./assets/lose-sound.wav");

function startTimer() {
  if (!timerStarted) {
    timerID = setInterval(() => {
      countDown();
      setCircleDasharray();
    }, 1000);
    timerStarted = true;
  }
}
function countDown() {
  const gameOver = document.getElementById("game-over");
  const grid = document.getElementById("grid-container");
  secondsLeft = --seconds;
  updateTimerDisplay();
  setRemainingPathColor(secondsLeft);
  if (secondsLeft === 0) {
    clearInterval(timerID);
    gameOver.classList.add("visible");
    loseSound.play();
    grid.classList.add("disabled");
  }
}

function resetTimer() {
  clearInterval(timerID);
  seconds = parseInt(localStorage.getItem("seconds")) || 0;
  totalSeconds = seconds;
  updateTimerDisplay();
  timerStarted = false;
  setCircleDasharray();
  setRemainingPathColor();
}

const warningTimeLeft = 15;
const alertTimeLeft = 10;

const colors = {
  info: {
    color: "green",
  },
  warning: {
    color: "orange",
    threshold: warningTimeLeft,
  },
  alert: {
    color: "red",
    threshold: alertTimeLeft,
  },
};

function updateTimerDisplay() {
  const timerElement = document.getElementById("timer-animate");
  document.getElementById("timer-animate").innerHTML = `
  <div class ="timer">
  <svg class ="timer_svg" viewBox ="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <g class ="timer_circle">
  <circle class ="timer_path-elapsed" cx="50" cy="50" r="45"/>
  <path id ="timer-path-remaining" stroke-dasharray = "283" class = "timer_path-remaining"

  d = "M 50,50
  m -45,0
  a 45,45 0 1,0 90,0
  a 45, 45 0 1,0 -90,0 "></path>
  </g>
  </svg>
  <span id = "timer-label" class = "timer_label">
  
  ${formatTime(secondsLeft)}</span>
  </div>
  `;
  setRemainingPathColor(secondsLeft);
}

function formatTime(time) {
  if (isNaN(time) || time < 0) return "00:00";
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

function calculateTimeFraction() {
  const rawRatio = secondsLeft / totalSeconds;
  return rawRatio - (1 / totalSeconds) * (1 - rawRatio);
}

function setCircleDasharray() {
  const circleDasharray = `${(calculateTimeFraction() * 283).toFixed(0)} 283`;
  document
    .getElementById("timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

document.addEventListener("DOMContentLoaded", () => {
  resetTimer();
});

function setRemainingPathColor(secondsLeft) {
  const { alert, warning, info } = colors;
  const timerPathRemaining = document.getElementById("timer-path-remaining");
  if (secondsLeft <= alert.threshold) {
    timerPathRemaining.classList.remove("orange", "green");
    timerPathRemaining.classList.add("red");
  } else if (secondsLeft <= warning.threshold) {
    timerPathRemaining.classList.remove("green");
    timerPathRemaining.classList.add("orange");
  } else {
    timerPathRemaining.classList.remove("orange", "red");
    timerPathRemaining.classList.add("green");
  }
}
