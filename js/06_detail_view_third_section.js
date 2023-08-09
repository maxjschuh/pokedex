/**
 * Renders the third section in the detail view for the inputted pokemon.
 * @param {number} i index of the pokemon for which the detail view should be rendered
 */
async function renderDetailViewThirdSection(i) {

    await createMovesArrays();
    await renderFirst4Moves(i);
    unlockSection('section-moves', 'loading-animation-2');
}


/**
 * Fetches all move names from the API and saves them to the moveNames array.
 */
async function createMovesArrays() {

    let response = await fetch('https://pokeapi.co/api/v2/move?limit=10000');
    response = await response.json();

    for (let i = 0; i < response.results.length; i++) {
        const moveName = response.results[i].name;

        moveNames.push(moveName);
    }

    moveTypes = Array(moveNames.length).fill(null);
}


/**
 * Renders the first four moves in the database for the inputted pokemon.
 * @param {number} i index of the pokemon whose moves should be rendered
 */
async function renderFirst4Moves(i) {
    const pokemon = basePokedex[i];

    for (let j = 0; j < 4; j++) {

        const id = `detail-view-move-${j}`;
        let container = document.getElementById(id);

        if (pokemon.moves[j]) {
            const move = pokemon.moves[j].move;
            container.innerHTML = await templateMove(move.name, move.url);

        } else {
            container.innerHTML = 'No data';
        }
    }
}


/**
 * Returns the HTML template for the inputted move including a type bubble
 * @param {string} moveName name of the move that should be rendered
 * @param {string} moveUrl API endpoint url of the move
 * @returns HTML template for the move including a type bubble
 */
async function templateMove(moveName, moveUrl) {

    let index = moveNames.indexOf(moveName);

    if (moveTypes[index] == null) {

        await fetchMoveType(index, moveUrl);
    }
    const moveType = moveTypes[index];

    let html = /*html*/ `
    ${capitalizeFirstCharacter(moveName)}
    ${templateType(moveType)}
    `;
    return html;
}


/**
 * Fetches the type of a inputted move from the API and saves it in the moveTypes array.
 * @param {number} index index of the move whose type should be fetched
 * @param {string} url api endpoint url to fetch the move type from
 */
async function fetchMoveType(index, url) {

    let moveData = await fetch(url);
    moveData = await moveData.json();

    moveTypes.splice(index, 1, moveData.type.name);
}