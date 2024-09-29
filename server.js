const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');  // Importando o modelo de User
const Anime = require('./models/anime');  // Importando o modelo de Anime

const app = express();

app.use(express.json());

// Conectar ao MongoDB Atlas
mongoose.connect('mongodb+srv://chxsecore:iZVrAaGcXit30SDV@cluster0.mongodb.net/animeDB?retryWrites=true&w=majority')
    .then(() => {
        console.log("Conectado ao MongoDB Atlas com sucesso!");
    })
    .catch((error) => {
        console.error("Erro ao conectar ao MongoDB Atlas:", error);
    });

// Rota para registrar um novo usuário e retornar o userId
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    
    const user = new User({ username, password, email });
    
    try {
        await user.save();
        // Após salvar o usuário, retornar o userId
        res.status(201).json({ userId: user._id, message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        res.status(400).send('Erro ao registrar o usuário: ' + error.message);
    }
});

// Rota para adicionar um anime à coleção do usuário
app.post('/user/:userId/addAnime', async (req, res) => {
    const { userId } = req.params;
    const { title, description, kitsuId } = req.body;

    const anime = new Anime({ title, description, kitsuId });

    try {
        // Salvar o anime
        await anime.save();

        // Associar o anime ao usuário
        const user = await User.findById(userId);
        user.animes.push(anime._id);
        await user.save();

        res.status(201).send('Anime adicionado à coleção do usuário com sucesso!');
    } catch (error) {
        res.status(400).send('Erro ao adicionar o anime: ' + error.message);
    }
});

// Rota para obter os animes salvos por um usuário
app.get('/user/:userId/animes', async (req, res) => {
    const { userId } = req.params;

    try {
        // Encontrar o usuário e popular o campo 'animes' com os detalhes dos animes
        const user = await User.findById(userId).populate('animes');

        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }

        // Retornar a lista de animes do usuário
        res.status(200).json(user.animes);
    } catch (error) {
        res.status(500).send('Erro ao buscar os animes do usuário: ' + error.message);
    }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
