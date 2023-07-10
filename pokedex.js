let basePokedex = Array(1281).fill(null);
let speciesPokedex = Array(1281).fill(null);
let namesPokedex = Array(1281).fill(null);
let evolutionChains = Array(530).fill(null);


//---------------------------------------
// init
//---------------------------------------

async function init() {
    await loadAndRenderPokemon(0, 20);

    document.getElementById('loading-animation').classList.add('display-none');

    await includeHTML();

    // await renderDetailView(1);
}

// async function loadMore() {

//     await fetchData(21, 41);
//     await fetchDataPokemonSpecies(21, 41);
//     render();
// }



async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');

    for (let i = 0; i < includeElements.length; i++) {

        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);

        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}



//---------------------------------------
// fetch data
//---------------------------------------

async function loadAndRenderPokemon(first, last) {

    let container = document.getElementById('card-deck');
    container.innerHTML = '';

    for (let i = first; i < last; i++) {

        const url = `https://pokeapi.co/api/v2/pokemon/${i + 1}`;
        await fetchData(i, url, basePokedex);

        container.innerHTML += templatebasePokedexCard(i);

        namesPokedex.splice(i, 1, basePokedex[i].name);
    }
}

async function getPokemonSpeciesData(first, last) {

    for (let i = first; i < last; i++) {

        const url = basePokedex[i].species.url;
        await fetchData(i, url, speciesPokedex);
    }
}

async function fetchData(i, url, localJsonToPushTo) {

    let response = await fetch(url);
    let responseJson = await response.json();

    localJsonToPushTo.splice(i, 1, responseJson);
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