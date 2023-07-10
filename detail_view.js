//---------------------------------------
// init
//---------------------------------------

async function initDetailView() {
    const first = 0;
    const last = 25;

    for (let i = first; i < last; i++) {

        await fetchData(i, `https://pokeapi.co/api/v2/pokemon/${i + 1}`, basePokedex);
        await fetchData(i, `https://pokeapi.co/api/v2/pokemon-species/${i + 1}`, speciesPokedex);
    }

    renderDetailView(24);       
}

async function renderDetailView(i) {
    let container = document.getElementById('detail-view');

    container.innerHTML = templateDetailView(i);

    renderGenders(i);
    renderHeldItem(i);
    renderTypes(i);
    await createMovesArrays();
    await renderFirst4Moves(i);

    await evolutionTree(i);
    setBorderOfActiveTreeCard(i); 
}


//---------------------------------------
// detail view
//---------------------------------------

function templateDetailView(i) {

    const pokemon = basePokedex[i];

    const name = pokemon['forms'][0]['name'];
    const imgUrl = pokemon['sprites']['other']['home']['front_default'];
    const basePokedexId = '#' + convertToTripleDigits(i + 1);
    const flavorText = getEnglishFlavorText(i);

    let html = /*html*/ `

        <h2>${capitalizeFirstCharacter(name)} ${basePokedexId}</h2>
        <img src="${imgUrl}" alt="${name}">

        <div class="detail-view-section">
        <h3>About</h3>
        <p>${flavorText}</p>

        ${renderTypes(i)}
        </div>

        <div class="detail-view-section">
            <h3>Stats</h3>
            ${templateStats(i)}
        </div>

        <div class="detail-view-section">
            <h3>Moves</h3>
        </div>

        <div id="evolutions" class="detail-view-section">
            <h3>Evolutions</h3>
            <div id="evolution-tree-root"></div>
            <div id="evolution-tree-first-branch"></div>
            <div id="evolution-tree-second-branch"></div>

        </div>
    `;

    return html;
}


//---------------------------------------
// detail view - about
//---------------------------------------

function getEnglishFlavorText(i) {

    const pokemon = speciesPokedex[i];

    for (let i = 0; i < pokemon.flavor_text_entries.length; i++) {
        const entry = pokemon.flavor_text_entries[i];

        if (entry.language.name == 'en') {

            return entry.flavor_text;
        }
    }
}


//---------------------------------------
// detail view - about - genders
//---------------------------------------

function renderGenders(i) {

    let container = document.getElementById('detail-view-genders');
    container.innerHTML = returnGendersTemplate(i);
}


function returnGendersTemplate(i) {

    const genders = speciesPokedex[i]['gender_rate'];
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
// detail view - about - held item
//---------------------------------------

function renderHeldItem(i) {

    let container = document.getElementById('detail-view-held-item');

    let item = '';

    try {
        item = basePokedex[i].held_items[0].item.name;
    }

    catch (error) {
        item = 'none';
    }

    container.innerHTML = /*html*/ `
    <p>Held item&nbsp;</p>
    ${item} `;
}

//---------------------------------------
// detail view - about - types
//---------------------------------------

function renderTypes(i) {

    let html = '';

    const types = basePokedex[i].types;

    for (let j = 0; j < types.length; j++) {

        const type = types[j].type.name;

        html += templateType(type);
    }
    return html;

}

function templateType(type) {

    let html = /*html*/ `
    <div class="detail-view-type-icon background-type-${type}">
        <img src="./img/types/type_${type}.svg" alt="icon type ${type}">
        ${capitalizeFirstCharacter(type)}
    </div> `;

    return html;
}


// ---------------------------------------
// detail view - stats
// ---------------------------------------

function templateStats(i) {

    const type = basePokedex[i].types[0].type.name;

    let html = /*html*/ `
    
        <div class="detail-view-stats-row">
            <p>HP</p>
            <div class="stats-bar"></div>
            <div class="stats-bar background-type-${type}" style="width:calc(${calculateStatsBarWidth(i, 0, 255)}% - 56px)"></div>        
        </div>

        <div class="detail-view-stats-row">
            <p>ATK</p>
            <div class="stats-bar"></div>
            <div class="stats-bar background-type-${type}" style="width:calc(${calculateStatsBarWidth(i, 1, 181)}% - 56px)"></div>        
        </div>

        <div class="detail-view-stats-row">
            <p>DEF</p>
            <div class="stats-bar"></div>
            <div class="stats-bar background-type-${type}" style="width:calc(${calculateStatsBarWidth(i, 2, 230)}% - 56px)"></div>        
        </div>

        <div class="detail-view-stats-row">
            <p>SATK</p>
            <div class="stats-bar"></div>
            <div class="stats-bar background-type-${type}" style="width:calc(${calculateStatsBarWidth(i, 3, 180)}% - 56px)"></div>        
        </div>

        <div class="detail-view-stats-row">
            <p>SDEF</p>
            <div class="stats-bar"></div>
            <div class="stats-bar background-type-${type}" style="width:calc(${calculateStatsBarWidth(i, 4, 230)}% - 56px)"></div>        
        </div>

        <div class="detail-view-stats-row">
            <p>SPD</p>
            <div class="stats-bar"></div>
            <div class="stats-bar background-type-${type}" style="width:calc(${calculateStatsBarWidth(i, 5, 200)}% - 56px)"></div>
        </div>`;

    return html;
}

function calculateStatsBarWidth(i, statType, maxStat) {

    return basePokedex[i].stats[statType].base_stat / maxStat * 100;
}


//---------------------------------------
// detail view - moves
//---------------------------------------
let moveNames = [];
let moveTypes = [];

async function createMovesArrays() {

    let response = await fetch('https://pokeapi.co/api/v2/move?limit=10000');
    response = await response.json();

    for (let i = 0; i < response.results.length; i++) {
        const moveName = response.results[i].name;

        moveNames.push(moveName);
    }

    moveTypes = Array(moveNames.length).fill(null);
}

async function renderFirst4Moves(i) {
    const pokemon = basePokedex[i];

    for (let j = 0; j < 4; j++) {
        const move = pokemon.moves[j].move;

        const id = `detail-view-move-${j}`;
        let container = document.getElementById(id);

        container.innerHTML = await templateMove(move.name, move.url);
    }
}

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

async function fetchMoveType(index, url) {

    let moveData = await fetch(url);
    moveData = await moveData.json();

    moveTypes.splice(index, 1, moveData.type.name);
}


// ---------------------------------------
// detail view - evolutions
// ---------------------------------------

async function evolutionTree(i) {

    if (speciesPokedex[i].evolves_from_species) {

        const j = await fetchSinglePokemonReturnIndex(speciesPokedex[i].evolves_from_species.name);
        await evolutionTree(j);

        
    } else {

        let container = document.getElementById('evolution-tree-root');
        container.innerHTML = templateEvolutionTreeCard(i);

        await getEvolutionChainData(i);
        await generateEvolutionTree(i);
    }
}

function setBorderOfActiveTreeCard(i) {

    const id = `tree-card-${i}`;
    const borderClass = `border-type-${basePokedex[i].types[0].type.name}`;
    document.getElementById(id).classList.add(borderClass);
}

async function getEvolutionChainData(i) {

    if (!evolutionChains[i]) {

        let url = speciesPokedex[i].evolution_chain.url;

        let response = await fetch(url);
        response = await response.json();

        evolutionChains.splice(i, 1, response);
    }
}

async function generateEvolutionTree(basePokemonIndex) {

    let firstStageEvolutions = evolutionChains[basePokemonIndex].chain.evolves_to;

    let treeFirstBranch = document.getElementById('evolution-tree-first-branch');
    let treeSecondBranch = document.getElementById('evolution-tree-second-branch');
    treeFirstBranch.innerHTML = '';
    treeSecondBranch.innerHTML = '';


    for (let i = 0; i < firstStageEvolutions.length; i++) {

        const firstStageEvolution = firstStageEvolutions[i];
        const secondStageEvolutions = firstStageEvolution.evolves_to;

        const firstStageEvolutionIndex = await fetchSinglePokemonReturnIndex(firstStageEvolution.species.name);

        treeFirstBranch.innerHTML += templateEvolutionTreeCard(firstStageEvolutionIndex);

        for (let j = 0; j < secondStageEvolutions.length; j++) {

            const secondStageEvolution = secondStageEvolutions[j];

            const index = await fetchSinglePokemonReturnIndex(secondStageEvolution.species.name);

            treeSecondBranch.innerHTML += templateEvolutionTreeCard(index);
        }
    }
}


async function fetchSinglePokemonReturnIndex(name) {

    let index = namesPokedex.indexOf(name);

    if (index == -1) {

        let url = `https://pokeapi.co/api/v2/pokemon/${name}`;
        let response = await fetch(url);
        response = await response.json();

        index = response.id - 1;

        basePokedex.splice(index, 1, response);

        url = basePokedex[index].species.url;

        response = await fetch(url);
        response = await response.json();
        speciesPokedex.splice(index, 1, response);

        namesPokedex.splice(index, 1, basePokedex[index].name);
    }
    return index;
}

function templateEvolutionTreeCard(i) {

    const name = basePokedex[i].name;

    const imgUrl = basePokedex[i].sprites.other.home.front_default;

    let html = /*html*/ `
    <div id="tree-card-${i}" class="evolution-tree-card" onclick="renderDetailView(${i})">
    <img src="${imgUrl}" alt="${name}">
    ${capitalizeFirstCharacter(name)}
    ${renderTypes(i)}

    </div> `;

    return html;
}










// ---------------------------------------
// detail view - using local storage (wird noch nicht gecallt)
// ---------------------------------------

function getLocalData() {

    const evolutionChainsAsText = localStorage.getItem('evolutionChains');

    if (evolutionChainsAsText) {

        evolutionChains = JSON.parse(evolutionChainsAsText);
    }
}

function setLocalData() {

    const evolutionChainsAsText = JSON.stringify(evolutionChains);
    localStorage.setItem('evolutionChains', evolutionChainsAsText);
}