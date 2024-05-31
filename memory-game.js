// an id, a name and a picture url
const imagesWeather = [
  {
    name: "sunny",
    url: "./assets/sunny.png",
    "back-cover": "./assets/back.jpg",
    id: 0,
    isFlipped: false,
    isMatched: false,
    value: "sol",
  },
  {
    name: "cloudy",
    url: "./assets/cloudy.png",
    "back-cover": "./assets/back.jpg",
    id: 1,
    isFlipped: false,
    isMatched: false,
    value: "overskyet",
  },
  {
    name: "rainy",
    url: "./assets/rainy.png",
    "back-cover": "./assets/back.jpg",
    id: 2,
    isFlipped: false,
    isMatched: false,
    value: "regn",
  },
  {
    name: "snowy",
    url: "./assets/snowy.png",
    "back-cover": "./assets/back.jpg",
    id: 3,
    isFlipped: false,
    isMatched: false,
    value: "sne",
  },
];
const images = [
  {
    name: "fox",
    url: "./assets/fox.jpg",
    "back-cover": "./assets/back.jpg",
    id: 0,
    isFlipped: false,
    isMatched: false,
    value: "ræv",
  },

  {
    name: "dog",
    url: "./assets/dog.jpg",
    "back-cover": "./assets/back.jpg",
    id: 2,
    isFlipped: false,
    isMatched: false,
    value: "hund",
  },
  {
    name: "cat",
    url: "./assets/cat.jpg",
    "back-cover": "./assets/back.jpg",
    id: 3,
    isFlipped: false,
    isMatched: false,
    value: "kat",
  },
  {
    name: "horse",
    url: "./assets/horse.jpg",
    "back-cover": "./assets/back.jpg",
    id: 4,
    isFlipped: false,
    isMatched: false,
    value: "heste",
  },
  {
    name: "bear",
    url: "./assets/bear.jpg",
    "back-cover": "./assets/back.jpg",
    id: 5,
    isFlipped: false,
    isMatched: false,
    value: "bjørn",
  },
  {
    name: "eagle",
    url: "./assets/eagle.jpg",
    "back-cover": "./assets/back.jpg",
    id: 6,
    isFlipped: false,
    isMatched: false,
    value: "ørn",
  },
  {
    name: "giraffe",
    url: "./assets/giraffe.jpg",
    "back-cover": "./assets/back.jpg",
    id: 7,
    isFlipped: false,
    isMatched: false,
    value: "giraf",
  },
];
const animals = ["ræv", "hund", "kat", "hest", "bjørn", "ørn", "giraf"];
const weather = ["sol", "overskyet", "regn", "sne"];
//get the grid container
//create a card with a front and back image
//add the card to the grid container

document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("grid-container");

  function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
    return array;
  }
  function createCard(type, data, imgBackSrc) {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    const card = document.createElement("div");
    card.classList.add("card");

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
      card.classList.toggle("isFlipped");
    });
    return cardContainer;
  }

  function populateGrid(category) {
    grid.innerHTML = "";
    let combinedArray = [];
    if (category === "animals") {
      combinedArray = images.concat(
        animals.map((animal) => ({ type: "word", data: animal }))
      );
    } else if (category === "weather") {
      combinedArray = imagesWeather.concat(
        weather.map((weather) => ({
          type: "word",
          data: weather,
        }))
      );
    }
    shuffle(combinedArray);
    combinedArray.forEach((item) => {
      if (item.url) {
        const card = createCard("image", item.url, item["back-cover"]);
        grid.appendChild(card);
      } else if (item.data) {
        const card = createCard("word", item.data, "./assets/back.jpg");
        grid.appendChild(card);
      }
    });
  }

  document.getElementById("animals-btn").addEventListener("click", () => {
    populateGrid("animals");
  });
  document.getElementById("weather-btn").addEventListener("click", () => {
    populateGrid("weather");
  });
  populateGrid("animals");
});
