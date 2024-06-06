// an id, a name and a picture url
const imagesWeather = [
  {
    name: "sunny",
    url: "./assets/sunny.png",
    "back-cover": "./assets/back.jpg",
    id: 0,
  },
  {
    name: "cloudy",
    url: "./assets/cloudy.png",
    "back-cover": "./assets/back.jpg",
    id: 1,
  },
  {
    name: "rainy",
    url: "./assets/rainy.png",
    "back-cover": "./assets/back.jpg",
    id: 2,
  },
  {
    name: "snowy",
    url: "./assets/snowy.png",
    "back-cover": "./assets/back.jpg",
    id: 3,
  },
  {
    name: "foggy",
    url: "./assets/foggy.png",
    "back-cover": "./assets/back.jpg",
    id: 4,
  },

  {
    name: "stormy",
    url: "./assets/stormy.png",
    "back-cover": "./assets/back.jpg",
    id: 6,
  },
];
const images = [
  {
    name: "fox",
    url: "./assets/fox.jpg",
    "back-cover": "./assets/back.jpg",
    id: 0,
  },

  {
    name: "dog",
    url: "./assets/dog.jpg",
    "back-cover": "./assets/back.jpg",
    id: 2,
  },
  {
    name: "cat",
    url: "./assets/cat.jpg",
    "back-cover": "./assets/back.jpg",
    id: 3,
  },
  {
    name: "horse",
    url: "./assets/horse.jpg",
    "back-cover": "./assets/back.jpg",
    id: 4,
  },
  {
    name: "bear",
    url: "./assets/bear.jpg",
    "back-cover": "./assets/back.jpg",
    id: 5,
  },
  {
    name: "eagle",
    url: "./assets/eagle.jpg",
    "back-cover": "./assets/back.jpg",
    id: 6,
  },
];
const animals = [
  { word: "ræv", id: 0 },
  { word: "hund", id: 2 },
  { word: "kat", id: 3 },
  { word: "heste", id: 4 },
  { word: "bjørn", id: 5 },
  { word: "ørn", id: 6 },
];

const weather = [
  { word: "sol", id: 0 },
  { word: "overskyet", id: 1 },
  { word: "regn", id: 2 },
  { word: "sne", id: 3 },
  { word: "tåge", id: 4 },
  { word: "storm", id: 6 },
];
//get the grid container
//create a card with a front and back image
//add the card to the grid container
function combineData(images, words) {
  return [
    ...images.map((image) => ({
      ...image,
      type: "image",
      data: image.url,
      imgBackSrc: image["back-cover"],
    })),
    ...words.map((word) => ({
      ...word,
      type: "word",
      data: word.word,
      imgBackSrc: "./assets/back.jpg",
    })),
  ];
}
let activeCards = [];
let matchedCards = [];
function populateGrid(category, grid) {
  grid.innerHTML = "";
  let combinedArray =
    category === "animals"
      ? combineData(images, animals)
      : combineData(imagesWeather, weather);

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

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.querySelector(".overlay-text");
  overlay.classList.add("visible");

  const grid = document.getElementById("grid-container");
  const startGameBtn = document.getElementById("start-game");

  startGameBtn.addEventListener("click", () => {
    overlay.classList.remove("visible");
  });

  document.getElementById("category").addEventListener("change", (e) => {
    const selectedCategory = e.target.value;
    console.log(selectedCategory);
    resetTimer();
    populateGrid(selectedCategory, grid);
  });
  populateGrid("animals", grid);
});

//timer
const timer = document.getElementById("timer");
let timerID;
let seconds = 100;
let timerStarted = false;

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
  seconds = 100;
  timer.innerHTML = seconds;
  timerStarted = false;
}
//shuffle array of cards
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
  return array;
}
