// Get the game board and win  message elements
const gameBoard = document.getElementById("gameBoard");
const winMessage = document.getElementById("winMessage");

// list of image paths for  the cards
const images = [
  "assets/1.png",
  "assets/2.png",
  "assets/3.png",
  "assets/4.png",
  "assets/5.png",
  "assets/6.png",
  "assets/7.png",
  "assets/8.png",
];

// Game variables
let firstCard, secondCard;
let lockBoard = false;
let matchCount = 0;

// Shuffle the cards randomly
//Uses the Fisher-Yates Shuffle algorithm
function shuffleCards(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); //pick random index
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; //swap positions
  }
  return shuffled;
}

// Create and display all the cards
function createCards() {
  gameBoard.innerHTML = ""; //clear the board
  winMessage.classList.remove("show"); //hide win message
  matchCount = 0; //reset match count

  //Duplicate each image and shuffle
  const allCards = shuffleCards([...images, ...images]);

  // Create card elements
  allCards.forEach((img) => {
    const card = document.createElement("div");
    card.classList.add("cards");
    card.innerHTML = `
        <div class="front">
            <img src="${img}" alt="image"/>
        </div>
        <div class="back">
        </div>
    `;
    // Add click event to flip the card
    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  });
}

// Flip the selected card
function flipCard() {
  if (lockBoard) return; //prevent flipping while board is locked
  if (this === firstCard) return; //prevent clicking the same card twice

  this.classList.add("flip"); //flip the card

  // Assign this cards as the first
  if (!firstCard) {
    firstCard = this;
    return;
  }
  // Assign this card as second
  secondCard = this;
  checkMatchCards(); //compare two cards
}

// Check if both flipped cards match
function checkMatchCards() {
  const isMatch =
    firstCard.querySelector("img").src === secondCard.querySelector("img").src
      ? disableCards() //if match found, disable further clicks
      : unFlipCards(); //otherwise, flip them back
}

// Remove matched cards click event
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  matchCount += 2; //add to matched count

  // Show win message when all pairs are matched
  if (matchCount === images.length * 2) {
    showWinMessage();
  }
  resetBoard(); //reset for next selection
}

// Flip back unmatched cards
function unFlipCards() {
  lockBoard = true; //lock the board to prevent further clicks

  // wait 1 second before flipping back both cards
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetBoard(); //reset state variable
  }, 1000);
}

// Display the win overlay message when all matches are found
function showWinMessage() {
  setTimeout(() => {
    winMessage.classList.add("show"); //make win message visible
  }, 500);
}

// Clear temporary variables and unlock board
function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

// Resets the game and stars a new round
function resetGame() {
  createCards();
}

// Generates the shuffled cards when page loads
createCards();
