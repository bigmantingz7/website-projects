
// data
// images
export const images = [
    '/memory-game/images/avacado.png',
    '/memory-game/images/grape.png',
    '/memory-game/images/kiwi.png',
    '/memory-game/images/lemon.png',
    '/memory-game/images/orange.png',
    '/memory-game/images/pear.png',
    '/memory-game/images/pumpkin.png',
    '/memory-game/images/watermelon.png'
];

// classes
class Card {
    image;
    imageName;
    idNumber;
    isClicked = false;

    constructor(image) {
        this.image = image;
        this.setImageName(image);
    }

    getImage() {
        return this.image;
    }

    getImageName() {
        return this.imageName;
    }

    getIdNumber() {
        return this.idNumber;
    }

    getIsClicked() {
        return this.isClicked;
    }

    printCoordinates() {
        console.log('('+ this.getX() + ',' + this.getY() + ')');
    }

    setImageName(image) {
        const index = indexOf(image, '/');
        const name = image.substring(index + 1, image.length-4);
        // console.log(name);
        this.imageName = name;
    }

    setIdNumber(id) {
        this.idNumber = id;
    }

    clicked() {
        this.isClicked = !this.isClicked;
    }
}

class Board {
    grid = [];

    constructor(cards) {
        this.setGrid(cards);
    }

    getGrid() {
        return this.grid;
    }

    getCards() {
        let cards = this.getGrid();
        let temp = [];
        for (let r = 0; r < cards.length; r++) {
            for (let c = 0; c < cards[r].length; c++) {
                temp.push(cards[r][c]);
                // console.log(cards[r][c]);
            }
        }
        cards = temp;
        return cards;
    }

    setGrid(cards) {
        let row = [];
        let copy = cards;
        let rowIndex = 0;
        // console.log(this.grid);
        for (let i = 0; i < cards.length; i++) {
            const randomIndex = Math.floor(Math.random() * copy.length);
            const randomCard = copy[randomIndex];
            row.push(randomCard);
            if (row.length === 4) {
                this.grid.push(row);
                row = [];
                rowIndex++;
            }
            copy = remove(copy, randomIndex);
        }
        // console.log(this.grid);
    }

    findCard(idNumber) {
        let cards = this.getCards();
        let matchingCard;
        // console.log(cards);
        cards.forEach((card) => {
            // console.log(card);
            // console.log(card.getIdNumber() === Number(idNumber));
            // console.log(`${card.getIdNumber()}, ${Number(idNumber)}`);
            // console.log(typeof card.getIdNumber() + ', ' + typeof idNumber);
            // console.log(card.getImageName() === imageName);
            // console.log(`${card.getImageName()}, ${imageName}`);
            // console.log(card.getIdNumber());
            if (card.getIdNumber() === Number(idNumber)) {
                // console.log('passed');
                // console.log(card);
                matchingCard = card;
            }
        });
        return matchingCard;
    }
}

class Game {
    board;
    numberOfPairs;
    numberOfPairsFound = 0;
    cardsInPlay;

    constructor(board) {
        this.board = board;
        this.numberOfPairs = this.setNumberOfPairs();
    }

    setNumberOfPairs() {
        const cards = this.board.getCards();
        return cards.length/2;
    }

    isTwoCardsFlipped() {
        const cards = this.cardsInPlay;
        let count = 0;
        let flag = false;
        cards.forEach((card) => {
            if (card.getIsClicked()) {
                count++;
            }
            if (count === 2) {
                flag = true;
            }
            // console.log(count);
        });
        return flag;
    }


    flipCard(imageContainer, imageName) {
        imageContainer.innerHTML = `<img class="memory-image" src ="/memory-game/images/${imageName}.png">`;
    }

    unClickPairOfCards(pair) {
        // console.log(pair);
        pair[0].clicked();
        pair[1].clicked();
        console.log(this);
    }

    unflipCards(pair) {
        setTimeout(() => {
            const card1 = pair[0];
            const card2 = pair[1];
            const card1ImageContainer = document.querySelector(`.js-image-container-${card1.getImageName()}-${card1.getIdNumber()}`);
            const card2ImageContainer = document.querySelector(`.js-image-container-${card2.getImageName()}-${card2.getIdNumber()}`);
            // console.log(card1ImageContainer);
            // console.log(card2ImageContainer);
            card1ImageContainer.innerHTML = `<img class="mystery-image" src ="/memory-game/question-mark.png">`;
            card2ImageContainer.innerHTML = `<img class="mystery-image" src ="/memory-game/question-mark.png">`;
        }, 500);
        this.unClickPairOfCards(pair);
        console.log('not a match!');
    }

    findFlippedCards(cards) {
        let pair = [];
        cards.forEach((card) => {
            if (card.getIsClicked()) {
                pair.push(card);
            }
        });
        return pair;
    }

    getCardPosition(cards, card) {
        let index = -1;
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].getIdNumber() === card.getIdNumber()) {
                index = i;
            }
        }
        return index;
    }

    removeMatchFromCards(pair) {
        pair.forEach((card) => {
            const cardIndex = this.getCardPosition(this.cardsInPlay, card);
            // console.log(cardIndex + ', ' + card.getImageName());
            this.cardsInPlay = remove(this.cardsInPlay, cardIndex);
            // console.log(this.cardsInPlay);
            // console.log(this.cardsInPlay.length);
        });
        // console.log(cards.length);
    }

    play() {
        this.cardsInPlay = this.board.getCards();

        document.querySelectorAll('.js-card-container').forEach((card) => {
            card.addEventListener('click', () => {

                // getting the coresponing card in the board grid when clicked.
                const imageContainer = card.querySelector('.js-image-container');
                const imageName = imageContainer.dataset.imageName;
                const idNumber = imageContainer.dataset.idNumber;
                const matchingCard = this.board.findCard(idNumber);
                matchingCard.clicked();
        

                // console.log(this.numberOfPairs);
                // console.log('test: ' + this.isTwoCardsFlipped());
                // console.log(this.cardsInPlay);
                this.flipCard(imageContainer, imageName);
                if (this.isTwoCardsFlipped()) {
                    let potentialPair = this.findFlippedCards(this.cardsInPlay);
                    // console.log(potentialPair);
                    const card1 = potentialPair[0];
                    const card2 = potentialPair[1];
                    // console.log(card1);
                    // console.log(card2);
                    if (card1.getImageName() === card2.getImageName()) {
                        console.log('passed');
                        this.numberOfPairsFound++;
                        this.removeMatchFromCards(potentialPair);
                        if (this.numberOfPairsFound === this.numberOfPairs) {
                            // alert('You have won the game!!!');
                            document.querySelector('.js-winning-message').innerText = `Congrats, you've got a great memory!\nReload the page to play again.`;
                        }
                    } else {
                        console.log('failed');
                        this.unflipCards(potentialPair);
                    }
                } else {
                    console.log('Only one card is flipped!');
                }

                // console.log(this);
                console.log(this.numberOfPairsFound);
                // console.log(this.cardsInPlay.length);
            });
        });
    }
}

// functions
function makeCards() {
    const deck = images.map((image) => {
        return new Card(image);
    });
    return deck;
}

function doubleCards(deck) {
    let temp = [];
    for (let i = 0; i < deck.length; i++) {
        temp.push(deck[i]);
        temp.push(new Card(deck[i].getImage()));
    }
    return temp;
}

// removes an item from an array at an index
function remove(array, index) {
    let temp = [];
    for (let i = 0; i < array.length; i++) {
        if (i === index) {
            continue;
        }
        temp.push(array[i]);
    } 
    return temp;
}

// index-of function of the last occurence
// string.length() >= substring.length()
function indexOf(string, substring) {
    for (let i = string.length; i >= 0; i--) {
        if (string.substring(i-substring.length,i) === substring) {
            return i-substring.length;
        }
    }
    return -1;
}

/*
const a = 'adam';
const b = 'adamadam';
const c = '/memory-game/images/kiwi.png';
const d = 'kiwi';
console.log(4 === indexOf(b,a));
console.log(c.length);
console.log(20 === indexOf(c,d));
const e = new Card(c);
e.setImageName(c);
*/

// board
// instantiate cards
const cards = doubleCards(makeCards());
// console.log(cards);
// instanitate board
export const board = new Board(cards);
// console.log(board.getGrid());
export const game = new Game(board);
console.log(game);