/**
 * Shows and renders or hides the detail view based on the inputted paramters.
 * @param {boolean} show true, when the detail view should be shown
 * @param {number} i index of the pokemon for which the detail view should be rendered
 */
async function toggleDetailView(show, i) {
    
    document.getElementById('detail-view').classList.toggle('display-none', !show);
    document.getElementById('main').classList.toggle('detail-view-opened', show);

    if (show) {
        await renderDetailView(i);
    }
}


/**
 * Calls functions for rendering the detail view for the inputted pokemon.
 * @param {number} i index of the pokemon for which the detail view should be rendered
 */
async function renderDetailView(i) {

    const pokemon = basePokedex[i];

    renderTopImage(pokemon);
    renderPokemonName(i, pokemon);

    await renderDetailViewFirstSection(i, pokemon);
    renderDetailViewSecondSection(i);
    await renderDetailViewThirdSection(i);
    await renderDetailViewFourthSection(i);
}


/**
 * Renders the top image in the detail view for the inputted pokemon.
 * @param {object} pokemon entry in the database of the pokemon whose image should be rendered in the detail view
 */
function renderTopImage(pokemon) {

    const imgUrl = returnImageUrl(pokemon);
    document.getElementById('detail-view-top-image').src = `${imgUrl}`;
}


/**
 * Renders the name and id at the top of the detail view for the inputted pokemon.
 * @param {number} i index of the pokemon which should be rendered
 * @param {*} pokemon entry in the database of the pokemon which should be rendered
 */
function renderPokemonName(i, pokemon) {

    const name = pokemon['forms'][0]['name'];
    const basePokedexId = '#' + convertToTripleDigits(i + 1);


    let container = document.getElementById('detail-view-pokemon-name');

    container.innerHTML = `
    ${capitalizeFirstCharacter(name)} ${basePokedexId}`;
}


/**
 * Removes the loading animation from the inputted section and reveals the rendered contents.
 * @param {string} sectionToUnlock html id of the section whose contents should be revealed
 * @param {string} loadingAnimationToHide html id of the loading animation which should be hidden
 */
function unlockSection(sectionToUnlock, loadingAnimationToHide) {

    document.getElementById(sectionToUnlock).classList.remove('display-none');
    document.getElementById(loadingAnimationToHide).classList.add('display-none');
}