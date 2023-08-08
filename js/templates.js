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


function templateAllTypes(i) {

    let html = '';
    const types = basePokedex[i].types;

    for (let j = 0; j < types.length; j++) {

        const type = types[j].type.name;

        html += templateType(type);
    }

    return html;
}


function templateStats(i) {

    const type = basePokedex[i].types[0].type.name;

    document.getElementById('section-stats').innerHTML = /*html*/ `
    
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
}