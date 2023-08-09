/**
 * Arrays for storing data from the API.
 */
let basePokedex = Array(1281).fill(null);
let speciesPokedex = Array(1281).fill(null);
let namesPokedex = Array(1281).fill(null);
let evolutionChains = Array(1281).fill(null);
let moveNames = [];
let moveTypes = [];


/**
 * Utility variables for functions.
 */
let searchResultsCount;
let currentCardDeckSize;
let searchInputs = [];
let ongoingSearch = false;
let newSearchTriggered = false;


/**
 * Initializes the page by loading the first 20 pokemon into the card deck.
 */
async function init() {

    await fetchAllPokemonNames();
    await loadAndRenderPokemon(0, 20);
    currentCardDeckSize = 20;

    toggleShowMoreButton(true);
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