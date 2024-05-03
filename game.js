//documentation for blackjacks API//
// Shuffle the Cards:
// https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1
// Add deck_count as a GET or POST parameter to define the number of Decks you want to use. Blackjack typically uses 6 decks. The default is 1.
/*
Response:
{
    "success": true,
    "deck_id": "3p40paa87x90",
    "shuffled": true,
    "remaining": 52
}
*/
/*
Draw a Card:
https://www.deckofcardsapi.com/api/deck/<<deck_id>>/draw/?count=2 copy
The count variable defines how many cards to draw from the deck. Be sure to replace deck_id with a valid deck_id. We use the deck_id as an identifier so we know who is playing with what deck. After two weeks, if no actions have been made on the deck then we throw it away.

TIP: replace <<deck_id>> with "new" to create a shuffled deck and draw cards from that deck in the same request.
Response:
{
    "success": true, 
    "deck_id": "kxozasf3edqu", 
    "cards": [
        {
            "code": "6H", 
            "image": "https://deckofcardsapi.com/static/img/6H.png", 
            "images": {
                          "svg": "https://deckofcardsapi.com/static/img/6H.svg", 
                          "png": "https://deckofcardsapi.com/static/img/6H.png"
                      }, 
            "value": "6", 
            "suit": "HEARTS"
        }, 
        {
            "code": "5S", 
            "image": "https://deckofcardsapi.com/static/img/5S.png", 
            "images": {
                          "svg": "https://deckofcardsapi.com/static/img/5S.svg", 
                          "png": "https://deckofcardsapi.com/static/img/5S.png"
                      }, 
            "value": "5", 
            "suit": "SPADES"
        }
    ], 
    "remaining": 50
}
*/

let money = document.getElementById("totalMoney");
let playerPoints = document.getElementById("playerPoints");
let dealerPoints = document.getElementById("dealerPoints");
let playerCardsImg = document.querySelector(".playerCardsImg");
let dealerCardsImg = document.querySelector(".dealerCardsImg");
let drawCardBtn = document.getElementById("drawCard");
let stopDrawCardBtn = document.getElementById("stopDrawCard");
let deckId = localStorage.getItem("deckId");
const reshuffleBtn = document.getElementById("reshuffle");
let messages = document.querySelector(".messages");
let totalMoneyHTML = document.getElementById("totalMoney");

const cardValues = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  JACK: 10,
  QUEEN: 10,
  KING: 10,
  ACE: 11, // 11 or 1
};
let dealerCards = [];
let playerCards = [];
let totalPlayerPoints = 0;
let totalDealerPoints = 0;
let totalMoney = Number(localStorage.getItem("totalMoney")) || 0;
let bidAmount = Number(localStorage.getItem("bidAmount")) || 0;
localStorage.setItem("totalMoney", totalMoney);
totalMoneyHTML.innerHTML = `Your total money is: ${totalMoney}`;
console.log(playerCards, dealerCards);

const getAceValue = (totalPoints, cardValue, playerCards) => {
  // Count the number of existing Aces in the hand
  const existingAces = playerCards.filter(
    (card) => card.value === "ACE"
  ).length;

  if (cardValue === 11) {
    // If the card is an Ace
    if (totalPoints + 11 + existingAces * 10 > 21) {
      // If counting the Ace as 11 would cause the total to exceed 21
      return 1; // Count the Ace as 1
    }
    return 11; // Otherwise, count the Ace as 11
  }
  return cardValue;
};

drawCardBtn.onclick = () => {
  fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
    .then((response) => response.json())
    .then((data) => {
      playerCards.push(data.cards[0]);
      const cardValue = cardValues[data.cards[0].value] || 0;
      const aceValue = getAceValue(totalPlayerPoints, cardValue, playerCards);
      totalPlayerPoints += aceValue;
      playerPoints.innerHTML = `Player Points: ${totalPlayerPoints}`;
      playerCardsImg.innerHTML += `<img src="${data.cards[0].image}"/>`;
      if (totalPlayerPoints > 21) {
        drawCardBtn.disabled = true;
        stopDrawCardBtn.disabled = true;
        messages.innerHTML = "You Lose!";
        // totalMoney -= bidAmount;
        localStorage.setItem("totalMoney", totalMoney);
        money.innerHTML = `Your total money is: ${totalMoney}`;

        setTimeout(() => {
          window.location.href = "./index.html";
        }, 5000);
      }

      console.log(data.cards[0]);
    });
};

const dealerDrawCard = () => {
  fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
    .then((response) => response.json())
    .then((data) => {
      dealerCards.push(data.cards[0]);
      const cardValue = cardValues[data.cards[0].value] || 0;
      const aceValue = getAceValue(totalPlayerPoints, cardValue, playerCards);
      totalDealerPoints += aceValue;
      dealerPoints.innerHTML = `Dealer Points: ${totalDealerPoints}`;
      dealerCardsImg.innerHTML += `<img src="${data.cards[0].image}"/>`;
      console.log(data.cards[0]);

      if (totalDealerPoints > 21) {
        // Dealer busts, player wins
        console.log("Dealer busts, you win!");
        messages.innerHTML = "You Win! Amount won: " + bidAmount * 2;
        totalMoney += bidAmount * 2;
        localStorage.setItem("totalMoney", totalMoney);
        money.innerHTML = `Your total money is: ${totalMoney}`;
        setTimeout(() => {
          window.location.href = "./index.html";
        }, 5000);
      } else if (totalDealerPoints >= 17) {
        // Dealer stands
        if (totalPlayerPoints > 21) {
          // Player busts
          console.log("You bust!");
          messages.innerHTML = "You Bust! Amount lost: " + bidAmount;
          totalMoney -= bidAmount;
          localStorage.setItem("totalMoney", totalMoney);
          money.innerHTML = `Your total money is: ${totalMoney}`;
          setTimeout(() => {
            window.location.href = "./index.html";
          }, 5000);
        } else if (totalDealerPoints > totalPlayerPoints) {
          // Dealer wins
          console.log("Dealer wins!");
          messages.innerHTML = "You Lose! Amount lost: " + bidAmount;
          totalMoney -= bidAmount;
          localStorage.setItem("totalMoney", totalMoney);
          money.innerHTML = `Your total money is: ${totalMoney}`;
          setTimeout(() => {
            window.location.href = "./index.html";
          }, 5000);
        } else if (totalDealerPoints === totalPlayerPoints) {
          // Dealer wins (tie)
          console.log("Dealer wins (tie)!");
          messages.innerHTML = "Dealer wins (tie)! Amount lost: " + bidAmount;
          totalMoney -= bidAmount;
          localStorage.setItem("totalMoney", totalMoney);
          money.innerHTML = `Your total money is: ${totalMoney}`;
          setTimeout(() => {
            window.location.href = "./index.html";
          }, 5000);
        } else {
          // Player wins
          console.log("You win!");
          messages.innerHTML = "You Win! Amount won: " + bidAmount * 2;
          totalMoney += bidAmount * 2;
          localStorage.setItem("totalMoney", totalMoney);
          money.innerHTML = `Your total money is: ${totalMoney}`;
          setTimeout(() => {
            window.location.href = "./index.html";
          }, 5000);
        }
      } else {
        // Dealer draws another card
        setTimeout(dealerDrawCard, 1000);
      }
    });
};
stopDrawCardBtn.onclick = () => {
  drawCardBtn.disabled = true;
  stopDrawCardBtn.disabled = true;
  dealerDrawCard(); // Start the dealer's draw
};

reshuffleBtn.onclick = () => {
  fetch("https://www.deckofcardsapi.com/api/deck/" + deckId + "/shuffle/")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
};
