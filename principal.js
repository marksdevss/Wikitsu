// Carregar dados do usuário logado
let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || {
    username: "",
    profilePic: "",
    favorites: [],
    following: [],
    followers: [],
    activityLog: []
};

// Inicializa a estrutura do usuário
if (!Array.isArray(loggedInUser.favorites)) {
    loggedInUser.favorites = [];
}

if (!Array.isArray(loggedInUser.following)) {
    loggedInUser.following = [];
}

// Exibir dados do usuário
document.getElementById('user-info').innerHTML = `
    <h2>Bem-vindo, ${loggedInUser.username}!</h2>
    <img src="${loggedInUser.profilePic}" alt="Foto de Perfil" style="border-radius: 50%; width: 120px; height: 120px;">
`;

// Função para pesquisar animes
async function searchAnimes() {
    const query = document.getElementById('search-query').value;

    if (!query) {
        alert('Por favor, insira o nome de um anime para pesquisar.');
        return;
    }

    try {
        const response = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(query)}`);
        const data = await response.json();
        const animes = data.data.map(anime => ({
            id: anime.id,
            title: anime.attributes.titles.en_jp || anime.attributes.titles.en || anime.attributes.canonicalTitle,
            image: anime.attributes.posterImage ? anime.attributes.posterImage.small : '',
            description: anime.attributes.synopsis || 'Sem descrição disponível'
        }));
        displayAnimes(animes);
    } catch (error) {
        console.error('Erro ao buscar animes:', error);
        alert('Ocorreu um erro ao buscar animes.');
    }
}

// Exibir animes encontrados
function displayAnimes(animes) {
    const animeList = document.getElementById('anime-list');
    animeList.innerHTML = ''; // Limpar lista anterior

    if (animes.length === 0) {
        animeList.innerHTML = '<p>Nenhum anime encontrado.</p>';
    } else {
        animes.forEach(anime => {
            const animeItem = document.createElement('div');
            animeItem.innerHTML = `
                <h3>${anime.title}</h3>
                <img src="${anime.image}" alt="${anime.title}">
                <p>${anime.description}</p>
                <button onclick="addToFavorites('${anime.id}', '${anime.title}', '${anime.image}')">Favoritar</button>
            `;
            animeList.appendChild(animeItem);
        });
    }
}

// Adicionar anime aos favoritos
function addToFavorites(animeId, title, image) {
    const favorites = loggedInUser.favorites;

    if (!favorites.some(anime => anime.id === animeId)) {
        favorites.push({ id: animeId, title: title, image: image, category: 'Favoritos' });
        loggedInUser.favorites = favorites;

        // Atualiza localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        alert(`Anime "${title}" adicionado aos favoritos!`);
    } else {
        alert(`Você já favoritou "${title}".`);
    }
}

// Limpar pesquisa
function clearSearch() {
    document.getElementById('search-query').value = '';
    document.getElementById('anime-list').innerHTML = '';
}


// Exibir dados do usuário no modal
function openEditProfileModal() {
    document.getElementById('new-username').value = loggedInUser.username;
    document.getElementById('edit-profile-modal').style.display = 'block';
}

// Fechar o modal
const span = document.getElementsByClassName('close')[0];
span.onclick = function () {
    document.getElementById('edit-profile-modal').style.display = 'none';
}

// Fechar o modal ao clicar fora dele
window.onclick = function (event) {
    const modal = document.getElementById('edit-profile-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Função para atualizar o perfil
document.getElementById('update-profile-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Impede o envio do formulário

    const newUsername = document.getElementById('new-username').value;
    const newProfilePicInput = document.getElementById('new-profile-pic');
    const file = newProfilePicInput.files[0];

    // Atualizar apenas o nome se a imagem não for selecionada
    if (file) {
        getBase64(file, function (base64Image) {
            updateUserProfile(newUsername, base64Image);
        });
    } else {
        updateUserProfile(newUsername);
    }
});

// Função para converter imagem em base64
function getBase64(file, callback) {
    const reader = new FileReader();
    reader.onload = function () {
        callback(reader.result);
    };
    reader.onerror = function (error) {
        console.log('Erro ao converter imagem para base64: ', error);
    };
    reader.readAsDataURL(file);
}

// Função para atualizar as informações do usuário
function updateUserProfile(newUsername, newProfilePic) {
    // Atualiza o nome de usuário
    if (newUsername) {
        loggedInUser.username = newUsername;
    }
    // Atualiza a foto de perfil
    if (newProfilePic) {
        loggedInUser.profilePic = newProfilePic;
    }

    // Atualiza o localStorage
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

    alert('Perfil atualizado com sucesso!');
    document.getElementById('edit-profile-modal').style.display = 'none';
    window.location.reload(); // Recarregar a página para mostrar as alterações
}

// Adiciona o evento de abrir o modal no botão de edição de perfil
document.getElementById('edit-profile-button').onclick = openEditProfileModal;



// Função para deslogar o usuário
document.getElementById('logout-button').addEventListener('click', function () {
    // Remove o usuário logado do localStorage
    localStorage.removeItem('loggedInUser');

    // Redireciona para a página de login
    window.location.href = 'login.html';  // Altere 'login.html' para o nome correto do seu arquivo de login, se necessário
});


document.getElementById('meu-perfil').addEventListener('click', function () {

    window.location.href = 'perfil-publico.html';  // Altere 'login.html' para o nome correto do seu arquivo de login, se necessário
});


// Função para exibir recomendações de usuários
function displayUserRecommendations() {
    const userCarouselItems = document.getElementById('user-carousel-items');
    userCarouselItems.innerHTML = ''; // Limpar itens anteriores

    // Puxar usuários do localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Filtrar usuários que não são o usuário logado
    const recommendedUsers = users.filter(user => user.username !== loggedInUser.username);

    recommendedUsers.forEach(user => {
        const item = document.createElement('div');
        item.classList.add('carousel-item');
        item.innerHTML = `
            <img src="${user.profilePic}" alt="${user.username}" style="border-radius: 50%; width: 60px; height: 60px;">
            <p>${user.username}</p>
            <button onclick="followUser('${user.username}')">Seguir</button>
        `;
        userCarouselItems.appendChild(item);
    });
}

function followUser(usernameToFollow) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userToFollow = users.find(user => user.username === usernameToFollow);

    if (userToFollow) {
        if (!loggedInUser.following.includes(usernameToFollow)) {
            loggedInUser.following.push(usernameToFollow);
            userToFollow.followers.push(loggedInUser.username);

            // Atualiza o localStorage
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

            alert(`Você seguiu ${usernameToFollow}!`);
        } else {
            alert(`Você já está seguindo ${usernameToFollow}.`);
        }
    }
}

// Inicializar carrossel
displayUserRecommendations();
