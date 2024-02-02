/**
 * Renders the first section in the detail view for the inputted pokemon.
 * @param {number} i index of the pokemon for which the detail view should be rendered
 * @param {object} pokemon entry in the database of the pokemon for which the detail view should be rendered
 */
async function renderDetailViewFirstSection(i, pokemon) {

    const url = basePokedex[i].species.url;
    await fetchData(i, url, speciesPokedex);

    renderAboutSection(i, pokemon);
    renderGenders(i);
    renderHeldItem(i);
    document.getElementById('detail-view-types').innerHTML = templateAllTypes(i);
    unlockSection('section-about', 'loading-animation-1');
}


/**
 * Renders the about section in the detail view for an inputted pokemon.
 * @param {number} i index of the pokemon whose data should be rendered
 * @param {object} pokemon entry in the database of the pokemon which should be rendered
 */
function renderAboutSection(i, pokemon) {

    document.getElementById('section-about').innerHTML = /*html*/ `

        <p id="flavor-text">${getEnglishFlavorText(i)}</p>

        <div class="detail-view-table-row">

            <div>
                <p>Height&nbsp;</p>${pokemon.height}
            </div>

            <div id="detail-view-held-item">
            </div>

        </div>

        <div class="detail-view-table-row">
    
            <div>
                <p>Weight&nbsp;</p>${pokemon.weight}
            </div>

            <div id="detail-view-genders">
            </div>

        </div>

        <div class="detail-view-separator"></div>

        <div id="detail-view-types"></div>
    `;
}


/**
 * Searches the english flavor text for the inputted pokemon in the database and returns it.
 * @param {number} i index of the pokemon whose flavor text should be returned
 * @returns {string} english flavor text
 */
function getEnglishFlavorText(i) {

    const pokemon = speciesPokedex[i];

    for (let i = 0; i < pokemon.flavor_text_entries.length; i++) {
        const entry = pokemon.flavor_text_entries[i];

        if (entry.language.name == 'en') {

            return entry.flavor_text;
        }
    }
}


/**
 * Renders the held item for the inputted pokemon
 * @param {number} i index of the pokemon whose held item should be rendered
 */
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


/**
 * Renders the possible genders in the detail view.
 * @param {number} i index of the pokemon whose genders should be rendered
 */
function renderGenders(i) {

    let container = document.getElementById('detail-view-genders');
    container.innerHTML = returnGendersTemplate(i);
}


/**
 * Returns the correct icon template for the gender rate of the inputted pokemon (0 == only males, 8 == only females, number between 0 and 8 == females and males, -1 == genderless )
 * @param {number} i index of the pokemon whose genders should be rendered
 * @returns {string} gender icon template for the inputted pokemon
 */
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


/**
 * HTML Template for the female and male gender icons.
 * @returns {string} HTML Template for the female and male gender icons.
 */
function templateBothGenders() {

    return /*html*/ `
        <p>Genders&nbsp;</p>
        <img src="./img/male.svg" alt="icon male">
        <img src="./img/female.svg" alt="icon female">
    `;
}


/**
 * HTML Template for only the female gender icon.
 * @returns {string} HTML Template for only the female gender icon
 */
function templateFemaleGender() {

    return /*html*/ `
        <p>Genders&nbsp;</p>
        <img src="./img/female.svg" alt="icon female">
    `;
}


/**
 * HTML Template for only the male gender icon.
 * @returns {string} HTML Template for only the male gender icon
 */
function templateMaleGender() {

    return /*html*/ `
        <p>Genders&nbsp;</p>
        <img src="./img/male.svg" alt="icon male">
    `;
}


/**
 * HTML Template for the genderless icon.
 * @returns {string} HTML Template for the genderless icon
 */
function templateGenderless() {

    return /*html*/ `
        <p>Genders&nbsp;</p>
        <img src="./img/genderless.svg" alt="icon male">
    `;
}


/**
 * Puts the template for all types of the pokemon together and returns it.
 * @param {number} i index of the pokemon whose types should be rendered
 * @returns {string} HTML template for all types of the pokemon
 */
function templateAllTypes(i) {

    let html = '';
    const types = basePokedex[i].types;

    for (let j = 0; j < types.length; j++) {

        const type = types[j].type.name;

        html += templateType(type);
    }

    return html;
}


/**
 * Returns HTML Template for a type bubble for the inputted type.
 * @param {string} type type name
 * @returns {string} HTML Template for a type bubble for the inputted type
 */
function templateType(type) {

    let html = /*html*/ `
    <div class="detail-view-type-icon background-type-${type}">
        <img src="./img/types/type_${type}.svg" alt="icon type ${type}">
        ${capitalizeFirstCharacter(type)}
    </div> `;

    return html;
}