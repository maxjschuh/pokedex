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
 * Validates the search input by trimming whitespace, converting it to lowercase and removing special characters.
 * @returns the validated search input
 */
function validateSearchInput() {

    const searchInput = document.getElementById('search-input').value;
    return searchInput.trim().toLowerCase().replace(/['"`]/g, '');
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