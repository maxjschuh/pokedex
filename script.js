let pokedexBase = [];
let pokedexSpecies = [];

//---------------------------------------
// init
//---------------------------------------

async function init() {

    await fetchData(1, 21);
    await fetchDataPokemonSpecies(1, 21);
    render();
    renderDetailView(1);
}

async function loadMore() {

    await fetchData(21, 41);
    await fetchDataPokemonSpecies(21, 41);
    render();
}

//---------------------------------------
//test area
//---------------------------------------

// str = str.replace(/[\u00A0\u1680​\u180e\u2000-\u2009\u200a​\u200b​\u202f\u205f​\u3000]/g,'');


async function init2() {

    await fetchData(1, 21);
    await fetchDataPokemonSpecies(1, 21);
    renderDetailView(1);
}

function renderDetailView(i) {
    let container = document.getElementById('detail-view');

    container.innerHTML = templateDetailView(i);
}

function templateDetailView(i) {

    const pokemon = pokedexBase[i];

    const name = pokemon['forms'][0]['name'];
    const imgUrl = pokemon['sprites']['other']['home']['front_default'];
    const pokedexBaseId = '#' + convertToTripleDigits(i);
    const flavorText = pokedexSpecies[i]['flavor_text_entries'][0]['flavor_text'];

    let html = /*html*/ `

        <h2>${name} ${pokedexBaseId}</h2>
        <img src="${imgUrl}" alt="${name}">

        <div>
        <h3>About</h3>
        <p>${flavorText}</p>
        </div>

        <div>
            <h3>Status</h3>
        </div>

        <div>
            <h3>Moves</h3>
        </div>

        <div>
            <h3>Evolutions</h3>
        </div>
    `;

    return html;
}


//---------------------------------------
// fetch data
//---------------------------------------
async function fetchData(start, end) {

    for (let i = start; i < end; i++) {

        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;

        let response = await fetch(url);
        let responseJson = await response.json();

        pokedexBase.push(responseJson);
    }
}

async function fetchDataPokemonSpecies(start, end) {

    for (let i = start; i < end; i++) {

        const url = `https://pokeapi.co/api/v2/pokemon-species/${i}`;

        let response = await fetch(url);
        let responseJson = await response.json();

        pokedexSpecies.push(responseJson);
    }
}

//---------------------------------------
//render cards
//---------------------------------------
function render() {

    let container = document.getElementById('main');
    container.innerHTML = '';

    for (let i = 0; i < pokedexBase.length; i++) {

        container.innerHTML += templatepokedexBaseCard(i);
    }
}

function templatepokedexBaseCard(i) {

    const pokemon = pokedexBase[i];

    const name = pokemon['forms'][0]['name'];
    const imgUrl = pokemon['sprites']['other']['home']['front_default'];
    const pokedexBaseId = '#' + convertToTripleDigits(i);

    let html = /*html*/ `
    <div onclick="renderDetailView(${i})">
        <h2>
        ${name} <br>
        ${pokedexBaseId}</h2>
        <img src="${imgUrl}" alt="${name}">
    </div>
    `;

    return html;
}



function convertToTripleDigits(i) {

    const idAsString = `${i}`;
    const zeros = '0'.repeat(3 - idAsString.length);
    return zeros + idAsString;
}


