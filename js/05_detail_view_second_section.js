/**
 * Renders the second section in the detail view (fight statistics) for the inputted pokemon.
 * @param {number} i index of the pokemon whose statistics should be rendered
 */
function renderDetailViewSecondSection(i) {

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


/**
 * Calculates the width of the colored statistics bar for the inputted statistic and pokemon.
 * @param {number} i index of the pokemon whose statistic should be used
 * @param {string} statType category of the statistic like attack, defense, etc.
 * @param {number} maxStat maximum statistic for the inputted category in the pokemon world
 * @returns width of the colored statistics bar in percent of the maximum width
 */
function calculateStatsBarWidth(i, statType, maxStat) {

    return basePokedex[i].stats[statType].base_stat / maxStat * 100;
}