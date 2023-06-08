async function fetchData() {

    const url = 'https://pokeapi.co/api/v2/pokemon/chimchar';
    let response = await fetch(url);

    let responseJson = await response.json();

    renderName(responseJson);
    renderImage(responseJson);
}

function renderName(responseJson) {

    let content = document.getElementById('name');

    let name = responseJson['forms']['0']['name'];

    content.innerHTML = `${name}`;
}

function renderImage(responseJson) {

    let image = document.getElementById('image');

    let image_url = responseJson['sprites']['front_default'];

    image.src = image_url;
}