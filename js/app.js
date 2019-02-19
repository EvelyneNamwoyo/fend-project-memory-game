// list that holds all cards
let cards = ['fa-diamond','fa-paper-plane-o',
            'fa-anchor','fa-bolt',
            'fa-cube','fa-leaf',
            'fa-bicycle','fa-bomb'];
cards = cards.concat(cards)

let readyToCompare = false;
let TimingOff = true;
let firstCard;
let count = 0;
let moves = 0;
let times;
let goodMoves = 0;
let moveConter = document.querySelector('.moves');
let timer = document.querySelector('.timer');
let starwrapper = document.querySelector('.stars')

/***********************************************************Creating the grid,placing cards on grid and playing the game******************************************** */
// This function creates an html grid where the cards will be displayed
function CreateCardGrid(card){
    return `<li class="card">
                        <i class = "fa ${card}"></i>
                    </li>`;
}
/*This function loops through a list of shuffled cards,
gets a card and places it on the deck.*/
function createGameBoard(){
    let newcards = shuffle(cards);
    for (let card of newcards){
        var wrapper = document.createElement('ul');
        wrapper.innerHTML = CreateCardGrid(card);
        let li= wrapper.firstChild;
        document.getElementsByClassName('deck')[0].appendChild(li);
    }
}

// This functions flips over two cards at a time and checks whether they match
function RevealCard(){
    allCards = document.querySelectorAll('.card');
    allCards.forEach(function(card){
        // An event listener to check if a card has been clicked
        card.addEventListener('click',function(e){
            // calling a fucntion to start timing
            if (TimingOff){
                addTime();
                TimingOff = true;
            }
            /* Check if a card has not already been opened, showed or matched
            */
            if (!card.classList.contains('open') && !card.classList.contains('show') 
                    && !card.classList.contains('match') ){
                card.classList.add('open','show');
                // Checks if a card is ready to be compared and compares
                // First time readyToCompare is false
                if(readyToCompare){
                    // variable secondCard is set to the card clicked on second
                    let secondCard = card;
                    // firstCardClass is a variable set to the class on the first card.
                    let firstCardClass = firstCard.firstChild.nextSibling.className;
                    // secondCardClass is a variable set to the class on the second card.
                    let secondCardClass = secondCard.firstChild.nextSibling.className;
                    
                    // This function hides a by removing the open and show classes from a card
                    let hideCards = (fc, sc)=>{
                        fc.classList.remove('open', 'show');
                        sc.classList.remove('open', 'show'); 
                    }
                    /* 
                    This checks if the cards already have similar classes
                    and adds the match class to the cards.
                    */
                    if(firstCardClass==secondCardClass){
                        secondCard.classList.add('match');
                        firstCard.classList.add('match');
                        // goodMoves keeps track of the game to know when its a win
                        goodMoves+=1;
                        checkComplete();
                        
                    }
                    else{
                        /*
                        If cards did not match, 
                        the hideCrds method is called after 1000 seconds
                         */
                        setTimeout(hideCards, 1000, firstCard, secondCard);
                    }
                    Countmoves();
                    addStars();
                    /*After the first two cards are matched,
                    firstCard variable is set to null and readyToCompare is set to false
                     */
                    firstCard = null;
                    readyToCompare = false;
                }
                else{
                    // if no card has been compared(readyToCompare is false), I set variable firstcard 
                    // to the card I click on first(1st card in the foreach loop)
                    firstCard = card;
                    readyToCompare = true;

                }

            }
        });
        });  

}
/* This function checks whether a game has been won
Displays the win dialog and retsrts the game
*/
function checkComplete(){
    let dialog = document.getElementById('displayWin');
    let restart = document.getElementById('play_again');
    let winTime = document.querySelector('.win-time');
    let winRating = document.querySelector('.win-rating');
    if (goodMoves===8){
        winTime.innerHTML = timer.innerHTML;
        winRating.innerHTML = starwrapper.innerHTML;
        dialog.showModal();
        restart.addEventListener('click', function(){
            dialog.close();
            // reset.innerHTML = createGameBoard();
            initGame();
        });
    }
}

/*This function keeps track of the moves made by a player*/
function Countmoves(){
    moves+=1;
    moveConter.innerHTML = moves;
}
/***********************************************************Code to manipulate the star ratings on the score panel******************************************** */
// This function reduces the number of star ratings as the game goes on
function removeStar(){
    const stars = document.querySelectorAll('.stars li');
        for(const star of stars){
            if(star.style.display !== 'none'){
                star.style.display = 'none';
                break;

            }
        }
}
// this function creates the html for the star ratings
function createStarRatings(star){
    return `<li><i class="${star}"></i></li>`;
}
// this fucntion displays the star ratings.
resetStars = function(){
    let ratings = ['fa fa-star','fa fa-star','fa fa-star','fa fa-star'];
    for (const star of ratings){
        let wrapper = document.createElement('ul');
        wrapper.innerHTML = createStarRatings(star)
        let li= wrapper.firstChild;
        document.getElementsByClassName('stars')[0].appendChild(li);
    }
}
// this function reduces the number of star 
// ratings after a certain number of moves
function addStars(){
    if(moves===4 || moves===8 || moves===16 || moves===24){
        removeStar();  
    }
}
/***********************************************************Code to manipulate the timing on the score panel******************************************** */
// This function satrts the timer
function startTiming(){
    times = setInterval(function(){ 
        count+=1;
        }, 1000);

}
// This functions picks seconds and minutes from the time counter and displays them.
function addTime(){
    startTiming();
    let minutes = Math.floor(count/60);
    let seconds = Math.floor(count%60);
    timer.innerHTML = `${minutes}:${seconds}  `
}
/***********************************************************Initialising the game******************************************** */

// This function starts the game
function initGame(){
    goodMoves = 0;
    count = 0;
    // this resets the moves to 0
    moves = 0;
    moveConter.innerHTML='0';

    // resets timer to 0
    times = 0;
    timer.innerHTML = '00:00'

    // this resets the star rating
    starwrapper.innerHTML = ' ';
    resetStars();

    reset = document.querySelector('.deck');
    reset.innerHTML = ' '
    createGameBoard();
    RevealCard();
}

/***********************************************************Code to shuffle cards******************************************** */
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
initGame();

// startTiming();