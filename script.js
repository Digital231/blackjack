const startGame = document.getElementById("startGame");
let moneyAmount = document.getElementById("moneyAmount");
let bidAmount = document.getElementById("bidAmount");
let deckId = "";
let money = 500;
let totalMoney = Number(localStorage.getItem("totalMoney")) || 0; // Convert to number, default to 0 if null or invalid
if (totalMoney === null || totalMoney === undefined || isNaN(totalMoney)) {
  totalMoney = 1000;
  localStorage.setItem("totalMoney", totalMoney);
}
const cheatBtn = document.getElementById("cheatBtn");
const moneyImage = document.getElementById("moneyImage");
const cleanStorage = document.getElementById("cleanStorage");

cleanStorage.onclick = () => {
  const lastCleared = localStorage.getItem("lastCleared");
  const currentTime = new Date().getTime(); // Current time in milliseconds

  if (lastCleared && currentTime - lastCleared < 3600000) {
    // 3600000 milliseconds in an hour
    alert("You can only clear the storage once every hour.");
  } else {
    localStorage.clear();
    totalMoney = 100;
    localStorage.setItem("totalMoney", totalMoney);
    localStorage.setItem("lastCleared", currentTime); // Store the time of this click
    moneyAmount.innerHTML = `Your total money is: ${totalMoney}`;
    alert(
      "Storage has been successfully cleared. You can clear again after one hour."
    );
  }
};

cheatBtn.onclick = () => {
  // Randomly position the money image on the screen
  const x = Math.random() * window.innerWidth - 100; // Adjust -100 to prevent overflow
  const y = Math.random() * window.innerHeight - 100;

  // Set image position and show it
  moneyImage.style.left = `${x}px`;
  moneyImage.style.top = `${y}px`;
  moneyImage.style.display = "block";

  // Set a timer to hide the image after 1 second
  setTimeout(() => {
    moneyImage.style.display = "none";
  }, 800);
};

// Add event listener to the money image
moneyImage.onclick = (event) => {
  const audio = new Audio("./assets/YouWinGold.wav");
  audio.play();
  // Prevent further propagation of the click event
  event.stopPropagation();

  // Add money when the image is clicked
  totalMoney += 5;
  localStorage.setItem("totalMoney", totalMoney);
  moneyAmount.innerHTML = `Your total money is: ${totalMoney}`;

  // Hide the image after it's clicked
  moneyImage.style.display = "none";
};

moneyAmount.innerHTML = `Your total money is: ${totalMoney}`;

startGame.onclick = () => {
  fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6")
    .then((response) => response.json())
    .then((data) => {
      if (totalMoney <= 0) {
        alert("You don't have enough money");
        return;
      }
      if (bidAmount.value <= 0) {
        alert("Bid amount must be greater than 0");
        return;
      }
      const bid = Number(bidAmount.value);
      totalMoney -= bid; // Subtract bid amount from totalMoney
      deckId = data.deck_id;
      localStorage.setItem("deckId", deckId);
      localStorage.setItem("bidAmount", bid);
      localStorage.setItem("totalMoney", totalMoney);
      moneyAmount.innerHTML = `Your total money is: ${totalMoney}`;
      console.log(deckId);
      console.log(bid);
      console.log(totalMoney);
      document.location.href = "./game.html";
    });
};
