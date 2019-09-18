/*getting the DOM elements*/
let cards = [...document.getElementsByClassName('cards')];
let resetBtn = document.getElementsByClassName('resetButton');
let moveCounter = document.querySelector('.moves');
let stars = [...document.querySelectorAll('span.star')]
let isFlipped = false;
let counter = 0;//keeps track of moves made
let locked = false;
let firstCard ;//holds the first flipped card.
let secondCard;//holds the second flipped card.
let allMatchCards;//holds the matched cards.
let time = document.getElementById('timer');
let updateTime; //holds the time function
let seconds = 0;
let hours = 0;
let minutes = 0;
let starsContainer = document.getElementById('starsContainer');

//starsContainer.innerHTML = stars;

// flipping the card open.
function flipCard() {
    if(locked) return ;
    if(this === firstCard) return;
    //start the timer when the first card is clicked
    if(time.textContent === '00:00:00'){
      timer();
    }
   
    // finally, flip the card
    this.classList.add('flip')

    if(!isFlipped){
      // first flip
      isFlipped = true;
      firstCard = this;
      return;
    }

    secondCard = this;
    locked = true;

    //check for match
    didItMatch();
}

function didItMatch(){
  let checkMatch = (firstCard.dataset.card === secondCard.dataset.card);
  checkMatch ? match() : notMatch();
  counter++;
  moveCounter.textContent = `${counter} Moves`;

  if(counter === 1){
    return moveCounter.textContent = `${counter} Move`;
  }

  //remove star-life after 5 moves
   deleteStar()
}


/** 
 *@function deleteStar
 *@description remove the stars after every 4moves.
*/ 

function deleteStar() {
  // destructuring all the stars into sep. variables.
  [star1, star2, star3, star4, star5] = [...stars];

    if(counter === 4){
      star5.classList.remove('life');
    } else if(counter === (4 * 2)){
      star4.classList.remove('life');
    } else if(counter === (4 * 3)){
      star3.classList.remove('life');
    } else if(counter === (4 * 4)){
      star2.classList.remove('life');
    } else if (counter === (4 * 5)){
      if(star1.classList !== 'life'){
        star1.classList.add('life');
      }
    }
}



cards.forEach(card => card.addEventListener('click', flipCard), {  
});

function match(){
  // add match-class to card
  firstCard.classList.add('match');
  secondCard.classList.add('match');

  // disable another click after the first click
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  // update the number of matched cards
  allMatchCards += 2;
  if(allMatchCards === 16){
    clearTimeout(updateTime);
     displayModal();
  }
  resetVariables();
}

/**
  *@function  notMatch
  *@description run when the cards did not match.
*/ 

function notMatch(){
  setTimeout( () =>{
    firstCard.classList.remove('flip', 'didNotMatch');
    secondCard.classList.remove('flip', 'didNotMatch');
    resetVariables();
  },500) 

}


function resetVariables(){
  [isFlipped, locked] = [false, false];
  [firstCard, secondCard] = [null, null];

}


let cardContainer = document.getElementsByClassName('cardsContainer');

// shuffle function
let shuffleCard = (shuffled) => {
  let tempVal;
  let shuffleIndex;
  for (let presentIndex = shuffled.length; presentIndex != 0; presentIndex) {
    shuffleIndex = Math.floor(Math.random() * presentIndex);
    presentIndex--
    tempVal = shuffled[presentIndex];
    shuffled[presentIndex] = shuffled[shuffleIndex];
    shuffled[shuffleIndex] = tempVal;
  }

  return shuffled;
}
let icon  = document.getElementsByClassName('fas');
// reseting the game
const reset = ()=>{
  // shuffle the cards array
  cards = shuffleCard(cards);
  // update the page with the shuffled cards
  cardContainer.innerHTML = "";
  for(card of cards ){
    cardContainer[0].appendChild(card);
    card.classList.remove('flip', 'match', 'didNotMatch');
    card.addEventListener('click', flipCard)
  }

  // clear the timer
  clearTimeout(updateTime);
  time.textContent = '00:00:00';

  // empt the whole cards
  resetVariables();
  [allMatchCards, seconds, minutes, hours] = [0, 0, 0, 0];

  // refill the stars
  for(star of stars){
    if(star.classList !== 'life'){
      star.classList.add('life');
    }
  }

  // reset game counter
  [moveCounter.textContent, counter] = ['Moves', 0];
}

resetBtn[0].addEventListener('click', reset, false);
document.addEventListener('DOMContentLoaded', reset, false);//reset the game when the browser loads

function setTime() {
seconds ++;
if(seconds >= 60){
  seconds = 0;
  minutes ++;
  if(minutes >= 60){
    minutes = 0;
    hours ++;
  }
}

  time.textContent =(hours ? (hours > 9 ? hours : '0' + hours) : '00') + ':' + (minutes ?  (minutes > 9 ? minutes : '0' + minutes): '00') + ':' + (seconds > 9 ? seconds : '0' + seconds);
  timer();
}


function timer (){
  updateTime = setTimeout(setTime, 1000);
}




// functions to count the clicks/moves
function moves(){
  counter++;  
}


// modal section
let modal = document.getElementById('modal');
let replay  = document.getElementById('replay');
let repo = document.getElementById('repo');
let timeSummary = document.getElementById('timeSummary');
let counterSummary = document.getElementById('counterSummary');
let starsSummary  = document.getElementById('starsSummary');
let close = document.getElementById('close');

// function to display modal in order to congratulate the player.
function displayModal(){
  clearTimeout(updateTime);
  timeSummary.textContent = time.textContent;
  starsSummary.innerHTML = starsContainer.innerHTML;
  counterSummary.innerHTML = counter + 1 + ' ' + 'Moves';
  modal.classList.remove('hide');
}


// a function to close the modal
function closeModal(){
  modal.classList.add('hide');//sets the modal to display none.
  //autoreset the game
  reset();
}

close.addEventListener('click', closeModal,  false);
replay.addEventListener('click', closeModal, false);