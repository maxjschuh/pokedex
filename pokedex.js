let basePokedex = Array(1281).fill(null);
let speciesPokedex = Array(1281).fill(null);
let namesPokedex = Array(1281).fill(null);
let evolutionChains = Array(530).fill(null);


//---------------------------------------
// init
//---------------------------------------

async function init() {

    await fetchData(1, 21);
    await fetchDataPokemonSpecies(1, 21);
    render();
    renderDetailView(1);
}

async function init2() {

    await fetchData(1, 41);
    await fetchDataPokemonSpecies(1, 41);
    renderDetailView(0);
    renderGenders(0);
    renderHeldItem(0);
    renderTypes(0);
    await createMovesArrays();
    await renderFirst4Moves(13);
}

async function init4() {
    await loadAndRenderPokemon(0, 20);
    document.getElementById('loading-animation').classList.add('display-none');
}

async function loadMore() {

    await fetchData(21, 41);
    await fetchDataPokemonSpecies(21, 41);
    render();
}

//---------------------------------------
// fetch data
//---------------------------------------

async function fetchData(i, url, localJsonToPushTo) {

    let response = await fetch(url);
    let responseJson = await response.json();

    localJsonToPushTo.splice(i, 1, responseJson);
}


async function fetchDataPokemonSpecies(start, end) {

    for (let i = start; i < end; i++) {

        const url = `https://pokeapi.co/api/v2/pokemon-species/${i}`;

        let response = await fetch(url);
        let responseJson = await response.json();

        speciesPokedex.push(responseJson);
    }
}

async function loadAndRenderPokemon(first, last) {

    let container = document.getElementById('card-deck');
    container.innerHTML = '';

    for (let i = first; i < last; i++) {

        let url = `https://pokeapi.co/api/v2/pokemon/${i + 1}`;
        await fetchData(i, url, basePokedex);

        container.innerHTML += templatebasePokedexCard(i);

        url = basePokedex[i].species.url;
        await fetchData(i, url, speciesPokedex);
        namesPokedex.splice(i, 1, basePokedex[i].name);
    }
}


//---------------------------------------
// utilities for rendering
//---------------------------------------

function convertToTripleDigits(i) {

    const idAsString = `${i}`;
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

function templatebasePokedexCard(i) {

    const pokemon = basePokedex[i];

    const name = pokemon.name;
    const imgUrl = pokemon.sprites.other.home.front_default;

    const basePokedexId = '#' + convertToTripleDigits(i + 1);

    let html = /*html*/ `
    <div onclick="renderDetailView(${i})">
        <h2>
        ${capitalizeFirstCharacter(name)} <br>
        ${basePokedexId}</h2>
        <img src="${imgUrl}" alt="${name}">

        
    </div>
    `;

    return html;
}