import "./timer.js";

const jsConfetti = new JSConfetti();
const cardFlipSound = new Audio("./assets/card-flip.wav");
const matchSound = new Audio("./assets/match-sound.wav");
const winSound = new Audio("./assets/win-sound.mp3");

const baseURL =
  "https://raw.githubusercontent.com/tanya-newStart/tanya-newStart.github.io/main";
let data = {};
let activeCards = [];
let matchedCards = [];
let numberOfMoves = 0;
let combinedArray = [];

const overlay = document.querySelector(".overlay-text");
const grid = document.getElementById("grid-container");
const header = document.querySelector("header");

//This block loads data from a JSON file hosted online and initializes the game once the DOM is fully loaded.
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/tanya-newStart/tanya-newStart.github.io/main/data.json"
    );
    const rawData = await response.json();
    data = rawData;
    initializeGame();

    const userTimer = document.getElementById("user-timer");
    let seconds = parseInt(localStorage.getItem("seconds")) || 0;

    const startGameBtn = document.getElementById("start-game");
    const restartGameBtn = document.getElementById("restart-game");
    const playAgainBtn = document.getElementById("play-again");

    startGameBtn.addEventListener("click", () => {
      const userNumber = parseInt(userTimer.value);
      if (userNumber > 300 || userNumber < 20) {
        document.getElementById("feedback").textContent =
          "Please enter a number between 20 and 300";
      } else if (isNaN(userNumber) || userNumber < 0) {
        document.getElementById("feedback").textContent =
          "Please enter a valid number of seconds";
      } else {
        document.getElementById("feedback").textContent = "";
        seconds = userNumber;
        localStorage.setItem("seconds", seconds);
        resetTimer();
        updateTimerDisplay();
        overlay.classList.remove("visible");
        header.classList.remove("disabled");
        grid.classList.remove("disabled");
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

// creating cards and handling user interactions:
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
    cardFlipSound.play();
    if (activeCards.length >= 2 || card.classList.contains("isFlipped")) {
      return;
    }
    card.classList.toggle("isFlipped");

    activeCards.push(card);

    if (activeCards.length === 1 && !timerStarted) {
      startTimer();
    }
    if (activeCards.length === 2) {
      document.getElementById("counter").innerHTML = ++numberOfMoves;
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
      setTimeout(() => {
        matchSound.play();
      }, 800);
      activeCards[0].classList.add("matched");
      activeCards[1].classList.add("matched");
      matchedCards.push(activeCards[0]);
      matchedCards.push(activeCards[1]);
      activeCards = [];

      if (matchedCards.length === combinedArray.length) {
        const gameWon = document.getElementById("success");
        gameWon.classList.add("visible");
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            jsConfetti.addConfetti();
            winSound.play().catch((error) => {
              console.log("Audio play didn't work:", error);
            });
          }, 500 * i);
        }

        setTimeout(() => {
          jsConfetti.clearCanvas();
        }, 3000);
        clearInterval(timerID);
      }
    }
  });
  return cardContainer;
}

// function sets up the initial game state:
function initializeGame() {
  const overlay = document.querySelector(".overlay-text");
  overlay.classList.add("visible");
  header.classList.add("disabled");
  grid.classList.add("disabled");

  const initialCategory = localStorage.getItem("category") || "animals";
  const initialLanguage = localStorage.getItem("language") || "english";

  document.getElementById("category").value = initialCategory;
  document.querySelector(
    `input[name="language"][value="${initialLanguage}"]`
  ).checked = true;

  populateGrid(initialCategory, grid, data);
}

function resetGame() {
  const overlays = document.querySelectorAll(".overlay-text");
  overlays.forEach((overlay) => overlay.classList.remove("visible"));
  header.classList.remove("disabled");

  resetTimer();
  resetMoves();
  activeCards = [];
  matchedCards = [];

  const userTimer = document.getElementById("user-timer");
  let seconds =
    parseInt(localStorage.getItem("seconds")) || parseInt(userTimer.value);
  userTimer.value = seconds;
  updateTimerDisplay();

  const selectedCategory = document.getElementById("category");
  selectedCategory.value = localStorage.getItem("category") || "animals";

  grid.classList.add("disabled");
  overlay.classList.add("visible");

  grid.innerHTML = "";

  populateGrid(selectedCategory.value, grid, data);
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
