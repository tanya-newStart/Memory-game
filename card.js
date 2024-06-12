import {
  activeCards,
  //   matchedCards,
  timerStarted,
  startTimer,
} from "./memory-game";

export function createCard(type, data, id, imgBackSrc) {
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
