// Main Game Play
let cards = document.getElementsByClassName('game-card');
let cardsArray = [...cards];
let cardFace = document.getElementsByClassName('game-card-img');
let cardFaceArray = [...cardFace];
let starElements = document.getElementsByClassName('star');
let starElementsArray = [...starElements];
let counter = document.getElementById('moveCounter');
let timer = document.getElementById('timer');
let overlayElement = document.getElementById('gameOverOverlay');
let totalMovesMade = document.getElementById('totalGameMoves');
let totalTimeTaken = document.getElementById('totalGameTime');
let closeOverlayIcon = document.getElementById('closeOverlay');
let flippedCards = [];
let matchedCards =  [];
let moves;
let second = 0;
let minute = 0;
let hour = 0;
let interval;
let totalGameTime;
let starRating;
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue,
        randomIndex;
    while (currentIndex !==0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
function startGame() {
    //shuffle cards
    let shuffledImages = shuffle(cardFaceArray);
    for(i=0; i<shuffledImages.length; i++) {
        //remove all images from previous games from each card (if any)
        cards[i].innerHTML = "";
        //add the shuffled images to each card
        cards[i].appendChild(shuffledImages[i]);
        cards[i].type = `${shuffledImages[i].alt}`;
        //remove all extra classes for game play
        cards[i].classList.remove("show", "open", "match", "disabled");
        cards[i].children[0].classList.remove("show-img");
    }
    //listen for events on the cards
    for(let i = 0; i < cardsArray.length; i++) {
        cardsArray[i].addEventListener("click", displayCard)
    }
    //when game starts show all the cards for a split second
    quickDisplay();
    //reset moves
    moves = 0;
    counter.innerText = `${moves} move(s)`;
    //Reset Timer on game reset
    timer.innerHTML = '0 mins 0 secs';
    clearInterval(interval);
}
function quickDisplay() {
    for(i=0; i<cards.length; i++) {
        cards[i].children[0].classList.add("show-img")
    }
    setTimeout(function(){
        for(i=0; i<cards.length; i++) {
            cards[i].children[0].classList.remove("show-img")
        }
    }, 1000)
}
function displayCard() {
    this.children[0].classList.toggle('show-img');
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled");
    clickedCard(this);
}
function clickedCard(card) {
    flippedCards.push(card);
    let len = flippedCards.length;
    if(len === 2) {
        totalMoves();
        if(flippedCards[0].type === flippedCards[1].type) {
            matchingCards();
        } else {
            nonMatchingCards();
        }
    }
}
function matchingCards() {
    flippedCards[0].classList.add("match");
    flippedCards[1].classList.add("match");
    flippedCards[0].classList.remove("show", "open");
    flippedCards[1].classList.remove("show", "open");
    matchedCards.push(flippedCards[0]);
    matchedCards.push(flippedCards[1]);
    flippedCards = [];
    if(matchedCards.length == 16) {
        endGame();
    }
}
function nonMatchingCards() {
    flippedCards[0].classList.add("unmatched");
    flippedCards[1].classList.add("unmatched");
    disableCard();
    setTimeout(function() {
        flippedCards[0].classList.remove("show", "open", "unmatched");
        flippedCards[1].classList.remove("show", "open", "unmatched");
        flippedCards[0].children[0].classList.remove('show-img');
        flippedCards[1].children[0].classList.remove('show-img');
        enableCard();
        flippedCards = [];
    }, 1100)
}
function disableCard() {
    cardsArray.filter((card, i, cardsArray) => {
        card.classList.add('disabled');
    })
}
function enableCard() {
    cardsArray.filter((card, i, cardsArray) => {
        card.classList.remove('disabled');
        for(let i=0; i<matchedCards.length; i++) {
            matchedCards[i].classList.add('disabled');
        }
    })
}
function totalMoves() {
    moves++;
    counter.innerHTML = `${moves} move(s)`;
    if(moves == 1) {
        second = 0;
        minute = 0;
        hour = 0;
        startTimer();
    }
}
function startTimer() {
    interval = setInterval(function(){
        timer.innerHTML = `${minute} mins ${second} secs`;
        second++;
        if(second == 60) {
            minute++;
            second = 0;
        }
        if(minute == 60) {
            hour++;
            minute = 0;
        }
    }, 1000)
}
function endGame() {
    clearInterval(interval);
    totalGameTime = timer.innerHTML;
     
    //show modal on game end
    overlayElement.classList.add("show-overlay");
    //show totalGameTime, moves and finalStarRating in Modal
    totalTimeTaken.innerHTML = totalGameTime;
    totalMovesMade.innerHTML = moves;
    matchedCards = [];
    closeOverlay();
}
 

function playAgain() {
    overlayElement.classList.remove("show-overlay");
    startGame();
}
// wait for some milliseconds before game starts
window.onload = function () {
    setTimeout(function() {
        startGame()
    }, 1200);}
