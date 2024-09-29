const mongoose = require('mongoose');

// Definir o esquema para os animes
const animeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    kitsuId: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

const Anime = mongoose.model('Anime', animeSchema);

module.exports = Anime;
 