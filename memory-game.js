const jsConfetti = new JSConfetti();

const baseURL =
  "https://raw.githubusercontent.com/tanya-newStart/tanya-newStart.github.io/main";
let data = {};
let activeCards = [];
let matchedCards = [];
let numberOfMoves = 0;
let timerStarted = false;
let combinedArray = [];
let timerID;
let seconds;

const timer = document.getElementById("timer");
const overlay = document.querySelector(".overlay-text");
const grid = document.getElementById("grid-container");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const userTimer = document.getElementById("user-timer");
    seconds = parseInt(localStorage.getItem("seconds")) || 0;

    const response = await fetch(
      "https://raw.githubusercontent.com/tanya-newStart/tanya-newStart.github.io/main/data.json"
    );
    const rawData = await response.json();
    data = rawData;
    initializeGame();

    const startGameBtn = document.getElementById("start-game");
    const restartGameBtn = document.getElementById("restart-game");
    const playAgainBtn = document.getElementById("play-again");

    startGameBtn.addEventListener("click", () => {
      const userNumber = parseInt(userTimer.value);
      if (isNaN(userNumber) || userNumber < 0) {
        document.getElementById("feedback").textContent =
          "Please enter a valid number of seconds";
      } else {
        document.getElementById("feedback").textContent = "";
        seconds = userNumber;
        localStorage.setItem("seconds", seconds);
        timer.innerHTML = seconds;
        overlay.classList.remove("visible");
        grid.classList.remove("disabled");
        startTimer();
      }
    });

    restartGameBtn.addEventListener("click", resetGame);

    playAgainBtn.addEventListener("click", resetGame);

    document.getElementById("category").addEventListener("change", (e) => {
      const selectedCategory = e.target.value;
      localStorage.setItem("category", selectedCategory);
      grid.classList.add("disabled");
      resetTimer();
      resetMoves();
      populateGrid(selectedCategory, grid, data);
    });
    document.querySelectorAll('input[name ="language"]').forEach((radio) => {
      radio.addEventListener("change", (e) => {
        const selectedLanguage = e.target.value;
        localStorage.setItem("language", selectedLanguage);
        const selectedCategory = document.getElementById("category").value;
        localStorage.setItem("category", selectedCategory);
        grid.classList.add("disabled");
        resetTimer();
        resetMoves();
        populateGrid(selectedCategory, grid, data);
      });
    });
  } catch (error) {
    console.log(error);
  }
});

function combineData(images, words, language) {
  return [
    ...images.map((image) => ({
      ...image,
      type: "image",
      data: `${baseURL}/${image.url}`,
      imgBackSrc: `${baseURL}/assets/back.jpg`,
    })),
    ...words.map((word) => ({
      ...word,
      type: "word",
      data: word[language],
      imgBackSrc: `${baseURL}/assets/back.jpg`,
    })),
  ];
}

function populateGrid(category, grid, data) {
  grid.innerHTML = "";

  const categoryData = {
    animals: { images: data.imagesAnimals, words: data.animals },
    weather: { images: data.imagesWeather, words: data.weather },
    clothes: { images: data.imagesClothes, words: data.clothes },
  };

  const selectedCategory = categoryData[category];
  const selectedLanguage =
    localStorage.getItem("language") ||
    document.querySelector('input[name ="language"]:checked').value;

  combinedArray = combineData(
    selectedCategory.images,
    selectedCategory.words,
    selectedLanguage
  );

  shuffle(combinedArray);

  combinedArray.forEach((item) => {
    const card = createCard(item.type, item.data, item.id, item.imgBackSrc);
    grid.appendChild(card);
  });
}

function createCard(type, data, id, imgBackSrc) {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card-container");

  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("data-id", id);

  let frontContent;
  if (type === "image") {
    const imgFront = document.createElement("img");
    imgFront.src = data;
    imgFront.classList.add("front");
    frontContent = imgFront;
  } else if (type === "word") {
    const wordFront = document.createElement("div");
    wordFront.classList.add("front", "word");
    wordFront.textContent = data;
    frontContent = wordFront;
  }

  const imgBack = document.createElement("img");
  imgBack.src = imgBackSrc;
  imgBack.classList.add("back");

  card.appendChild(frontContent);
  card.appendChild(imgBack);
  cardContainer.appendChild(card);
  card.addEventListener("click", function () {
    if (activeCards.length >= 2 || card.classList.contains("isFlipped")) {
      return;
    }
    card.classList.toggle("isFlipped");
    document.getElementById("counter").innerHTML = ++numberOfMoves;
    activeCards.push(card);

    if (activeCards.length === 1 && !timerStarted) {
      startTimer();
    }
    if (activeCards.length === 2) {
      setTimeout(() => {
        activeCards.forEach((card) => {
          card.classList.remove("isFlipped");
        });
        activeCards = [];
      }, 1500);
    }
    if (
      activeCards.length === 2 &&
      activeCards[0].dataset.id === activeCards[1].dataset.id
    ) {
      activeCards[0].classList.add("matched");
      activeCards[1].classList.add("matched");
      matchedCards.push(activeCards[0]);
      matchedCards.push(activeCards[1]);
      activeCards = [];

      if (matchedCards.length === combinedArray.length) {
        const gameWon = document.getElementById("success");
        gameWon.classList.add("visible");
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            jsConfetti.addConfetti();
          }, 500 * i);
        }

        clearInterval(timerID);
      }
    }
  });
  return cardContainer;
}

function initializeGame() {
  const overlay = document.querySelector(".overlay-text");
  overlay.classList.add("visible");
  const grid = document.getElementById("grid-container");
  grid.classList.add("disabled");
  const initialCategory = localStorage.getItem("category") || "animals";
  const initialLanguage = localStorage.getItem("language") || "english";
  document.getElementById("category").value = initialCategory;
  document.querySelector(
    `input[name="language"][value="${initialLanguage}"]`
  ).checked = true;
  populateGrid(initialCategory, grid, data);
}
//timer
function resetGame() {
  const overlays = document.querySelectorAll(".overlay-text");
  overlays.forEach((overlay) => overlay.classList.remove("visible"));

  resetTimer();
  resetMoves();
  activeCards = [];
  matchedCards = [];
  const userTimer = document.getElementById("user-timer");
  seconds =
    parseInt(localStorage.getItem("seconds")) || parseInt(userTimer.value);
  userTimer.value = seconds;
  timer.innerHTML = seconds;

  const selectedCategory = document.getElementById("category");
  selectedCategory.value = localStorage.getItem("category");

  grid.classList.add("disabled");
  overlay.classList.add("visible");

  grid.innerHTML = "";

  populateGrid(selectedCategory.value, grid, data);
}

function startTimer() {
  if (!timerStarted) {
    timerID = setInterval(countDown, 1000);
    timerStarted = true;
  }
}
function countDown() {
  const gameOver = document.getElementById("game-over");
  const grid = document.getElementById("grid-container");
  seconds--;
  timer.innerHTML = seconds;
  if (seconds === 0) {
    clearInterval(timerID);
    gameOver.classList.add("visible");
    grid.classList.add("disabled");
  }
}
function resetTimer() {
  clearInterval(timerID);
  seconds = parseInt(localStorage.getItem("seconds")) || 0;
  timer.innerHTML = seconds;
  timerStarted = false;
}

function resetMoves() {
  numberOfMoves = 0;
  document.getElementById("counter").innerHTML = numberOfMoves;
}
//shuffle array of cards
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
  return array;
}
