//---------------------------------------
// init
//---------------------------------------

async function renderDetailView(i) {

    const pokemon = basePokedex[i];

    renderTopImage(pokemon);
    renderPokemonName(i, pokemon);

    await renderDetailViewFirstSection(i, pokemon);
    renderDetailViewSecondSection(i);
    await renderDetailViewThirdSection(i);
    await renderDetailViewFourthSection(i);
}

async function renderDetailViewFirstSection(i, pokemon) {

    const url = basePokedex[i].species.url;
    await fetchData(i, url, speciesPokedex);

    renderAboutSection(i, pokemon);
    renderGenders(i);
    renderHeldItem(i);
    document.getElementById('detail-view-types').innerHTML = templateAllTypes(i);
    unlockSection('section-about', 'loading-animation-1');
}

async function renderDetailViewThirdSection(i) {

    await createMovesArrays();
    await renderFirst4Moves(i);
    unlockSection('section-moves', 'loading-animation-2');
}

async function renderDetailViewFourthSection(i) {

    await evolutionTree(i);
    setBorderOfActiveTreeCard(i);
    unlockSection('section-evolutions', 'loading-animation-3');
}




async function showDetailView(i) {
    document.getElementById('detail-view').classList.remove('display-none');
    document.getElementById('main').classList.add('detail-view-opened');

    await renderDetailView(i);
}

function hideDetailView() {
    document.getElementById('detail-view').classList.add('display-none');
    document.getElementById('main').classList.remove('detail-view-opened');
}

function unlockSection(sectionToUnlock, loadingAnimationToHide) {

    document.getElementById(sectionToUnlock).classList.remove('display-none');
    document.getElementById(loadingAnimationToHide).classList.add('display-none');
}


function renderTopImage(pokemon) {

    const imgUrl = returnImageUrl(pokemon);
    document.getElementById('detail-view-top-image').src = `${imgUrl}`;
}

function renderPokemonName(i, pokemon) {

    const name = pokemon['forms'][0]['name'];
    const basePokedexId = '#' + convertToTripleDigits(i + 1);


    let container = document.getElementById('detail-view-pokemon-name');

    container.innerHTML = `
    ${capitalizeFirstCharacter(name)} ${basePokedexId}`;
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

    const genderRate = speciesPokedex[i]['gender_rate'];

    if (genderRate > 0 && genderRate < 8) {

        return templateBothGenders();

    } else if (genderRate == 8) {

        return templateFemaleGender();

    } else if (genderRate == 0) {

        return templateMaleGender();

    } else {

        return templateGenderless();
    }
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



function calculateStatsBarWidth(i, statType, maxStat) {

    return basePokedex[i].stats[statType].base_stat / maxStat * 100;
}


//---------------------------------------
// detail view - moves
//---------------------------------------


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

        const id = `detail-view-move-${j}`;
        let container = document.getElementById(id);

        if (pokemon.moves[j]) {
            const move = pokemon.moves[j].move;
            container.innerHTML = await templateMove(move.name, move.url);

        } else {
            container.innerHTML = 'No data';
        }
    }
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

    try {
        const id = `tree-card-${i}`;
        const borderClass = `border-type-${basePokedex[i].types[0].type.name}`;
        document.getElementById(id).classList.add(borderClass);

    } catch (error) {
        return;
    }
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

        generateEvolutionTreeBranch(treeFirstBranch, firstStageEvolutions[i].species.name)

        const secondStageEvolutions = firstStageEvolutions[i].evolves_to;

        for (let j = 0; j < secondStageEvolutions.length; j++) {

            generateEvolutionTreeBranch(treeSecondBranch, secondStageEvolutions[j].species.name)
        }
    }
}

async function generateEvolutionTreeBranch(branchContainer, pokemonName) {

    const index = await fetchSinglePokemonReturnIndex(pokemonName);

    branchContainer.innerHTML += templateEvolutionTreeCard(index);
}


async function fetchSinglePokemonReturnIndex(name) {

    let index = namesPokedex.indexOf(name);

    if (!basePokedex[index]) {

        let url = `https://pokeapi.co/api/v2/pokemon/${name}`;
        let response = await fetch(url);
        response = await response.json();
        basePokedex.splice(index, 1, response);

        url = basePokedex[index].species.url;
        response = await fetch(url);
        response = await response.json();
        speciesPokedex.splice(index, 1, response);
    }
    return index;
}

