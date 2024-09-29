// Carregar dados do usuário logado
const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

if (loggedInUser) {
    document.getElementById('username').textContent = loggedInUser.username;
    document.getElementById('profile-pic').src = loggedInUser.profilePic;
    document.getElementById('follower-count').textContent = loggedInUser.followers.length || 0; // Mostrar a contagem de seguidores
} else {
    window.location.href = 'login.html';  // Redirecionar para login se o usuário não estiver logado
}

// Função para buscar usuários
function searchUsers() {
    const query = document.getElementById('search-user').value.toLowerCase();
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const results = users.filter(user => user.username.toLowerCase().includes(query) && user.username !== loggedInUser.username);

    displayUserResults(results);
}

// Função para exibir resultados de usuários
function displayUserResults(results) {
    const userResultsDiv = document.getElementById('user-results');
    userResultsDiv.innerHTML = ''; // Limpa resultados anteriores

    results.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <img src="${user.profilePic}" alt="${user.username}" style="border-radius: 50%; width: 40px; height: 40px; margin-right: 10px;">
                <p style="margin: 0;">${user.username}</p>
                <button onclick="followUser('${user.username}', this)" style="margin-left: 10px;" data-following="false">Seguir</button>
            </div>
        `;
        userResultsDiv.appendChild(userDiv);
    });

    if (results.length === 0) {
        userResultsDiv.innerHTML = '<p>Nenhum usuário encontrado.</p>';
    }
}

// Função para seguir um usuário
function followUser(usernameToFollow, button) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userToFollow = users.find(user => user.username === usernameToFollow);

    if (userToFollow) {
        if (!loggedInUser.following) {
            loggedInUser.following = []; // Inicializa o array se não existir
        }
        
        if (!loggedInUser.following.includes(usernameToFollow)) {
            loggedInUser.following.push(usernameToFollow);
            userToFollow.followers.push(loggedInUser.username); // Adiciona o seguidor

            // Atualiza o localStorage
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

            button.textContent = "Seguindo";
            button.setAttribute("data-following", "true");
            alert(`Você seguiu ${usernameToFollow}!`);
        } else {
            alert(`Você já está seguindo ${usernameToFollow}.`);
        }
    }
}

// Função para voltar à página anterior
function goBack() {
    window.history.back();
}
