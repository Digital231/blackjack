const startGame = document.getElementById("startGame");
let moneyAmount = document.getElementById("moneyAmount");
let bidAmount = document.getElementById("bidAmount");
let deckId = "";
let money = 500;
let totalMoney = Number(localStorage.getItem("totalMoney")) || 0; // Convert to number, default to 0 if null or invalid
if (!totalMoney) {
  totalMoney = 1000;
  localStorage.setItem("totalMoney", totalMoney);
}

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

// cheatBtn.onclick = () => {
//   totalMoney += 1000;
//   localStorage.setItem("totalMoney", totalMoney);
//   moneyAmount.innerHTML = `Your total money is: ${totalMoney}`;
// };
