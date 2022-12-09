// Pages
const gamePage = document.getElementById("game-page");
const scorePage = document.getElementById("score-page");
const splashPage = document.getElementById("splash-page");
const countdownPage = document.getElementById("countdown-page");
// Splash Page
const startForm = document.getElementById("start-form");
const radioContainers = document.querySelectorAll(".radio-container");
const radioInputs = document.querySelectorAll("input");
const bestScores = document.querySelectorAll(".best-score-value");
// Countdown Page
const countdown = document.querySelector(".countdown");
// Game Page
const itemContainer = document.querySelector(".item-container");
const answerBtns = document.querySelectorAll(".answerBtn");

// Score Page
const finalTimeEl = document.querySelector(".final-time");
const baseTimeEl = document.querySelector(".base-time");
const penaltyTimeEl = document.querySelector(".penalty-time");
const playAgainBtn = document.querySelector(".play-again");

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
finalTime = 0;
let finalTimeDisplay = "0.0s";

// Scroll
let valueY = 0;

// Local Storage
let bestScore = { 10: "0.0", 25: "0.0", 50: "0.0", 99: "0.0" };

// Reset Game
function playAgain() {
  gamePage.addEventListener("click", startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
}

// Store best score inLocal Storage
function storeBestScore() {
  if (bestScore[questionAmount] === "0.0") {
    bestScore[questionAmount] = finalTimeDisplay;
    localStorage.setItem("bestScore", JSON.stringify(bestScore));
  } else {
    if (+bestScore[questionAmount] > finalTimeDisplay) {
      bestScore[questionAmount] = finalTimeDisplay;
      localStorage.setItem("bestScore", JSON.stringify(bestScore));
    }
  }
}

//Get stored best scores from Local Storage
function getBestScore() {
  if (localStorage.getItem("bestScore")) {
    bestScore = JSON.parse(localStorage.getItem("bestScore"));
    updateBestScore();
  }
}

// Update best score on Splash Page
function updateBestScore() {
  let valuesArray = Object.values(bestScore);
  for (let i = 0; i < valuesArray.length; i++) {
    bestScores[i].textContent = `${valuesArray[i]}s`;
  }
}

// Populate score page
function populateScorePage() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty:+${penaltyTime}s`;
  // store best score
  storeBestScore();
  updateBestScore();
}

// Show Score Page
function showScorePage() {
  itemContainer.scroll(0, 0);
  populateScorePage();
  // Show Play Again button after 1 s
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
  gamePage.hidden = true;
  scorePage.hidden = false;
}

// Check Player's Guesses
function getPenaltyTime() {
  for (let i = 0; i < playerGuessArray.length; i++) {
    if (playerGuessArray[i] != equationsArray[i].evaluated) {
      penaltyTime += 0.5;
    }
  }
}

// Stop Timer, Process Results, go to Score Page
function checkTime() {
  console.log(timePlayed);
  if (playerGuessArray.length == questionAmount) {
    clearInterval(timer);
    getPenaltyTime();
    finalTime = timePlayed + penaltyTime;

    showScorePage();
  }
}

// Add a tenth of a second to timePlayed
function addTime() {
  timePlayed += 0.1;
  checkTime();
}

// Start timer when game page is clicked
function startTimer() {
  // Reset times
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener("click", startTimer);
}

// Scroll, Store user selection in playerGuessArray
function select(guessedTrue) {
  // Scroll 80 pixels
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // Add player guess to array
  return guessedTrue
    ? playerGuessArray.push("true")
    : playerGuessArray.push("false");
}

// Displays Game Page
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

// Get Random Integer
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: "true" };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(2);
    equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: "false" };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

// Add Equations to DOM
function equationsToDOM() {
  equationsArray.forEach((equation) => {
    // Item
    const item = document.createElement("div");
    item.classList.add("item");
    // Equation Text
    const equationText = document.createElement("h1");
    equationText.textContent = equation.value;
    // Append
    item.appendChild(equationText);
    itemContainer.append(item);
  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  //   // Reset DOM, Set Blank Space Above
  itemContainer.textContent = "";
  //   // Spacer
  const topSpacer = document.createElement("div");
  topSpacer.classList.add("height-240");
  //   // Selected Item
  const selectedItem = document.createElement("div");
  selectedItem.classList.add("selected-item");
  //   // Append
  itemContainer.append(topSpacer, selectedItem);

  //   // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();

  //   // Set Blank Space Below
  const bottomSpacer = document.createElement("div");
  bottomSpacer.classList.add("height-500");
  itemContainer.appendChild(bottomSpacer);
}

// Start Game

// Display 3,2,1, Go!
function countdownStart() {
  let counter = 3;
  countdown.textContent = counter;
  const countdownInterval = setInterval(() => {
    --counter;
    if (counter === 0) {
      countdown.textContent = "GO!";
    } else if (counter === -1) {
      populateGamePage();
      showGamePage();
      clearInterval(countdownInterval);
    } else {
      countdown.textContent = counter;
    }
  }, 1000);
}

// Navigate from Splash Page Countdown
function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countdownStart();
}

// Get the value from selected radio button
function getRadioValue() {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}

// Form that decides amount of questions
function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  if (questionAmount) {
    showCountdown();
  }
}

startForm.addEventListener("click", () => {
  radioContainers.forEach((radioEl) => {
    // Remove Selected Label Styling
    radioEl.classList.remove("selected-label");
    // Add it back if radio checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add("selected-label");
    }
  });
});

// Event Listeners
startForm.addEventListener("submit", selectQuestionAmount);
gamePage.addEventListener("click", startTimer);
window.addEventListener("load", getBestScore);
