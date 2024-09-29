async function searchAnime() {
    const query = document.getElementById('search-query').value;
    const response = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${query}`);
    const data = await response.json();

    const animeList = document.getElementById('anime-list');
    animeList.innerHTML = '';

    data.data.forEach(anime => {
        const animeItem = document.createElement('div');
        animeItem.classList.add('anime');
        animeItem.innerHTML = `
            <h3>${anime.attributes.titles.en_jp}</h3>
            <img src="${anime.attributes.posterImage.small}" alt="${anime.attributes.titles.en_jp}">
            <p>${anime.attributes.synopsis}</p>
        `;
        animeList.appendChild(animeItem);
    });
}


const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

if (loggedInUser && loggedInUser.favorites) {
    displayRecommendations(); // Chame esta função para exibir as recomendações
} else {
    document.getElementById('carousel-items').innerHTML = '<p>Nenhum anime favoritado ainda.</p>';
}