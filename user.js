const mongoose = require('mongoose');

// Definir o esquema para os usuários
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: false },
    created_at: { type: Date, default: Date.now },
    animes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Anime' }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
