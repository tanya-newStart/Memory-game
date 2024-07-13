import { resetTimer, updateTimerDisplay, startTimer } from "./timer.js";
import { updateTexts, translations } from "./translations.js";
import confetti from "../node_modules/canvas-confetti/dist/confetti.module.mjs";

const cardFlipSound = new Audio("./assets/card-flip.wav");
const matchSound = new Audio("./assets/match-sound.wav");
const winSound = new Audio("./assets/win-sound.wav");

const baseURL =
  "https://raw.githubusercontent.com/tanya-newStart/tanya-newStart.github.io/main";
let data = {};
let activeCards = [];
let matchedCards = [];
let numberOfMoves = 0;
let combinedArray = [];
let timerStarted = false;

const overlay = document.querySelector(".overlay-text");
const grid = document.getElementById("grid-container");
const header = document.querySelector("header");

window.addEventListener("load", () => {
  updateTexts("english");
  const footer = document.querySelector("footer");
  footer.style.display = "block";
});
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
    const btnRestart = document.getElementById("restart-game");
    const playAgainBtn = document.getElementById("play-again");

    if (startGameBtn) {
      startGameBtn.addEventListener("click", () => {
        const userNumber = parseInt(userTimer.value);
        if (userNumber > 300 || userNumber < 20) {
          document.getElementById("feedback").textContent =
            "Please enter a number between 20 and 300";
          document.getElementById("feedback").style.display = "block";
        } else if (isNaN(userNumber) || userNumber < 0) {
          document.getElementById("feedback").textContent =
            "Please enter a valid number of seconds";
          document.getElementById("feedback").style.display = "block";
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
    }
    if (btnRestart) {
      console.log("restart btn found");
      btnRestart.addEventListener("click", resetGame);
    } else {
      console.log("Btn is not found");
    }
    if (playAgainBtn) {
      console.log("play again btn found");
      playAgainBtn.addEventListener("click", resetGame);
    }
    document.querySelectorAll('input[name ="language"]').forEach((radio) => {
      radio.addEventListener("change", (e) => {
        const selectedLanguage = e.target.value;
        localStorage.setItem("language", selectedLanguage);
        updateTexts(selectedLanguage);

        const selectedCategory = document.getElementById("category").value;
        const categoryKey = getCategoryKey(selectedCategory);
        localStorage.setItem("category", categoryKey);
        grid.classList.add("disabled");

        resetTimer();
        resetMoves();

        populateGrid(categoryKey, grid, data);
      });
    });
    document.getElementById("category").addEventListener("change", (e) => {
      const selectedCategory = e.target.value;
      const categoryKey = getCategoryKey(selectedCategory);
      localStorage.setItem("category", categoryKey);
      grid.classList.add("disabled");

      resetTimer();
      resetMoves();

      populateGrid(categoryKey, grid, data);
    });
    const storedLanguage = localStorage.getItem("language") || "english";
    updateTexts(storedLanguage);
  } catch (error) {
    console.log(error);
  }
});

function getCategoryKey(category) {
  const categoryKey = {
    animals: "animals",
    weather: "weather",
    clothes: "clothes",
    dyr: "animals",
    vejr: "weather",
    tøj: "clothes",
    тварини: "animals",
    погода: "weather",
    одяг: "clothes",
  };
  return categoryKey[category.toLowerCase()] || category;
}

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

function populateGrid(categoryKey, grid, data) {
  grid.innerHTML = "";

  const categoryData = {
    animals: { images: data.imagesAnimals, words: data.animals },
    weather: { images: data.imagesWeather, words: data.weather },
    clothes: { images: data.imagesClothes, words: data.clothes },
  };

  const selectedCategory = categoryData[categoryKey];

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
      }, 1200);
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
        confetti({
          particleCount: 600,
          spread: 360,
        });
        playWinSound();
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

  updateTexts(initialLanguage);

  const categoryKey = getCategoryKey(initialCategory);
  const categoryElement = document.getElementById("category");
  const translatedCategories = translations[initialLanguage].categories;
  const translatedCategory = translatedCategories.find(
    (cat) => getCategoryKey(cat.toLowerCase()) === categoryKey
  );
  categoryElement.value = translatedCategory
    ? translatedCategory.toLowerCase()
    : initialCategory;

  populateGrid(categoryKey, grid, data);
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
  const storedCategory = localStorage.getItem("category") || "animals";
  console.log(storedCategory);
  selectedCategory.value = storedCategory;

  grid.classList.add("disabled");
  overlay.classList.add("visible");

  grid.innerHTML = "";
  const categoryKey = getCategoryKey(storedCategory);
  populateGrid(categoryKey, grid, data);
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

function playWinSound() {
  winSound.play().catch((error) => {
    console.log("Audio play didn't work:", error);
  });
}
