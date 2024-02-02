/**
 * Renders the fourth section in the detail view for the inputted pokemon.
 * @param {number} i index of the pokemon for which the detail view should be rendered
 */
async function renderDetailViewFourthSection(i) {

    await evolutionTree(i);
    setBorderOfActiveTreeCard(i);
    unlockSection('section-evolutions', 'loading-animation-3');
}


/**
 * Fetches the data of all pokemon in the evolution tree of a inputted pokemon. Renders the evolution tree for the inputted pokemon.
 * @param {number} i index of the pokemon whose evolution tree should be rendered
 */
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


/**
 * Fetches the evolution chain from the API for the inputted pokemon.
 * @param {number} i index of the pokemon whose evolution chain should be fetched
 */
async function getEvolutionChainData(i) {

    if (!evolutionChains[i]) {

        let url = speciesPokedex[i].evolution_chain.url;

        let response = await fetch(url);
        response = await response.json();

        evolutionChains.splice(i, 1, response);
    }
}


/**
 * Renders the evolution tree with up to two branches (not counting the first evolution) for the inputted pokemon.
 * @param {number} basePokemonIndex index of the pokemon whose evolution tree should be rendered
 */
async function generateEvolutionTree(basePokemonIndex) {

    let firstStageEvolutions = evolutionChains[basePokemonIndex].chain.evolves_to;

    let treeFirstBranch = document.getElementById('evolution-tree-first-branch');
    let treeSecondBranch = document.getElementById('evolution-tree-second-branch');
    treeFirstBranch.innerHTML = '';
    treeSecondBranch.innerHTML = '';

    for (let i = 0; i < firstStageEvolutions.length; i++) {

        await generateEvolutionTreeBranch(treeFirstBranch, firstStageEvolutions[i].species.name)

        const secondStageEvolutions = firstStageEvolutions[i].evolves_to;

        for (let j = 0; j < secondStageEvolutions.length; j++) {

            await generateEvolutionTreeBranch(treeSecondBranch, secondStageEvolutions[j].species.name)
        }
    }
}


/**
 * Renders a single branch in the evolution tree with an inputted pokemon
 * @param {object} branchContainer html object of the container where the branch should be rendered
 * @param {string} pokemonName pokemon that should be rendered in this branch
 */
async function generateEvolutionTreeBranch(branchContainer, pokemonName) {

    const index = await fetchSinglePokemonReturnIndex(pokemonName);

    branchContainer.innerHTML += templateEvolutionTreeCard(index);
}


/**
 * Fetches a single pokemons base and species data from the API and returns its database index.
 * @param {string} name name of the pokemon
 * @returns {number} index of the pokemon
 */
async function fetchSinglePokemonReturnIndex(name) {

    let index = namesPokedex.indexOf(name);

    if (!basePokedex[index]) {

        let url = `https://pokeapi.co/api/v2/pokemon/${name}`;
        let response = await fetch(url);
        response = await response.json();
        basePokedex.splice(index, 1, response);
    }

    if (!speciesPokedex[index]) {
        
        url = basePokedex[index].species.url;
        await fetchData(index, url, speciesPokedex);        
    }

    return index;
}



/**
 * Returns HTML template of the evolution tree card for the inputted pokemon
 * @param {number} i index of the pokemon which should be rendered in the tree card
 * @returns {string} HTML template of the evolution tree card for the inputted pokemon
 */
function templateEvolutionTreeCard(i) {

    const pokemon = basePokedex[i];
    const name = pokemon.name;
    const imgUrl = returnImageUrl(pokemon);

    return /*html*/ `
    <div id="tree-card-${i}" class="evolution-tree-card" onclick="renderDetailView(${i})">
    <img src="${imgUrl}" alt="${name}">
    ${capitalizeFirstCharacter(name)}
    ${templateAllTypes(i)}

    </div> `;
}


/**
 * Sets the border of the evolution tree card of the pokemon which is currently shown in the detail view to the type color.
 * @param {number} i index of the pokemon whose evolution tree card should be set as active
 * @returns {void} when the evolution tree card no longer exists, e.g. when the user switched to a different pokemon in the mean time
 */
function setBorderOfActiveTreeCard(i) {

    try {
        const id = `tree-card-${i}`;
        const borderClass = `border-type-${basePokedex[i].types[0].type.name}`;
        document.getElementById(id).classList.add(borderClass);

    } catch (error) {
        return;
    }
}