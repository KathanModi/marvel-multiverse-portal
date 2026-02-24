const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  universe: { type: String, default: 'Marvel' },
  alignment: { type: String },
  stats: {
    intelligence: { type: Number, default: 0 },
    strength: { type: Number, default: 0 },
    speed: { type: Number, default: 0 },
    durability: { type: Number, default: 0 },
    power: { type: Number, default: 0 },
    combat: { type: Number, default: 0 }
  },
  // For the Favorite system
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  isFavorite: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Character', CharacterSchema);