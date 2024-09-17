import { images, board, game } from "./data/cards.js";

function renderCards() {
    let cardsHTML = '';
    const cards = board.getGrid();

    for (let r = 0; r < cards.length; r++) {
        for (let c = 0; c < cards[r].length; c++) {

            const card = cards[r][c];
            const idNumber = r*4 + c + 1;
            // console.log(idNumber);
            card.setIdNumber(idNumber); 

            cardsHTML +=   `
                <div class = "card-container js-card-container">
                    <div class = "image-container js-image-container
                    js-image-container-${card.imageName}-${idNumber}"
                    data-image-name="${card.imageName}"
                    data-id-number="${idNumber}">
                        <img class="mystery-image" src ="/memory-game/question-mark.png">
                    </div>
                </div>
                `;
        }
    }

    document.querySelector('.js-memory-game-grid').innerHTML = cardsHTML;
}
renderCards();

document.querySelector('.js-playgame-button').addEventListener('click', () => {
    game.play();
});