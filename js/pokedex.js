let basePokedex = Array(1281).fill(null);
let speciesPokedex = Array(1281).fill(null);
let namesPokedex = Array(1281).fill(null);
let evolutionChains = Array(1281).fill(null);

let searchResultsCount;
let currentCardDeckSize;
let searchInputs = [];
let ongoingSearch = false;
let newSearchTriggered = false;
let moveNames = [];
let moveTypes = [];




/**
 * Initializes the page by loading the first 20 pokemon into the card deck.
 */
async function init() {

    await loadAndRenderPokemon(0, 20);
    currentCardDeckSize = 20;

    await fetchAllPokemonNames();

    document.getElementById('loading-animation').classList.add('display-none');
    document.getElementById('button-show-more').classList.remove('display-none');
}

/**
 * Called by user click on "Show more"-button. Loads the next 20 pokemon depending on the already ready ones.
 */
async function showMore() {

    document.getElementById('button-show-more').classList.add('display-none');
    document.getElementById('loading-animation').classList.remove('display-none');

    const first = currentCardDeckSize;
    const last = currentCardDeckSize + 20;

    await loadAndRenderPokemon(first, last);
    currentCardDeckSize = last;

    document.getElementById('loading-animation').classList.add('display-none');
    document.getElementById('button-show-more').classList.remove('display-none');
}



//---------------------------------------
// search function
//---------------------------------------

/**
 * Starts a new search, that is: pushes the validated search input to the searchInputs array and triggers the search process if it is not already ongoing.
 */
async function startNewSearch() {

    document.getElementById('loading-animation').classList.remove('display-none');
    document.getElementById('button-show-more').classList.add('display-none');


    const searchInput = validateSearchInput();
    searchInputs.push(searchInput);
    newSearchTriggered = true;

    if (!ongoingSearch) {
        ongoingSearch = true;
        triggerSearch();
    }
}


/**
 * Iterates through the searchInputs array and hands the current last input over to the search function. 
 */
async function triggerSearch() {

    for (let i = 0; i < searchInputs.length; i++) {

        if (i == (searchInputs.length - 1)) {

            newSearchTriggered = false;
            await search(searchInputs[i]);

            if (!searchInputs[i]) {
                document.getElementById('button-show-more').classList.remove('display-none');
                currentCardDeckSize = 20;
            }
        }
    }
    searchInputs = [];
    ongoingSearch = false;
}


/**
 * Compares the search input with all pokemon names and for every hit calls the function addSinglePokemonToCardDeck. If the last search input is empty, it renders the first 20 pokemon.
 * @param {string} searchInput a search input by the user
 * @returns when a new search is triggered or when the search input is empty and the first 20 pokemon have been rendered.
 */
async function search(searchInput) {

    searchResultsCount = 0;
    document.getElementById('card-deck').innerHTML = '';

    for (let i = 0; i < namesPokedex.length; i++) {

        if (newSearchTriggered) return; 
        
        else if (!searchInput && searchResultsCount == 20) {
            document.getElementById('loading-animation').classList.add('display-none');
            return;

        } else if (namesPokedex[i].includes(searchInput)) {
            await addSinglePokemonToCardDeck(i);
        }
    }
    document.getElementById('loading-animation').classList.add('display-none');
}




/**
 * Fetches the base data for a single inputted pokemon (if it does not exist locally already) and renders it in the card deck.
 * @param {number} i index of the pokemon in the pokemonNames array
 */
async function addSinglePokemonToCardDeck(i) {

    searchResultsCount++;

    let id = i + 1;

    if (i >= 1010) {
        id = '10' + `${id - 10}`.substring(1);
    }

    if (!basePokedex[i]) {
        const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
        await fetchData(i, url, basePokedex);
    }

    document.getElementById('card-deck').innerHTML += templatePokedexCard(i);
}

/**
 * Validates the search input by trimming whitespace, converting it to lowercase and removing special characters.
 * @returns the validated search input
 */
function validateSearchInput() {

    const searchInput = document.getElementById('search-input').value;
    return searchInput.trim().toLowerCase().replace(/['"`]/g, '');
}



//---------------------------------------
// fetch data
//---------------------------------------

/**
 * Fetches the base data for a range of pokemon and renders them in the card deck.
 * @param {number} first first pokemon in the range that should be fetched and rendered
 * @param {number} last last pokemon in the range that should be fetched and rendered
 */
async function loadAndRenderPokemon(first, last) {

    for (let i = first; i < last; i++) {

        let id = i + 1;

        if (i >= 1010) {
            id = '10' + `${id - 10}`.substring(1);
        }

        if (!basePokedex[i]) {
            const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
            await fetchData(i, url, basePokedex);
        }

        document.getElementById('card-deck').innerHTML += templatePokedexCard(i);
    }
}


/**
 * Fetches the names of all existing pokemon from the API and saves them to the namesPokedex array.
 * @returns when an error occurs while communication with the API
 */
async function fetchAllPokemonNames() {

    let response;
    try {
        response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');

    } catch (error) {
        document.getElementById('api-warning').classList.remove('display-none');
        return;
    }
    let responseJson = await response.json();

    for (let i = 0; i < responseJson.results.length; i++) {
        const pokemon = responseJson.results[i];

        namesPokedex.splice(i, 1, pokemon.name);
    }
}


/**
 * Fetches data from the API from an inputted endpoint and saves the this data to an inputted array.
 * @param {number} i index of the pokemon that should be fetched in the pokemonNames array
 * @param {string} url URL / endpoint of the API from where the data should be fetched
 * @param {Array} localArrayToPushTo local array to where the received data should be saved
 * @returns when an error occurs while communication with the API
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

//---------------------------------------
// utilities for rendering
//---------------------------------------

function convertToTripleDigits(i) {

    const idAsString = `${i}`;

    if (idAsString.length > 3) {
        return idAsString;
    }

    const zeros = '0'.repeat(3 - idAsString.length);
    return zeros + idAsString;
}

function capitalizeFirstCharacter(inputString) {

    let firstCharacter = inputString.charAt(0).toUpperCase();
    let newString = firstCharacter + inputString.substring(1);
    return newString;
}


//---------------------------------------
// templates
//---------------------------------------

function templatePokedexCard(i) {

    const pokemon = basePokedex[i];
    const name = pokemon.name;
    const imgUrl = returnImageUrl(pokemon);
    const basePokedexId = '#' + convertToTripleDigits(i + 1);

    return /*html*/ `
    <div onclick="showDetailView(${i})">
        <h2>
        ${capitalizeFirstCharacter(name)} <br>
        ${basePokedexId}</h2>
        <img src="${imgUrl}" alt="${name}">        
    </div>
    `;
}


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