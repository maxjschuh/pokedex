/**
 * Called when the user clicks on a pokemon card. Shows the detail view and renders it for the inputted pokemon. Resizes the card deck by adding the detail-view-opened class to its classlist.
 * @param {*} i 
 */
async function showDetailView(i) {
    document.getElementById('detail-view').classList.remove('display-none');
    document.getElementById('main').classList.add('detail-view-opened');

    await renderDetailView(i);
}


/**
 * Hides the detail view and resizes the card deck to full window width by removing the detail-view-opened class from its classlist.
 */
function hideDetailView() {
    document.getElementById('detail-view').classList.add('display-none');
    document.getElementById('main').classList.remove('detail-view-opened');
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