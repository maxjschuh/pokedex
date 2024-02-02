/**
 * Fetches the base data for a range of pokemon and renders them in the card deck.
 * @param {number} first first pokemon in the range that should be fetched and rendered
 * @param {number} last last pokemon in the range that should be fetched and rendered
 */
async function loadAndRenderPokemon(first, last) {

    for (let i = first; i < last; i++) {

        let id = i + 1;

        if (i >= 1010) id = '10' + `${id - 10}`.substring(1);

        if (!basePokedex[i]) {
            const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
            await fetchData(i, url, basePokedex);
        }

        document.getElementById('card-deck').innerHTML += templatePokedexCard(i);
    }
}


/**
 * Fetches data from the API from an inputted endpoint and saves the this data to an inputted array.
 * @param {number} i index of the pokemon that should be fetched in the pokemonNames array
 * @param {string} url URL / endpoint of the API from where the data should be fetched
 * @param {Array} localArrayToPushTo local array to where the received data should be saved
 * @returns {void} when an error occurs while communication with the API
 */
async function fetchData(i, url, localArrayToPushTo) {

    let response;
    try {
        response = await fetch(url);

    } catch (error) {
        document.getElementById('api-warning').classList.remove('display-none');
        return;
    }

    let responseJson = await response.json();
    localArrayToPushTo.splice(i, 1, responseJson);
}


/**
 * Returns HTML Template for a pokemon card in the card deck.
 * @param {number} i index of the pokemon that should be rendered
 * @returns {void} HTML Template for a pokemon card in the card deck.
 */
function templatePokedexCard(i) {

    const pokemon = basePokedex[i];
    const name = pokemon.name;
    const imgUrl = returnImageUrl(pokemon);
    const basePokedexId = '#' + convertToTripleDigits(i + 1);

    return /*html*/ `
    <div onclick="toggleDetailView(true, ${i})">
        <h2>
        ${capitalizeFirstCharacter(name)} <br>
        ${basePokedexId}</h2>
        <img src="${imgUrl}" alt="${name}">        
    </div>
    `;
}


/**
 * Changes the index to a three-digit number if it has less than three digits (by filling up the empty spaces with zeros).
 * @param {number} i index of the pokemon
 * @returns {number} index as three-digit number
 */
function convertToTripleDigits(i) {

    const idAsString = `${i}`;

    if (idAsString.length > 3) {
        return idAsString;
    }

    const zeros = '0'.repeat(3 - idAsString.length);
    return zeros + idAsString;
}


/**
 * Changes the first character of a input string to uppercase.
 * @param {string} inputString lowercase name of a pokemon
 * @returns {string} name of a pokemon with uppercase first character
 */
function capitalizeFirstCharacter(inputString) {

    let firstCharacter = inputString.charAt(0).toUpperCase();
    let newString = firstCharacter + inputString.substring(1);
    return newString;
}


/**
 * Returns the url for the picture of the pokemon in the card deck or detail view. Bypasses possible null values.
 * @param {object} pokemon entry in the database of the pokemon whose picture url should be returned
 * @returns {string} image url for the inputted pokemon
 */
function returnImageUrl(pokemon) {

    let imgUrl = pokemon.sprites.other.home.front_default;

    if (!imgUrl) {
        imgUrl = pokemon.sprites.other['official-artwork'].front_default;
    }

    if (!imgUrl) {
        imgUrl = './img/no_image.png';
    }

    return imgUrl;
}


/**
 * Called by user click on "Show more"-button. Loads the next 20 pokemon depending on the already ready ones.
 */
async function showMore() {

    toggleShowMoreButton()

    const first = currentCardDeckSize;
    const last = currentCardDeckSize + 20;

    await loadAndRenderPokemon(first, last);
    currentCardDeckSize = last;

    toggleShowMoreButton(true);
}


function toggleShowMoreButton(show) {

    document.getElementById('button-show-more').classList.toggle('display-none', !show);
    document.getElementById('loading-animation').classList.toggle('display-none', show);
}