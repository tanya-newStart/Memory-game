const translations = {
  english: {
    categoryLabel: "Choose a category:",
    timerLabel: "Set a time limit in seconds:",
    feedback: "Please enter a number between 20 and 300",
    instructions:
      "Match each image with its corresponding word before time runs out. Good luck!",
    start: "Start the Game",
    restart: "Restart",
    playAgain: "Play again",
    moves: "Number of moves:",
    categories: ["Animals", "Weather", "Clothes"],
    win: " Woo-hoo! All cards are matched!",
    lose: "Game over!",
  },
  danish: {
    categoryLabel: "Vælg en kategori:",
    timerLabel: "Indstil en tidsbegrænsning i sekunder:",
    feedback: "Indtast venligst et tal mellem 20 og 300",
    instructions:
      "Match hvert billede med dets tilsvarende ord, før tiden løber ud. Held og lykke!",
    start: "Start Spillet",
    restart: "Genstart",
    playAgain: "Spil igen",
    moves: "Antal træk:",
    categories: ["Dyr", "Vejr", "Tøj"],
    win: "Woo-hoo! Alle kort er matchet!",
    lose: "Spillet er slut!",
  },
  ukrainian: {
    categoryLabel: "Виберіть категорію:",
    timerLabel: "Встановіть обмеження часу в секундах:",
    feedback: "Будь ласка, введіть число від 20 до 300",
    instructions:
      "Відповідайте кожному зображенню його відповідне слово, поки не закінчився час. Удачі!",
    start: "Почати гру",
    restart: "Перезапустити",
    playAgain: "Грати знову",
    moves: "Кількість ходів:",
    categories: ["Тварини", "Погода", "Одяг"],
    win: "Ура! Всі картки знайдені!",
    lose: "Гра закінчена!",
  },
};

function updateTexts(language) {
  const moves = document.querySelector(".moves");
  const form = document.getElementById("user-settings");
  const category = document.getElementById("category");
  const btnStart = document.getElementById("start-game");
  const btnRestart = document.getElementById("restart-game");
  const btnPlayAgain = document.getElementById("play-again");
  const gameOver = document.getElementById("game-over");
  const success = document.getElementById("success");

  moves.textContent = translations[language].moves;

  form.querySelector('label[for = "category"]').textContent =
    translations[language].categoryLabel;
  form.querySelector('label[for = "user-timer"]').textContent =
    translations[language].timerLabel;
  form.querySelector("#feedback").textContent = translations[language].feedback;
  form.querySelector("#instructions").textContent =
    translations[language].instructions;

  const categoryOptions = translations[language].categories;
  category.innerHTML = categoryOptions
    .map(
      (option) => `<option value ="${option.toLowerCase()}">${option}</option>`
    )
    .join("");
  if (btnStart) {
    btnStart.textContent = translations[language].start;
  }
  if (btnRestart) {
    btnRestart.textContent = translations[language].restart;
  }
  if (btnPlayAgain) {
    btnPlayAgain.textContent = translations[language].playAgain;
  }
  if (gameOver) {
    gameOver.textContent = translations[language].lose;
  }
  if (success) {
    success.textContent = translations[language].win;
  }
}

export { updateTexts, translations };
