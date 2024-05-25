document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("grid-container");
  function createCard(imgFrontSrc, imgBackSrc) {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    const card = document.createElement("div");
    card.classList.add("card");

    const imgFront = document.createElement("img");
    const imgBack = document.createElement("img");

    imgBack.src = imgBackSrc;
    imgFront.src = imgFrontSrc;

    imgFront.classList.add("front");
    imgBack.classList.add("back");

    card.appendChild(imgFront);
    card.appendChild(imgBack);
    cardContainer.appendChild(card);

    card.addEventListener("click", function () {
      card.classList.toggle("isFlipped");
    });
    return cardContainer;
  }

  const card = createCard("./assets/fox.jpg", "./assets/back.jpg");
  grid.appendChild(card);
});
