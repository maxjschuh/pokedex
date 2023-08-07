let basePokedex = Array(1281).fill(null);
let speciesPokedex = Array(1281).fill(null);
let namesPokedex = Array(1281).fill(null);
let evolutionChains = Array(1281).fill(null);

let searchResultsCount;
let currentCardDeckSize;




//---------------------------------------
// init
//---------------------------------------

async function init() {

    await includeHTML();

    await loadAndRenderPokemon(0, 20);
    currentCardDeckSize = 20;

    await fetchAllPokemonNames();

    document.getElementById('loading-animation').classList.add('display-none');
    document.getElementById('button-show-more').classList.remove('display-none');
}


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




async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');

    for (let i = 0; i < includeElements.length; i++) {

        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);

        if (resp.ok) {
            let test = await resp.text();
            element.innerHTML = test;
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

//---------------------------------------
// search function
//---------------------------------------

let searchInputs = [];
let ongoingSearch = false;
let newSearchTriggered = false;


async function startNewSearch() {

    document.getElementById('loading-animation').classList.remove('display-none');
    document.getElementById('button-show-more').classList.add('display-none');


    const searchInput = validateSearchInput();
    searchInputs.push(searchInput);
    newSearchTriggered = true;


    if (!ongoingSearch) {
        triggerSearch();
    }
}

async function triggerSearch() {
    ongoingSearch = true;

    for (let i = 0; i < searchInputs.length; i++) {

        if (i == (searchInputs.length - 1)) {

            newSearchTriggered = false;
            const searchInput = searchInputs[i];
            await search(searchInput);

            if (!searchInput) {
                document.getElementById('button-show-more').classList.remove('display-none');
                currentCardDeckSize = 20;
            }
        }
    }
    searchInputs = [];
    ongoingSearch = false;
}


async function search(searchInput) {

    searchResultsCount = 0;

    let container = document.getElementById('card-deck');
    container.innerHTML = '';

    for (let i = 0; i < namesPokedex.length; i++) {
        const name = namesPokedex[i];

        if (newSearchTriggered) {
            return;

        } else if (!searchInput && searchResultsCount == 20) {
            document.getElementById('loading-animation').classList.add('display-none');
            return;

        } else if (name.includes(searchInput)) {

            await addSinglePokemonToCardDeck(container, i);
        }
    }
    document.getElementById('loading-animation').classList.add('display-none');
}

async function addSinglePokemonToCardDeck(container, i) {

    searchResultsCount++;

    let id = i + 1;

    if (i >= 1010) {
        id = '10' + `${id - 10}`.substring(1);
    }

    if (!basePokedex[i]) {
        const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
        await fetchData(i, url, basePokedex);
    }

    container.innerHTML += templatePokedexCard(i);

}

function validateSearchInput() {

    const searchInput = document.getElementById('search-input').value;
    return searchInput.trim().toLowerCase().replace(/['"`]/g, '');
}



//---------------------------------------
// fetch data
//---------------------------------------

async function loadAndRenderPokemon(first, last) {

    let container = document.getElementById('card-deck');

    for (let i = first; i < last; i++) {

        let id = i + 1;

        if (i >= 1010) {
            id = '10' + `${id - 10}`.substring(1);
        }

        if (!basePokedex[i]) {
            const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
            await fetchData(i, url, basePokedex);
        }

        container.innerHTML += templatePokedexCard(i);
    }
}


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

async function getPokemonSpeciesData(first, last) {

    for (let i = first; i < last; i++) {

        const url = basePokedex[i].species.url;
        await fetchData(i, url, speciesPokedex);
    }
}

async function fetchData(i, url, localJsonToPushTo) {

    let response;
    try {
        response = await fetch(url);

    } catch (error) {
        document.getElementById('api-warning').classList.remove('display-none');
        return;
    }

    let responseJson = await response.json();
    localJsonToPushTo.splice(i, 1, responseJson);
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

    let html = /*html*/ `
    <div onclick="showDetailView(${i})">
        <h2>
        ${capitalizeFirstCharacter(name)} <br>
        ${basePokedexId}</h2>
        <img src="${imgUrl}" alt="${name}">        
    </div>
    `;

    return html;
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