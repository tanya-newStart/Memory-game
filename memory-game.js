const baseURL =
  "https://raw.githubusercontent.com/tanya-newStart/tanya-newStart.github.io/main";
let data = {};
let activeCards = [];
let matchedCards = [];
let numberOfMoves = 0;
let timerStarted = false;

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded");
  fetch(
    "https://raw.githubusercontent.com/tanya-newStart/tanya-newStart.github.io/main/data.json"
  )
    .then((response) => response.json())
    .then((rawData) => {
      data = rawData;
      initializeGame();
    })
    .catch((error) => console.error(error));
});

function combineData(images, words) {
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
      data: word.word,
      imgBackSrc: `${baseURL}/assets/back.jpg`,
    })),
  ];
}

function populateGrid(category, grid, data) {
  grid.innerHTML = "";

  const categoryData = {
    animals: { images: data.images, words: data.animals },
    weather: { images: data.imagesWeather, words: data.weather },
    clothes: { images: data.imagesClothes, words: data.clothes },
  };

  const selectedCategory = categoryData[category];

  const combinedArray = combineData(
    selectedCategory.images,
    selectedCategory.words
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
      }, 2000);
    }
  });
  return cardContainer;
}

function initializeGame() {
  const overlay = document.querySelector(".overlay-text");
  overlay.classList.add("visible");

  const grid = document.getElementById("grid-container");
  grid.classList.add("disabled");
  const startGameBtn = document.getElementById("start-game");
  const restartGameBtn = document.getElementById("restart-game");

  startGameBtn.addEventListener("click", () => {
    overlay.classList.remove("visible");
    grid.classList.remove("disabled");
  });
  restartGameBtn.addEventListener("click", () => {
    const overlays = document.querySelectorAll(".overlay-text");
    overlays.forEach((item) => item.classList.remove("visible"));
    grid.classList.add("disabled");
    resetTimer();
    resetMoves();
    populateGrid(document.getElementById("category").value, grid, data);

    grid.classList.remove("disabled");
  });

  document.getElementById("category").addEventListener("change", (e) => {
    const selectedCategory = e.target.value;
    grid.classList.add("disabled");
    resetTimer();
    resetMoves();
    populateGrid(selectedCategory, grid, data);

    grid.classList.remove("disabled");
  });
  populateGrid("animals", grid, data);
}
//timer
const timer = document.getElementById("timer");
let timerID;
let seconds = 15;

function startTimer() {
  if (!timerStarted) {
    timerID = setInterval(countDown, 1000);
    timerStarted = true;
  }
}
function countDown() {
  const gameOver = document.getElementById("game-over");
  seconds--;
  timer.innerHTML = seconds;
  if (seconds === 0) {
    clearInterval(timerID);
    gameOver.classList.add("visible");
  }
}
function resetTimer() {
  clearInterval(timerID);
  seconds = 15;
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
