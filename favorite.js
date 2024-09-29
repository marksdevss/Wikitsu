const mongoose = require('mongoose');

// Definir o esquema para os favoritos
const favoriteSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    anime_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Anime', required: true },
    created_at: { type: Date, default: Date.now }
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
4