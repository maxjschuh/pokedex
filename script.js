let pokedex = [];

async function init() {

    await fetchData(1, 21);
    render();
}

async function loadMore() {

    await fetchData(21, 41);
    render();
}

async function fetchData(start, end) {

    for (let i = start; i < end; i++) {

        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;

        let response = await fetch(url);
        let responseJson = await response.json();

        pokedex.push(responseJson);
    }
}

function render() {

    let container = document.getElementById('main');
    container.innerHTML = '';

    for (let i = 0; i < pokedex.length; i++) {

        container.innerHTML += templatePokedexCard(i);
    }
}

function templatePokedexCard(i) {

    const pokemon = pokedex[i];

    const name = pokemon['forms'][0]['name'];
    const imgUrl = pokemon['sprites']['other']['home']['front_default'];


    let html = /*html*/ `
    <div>
        <h2>${name}</h2>
        <img src="${imgUrl}" alt="${name}">
    </div>
    `;

    return html;
}