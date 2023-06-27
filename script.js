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

async function init2() {

    await fetchData(1, 41);
    await fetchDataPokemonSpecies(1, 41);
    renderDetailView(0);
    renderGenders(0);
    renderHeldItem(0);
    renderTypes(0);
}

function renderDetailView(i) {
    let container = document.getElementById('detail-view');

    container.innerHTML = templateDetailView(i);
}

function getEnglishFlavorText(i) {

    const pokemon = pokedexSpecies[i];

    for (let i = 0; i < pokemon.flavor_text_entries.length; i++) {
        const entry = pokemon.flavor_text_entries[i];

        if (entry.language.name == 'en') {

            return entry.flavor_text;
        }
    }
}

function templateDetailView(i) {

    const pokemon = pokedexBase[i];

    const name = pokemon['forms'][0]['name'];
    const imgUrl = pokemon['sprites']['other']['home']['front_default'];
    const pokedexBaseId = '#' + convertToTripleDigits(i);
    const flavorText = getEnglishFlavorText(i);

    let html = /*html*/ `

        <h2>${name} ${pokedexBaseId}</h2>
        <img src="${imgUrl}" alt="${name}">

        <div class="detail-view-section">
        <h3>About</h3>
        <p>${flavorText}</p>
        </div>

        <div class="detail-view-section">
            <h3>Stats</h3>
            ${templateStats(i)}
        </div>

        <div class="detail-view-section">
            <h3>Moves</h3>
        </div>

        <div class="detail-view-section">
            <h3>Evolutions</h3>
        </div>
    `;

    return html;
}

function templateStats(i) {

    let html = /*html*/ `
    
        <div class="detail-view-stats-row">
            <p>HP</p>
            <div class="stats-bar"></div>
            <div class="stats-bar background-type-grass" style="width:calc(${calculateStatsBarWidth(i, 0, 255)}% - 56px)"></div>        
        </div>

        <div class="detail-view-stats-row">
            <p>ATK</p>
            <div class="stats-bar"></div>
            <div class="stats-bar background-type-grass" style="width:calc(${calculateStatsBarWidth(i, 1, 181)}% - 56px)"></div>        
        </div>

        <div class="detail-view-stats-row">
            <p>DEF</p>
            <div class="stats-bar"></div>
            <div class="stats-bar background-type-grass" style="width:calc(${calculateStatsBarWidth(i, 2, 230)}% - 56px)"></div>        
        </div>

        <div class="detail-view-stats-row">
            <p>SATK</p>
            <div class="stats-bar"></div>
            <div class="stats-bar background-type-grass" style="width:calc(${calculateStatsBarWidth(i, 3, 180)}% - 56px)"></div>        
        </div>

        <div class="detail-view-stats-row">
            <p>SDEF</p>
            <div class="stats-bar"></div>
            <div class="stats-bar background-type-grass" style="width:calc(${calculateStatsBarWidth(i, 4, 230)}% - 56px)"></div>        
        </div>

        <div class="detail-view-stats-row">
            <p>SPD</p>
            <div class="stats-bar"></div>
            <div class="stats-bar background-type-grass" style="width:calc(${calculateStatsBarWidth(i, 5, 200)}% - 56px)"></div>
        </div>`;

    return html;
}

function calculateStatsBarWidth(i, statType, maxStat) {

    return pokedexBase[i].stats[statType].base_stat / maxStat * 100;
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
    const pokedexBaseId = '#' + convertToTripleDigits(i + 1);

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


//---------------------------------------
// detail view - about - genders
//---------------------------------------

function renderGenders(i) {

    let container = document.getElementById('detail-view-genders');
    container.innerHTML = returnGendersTemplate(i);
}


function returnGendersTemplate(i) {

    const genders = pokedexSpecies[i]['gender_rate'];
    let html = '';

    if (genders > 0 && genders < 8) {

        html = templateBothGenders();

    } else if (genders == 8) {

        html = templateFemaleGender();

    } else if (genders == 0) {

        html = templateMaleGender();

    } else {

        html = templateGenderless();
    }

    return html;
}

function templateBothGenders() {

    return /*html*/ `
        <p>Genders&nbsp;</p>
        <img src="./img/male.svg" alt="icon male">
        <img src="./img/female.svg" alt="icon female">
    `;
}

function templateFemaleGender() {

    return /*html*/ `
        <p>Genders&nbsp;</p>
        <img src="./img/female.svg" alt="icon female">
    `;
}

function templateMaleGender() {

    return /*html*/ `
        <p>Genders&nbsp;</p>
        <img src="./img/male.svg" alt="icon male">
    `;
}

function templateGenderless() {

    return /*html*/ `
        <p>Genders&nbsp;</p>
        <img src="./img/genderless.svg" alt="icon male">
    `;
}


//---------------------------------------
// detail view - about - type
//---------------------------------------

function renderHeldItem(i) {

    let container = document.getElementById('detail-view-held-item');

    let item = '';

    try {
        item = pokedexBase[i].held_items[0].item.name;
    }

    catch (error) {
        item = 'none';
    }

    container.innerHTML = /*html*/ `
    <p>Held item&nbsp;</p>
    ${item} `;
}

//---------------------------------------
// detail view - about - type
//---------------------------------------

function renderTypes(i) {

    let container = document.getElementById('detail-view-types');
    container.innerHTML = '';

    const types = pokedexBase[i].types;

    for (let j = 0; j < types.length; j++) {

        const type = types[j].type.name;

        container.innerHTML += templateType(type);
    }

}

function templateType(type) {

    let html = /*html*/ `
    <div class="background-type-${type}">
        <img src="./img/types/type_${type}.svg" alt="icon type ${type}">
        ${type}
    </div> `;

    return html;
}