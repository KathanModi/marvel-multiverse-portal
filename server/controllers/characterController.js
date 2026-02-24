const Character = require('../models/Characters');
const axios = require('axios');

const MARVEL_DATA_URL = 'https://akabab.github.io/superhero-api/api/all.json';

// Fetch all with Filter support
exports.getAllCharacters = async (req, res) => {
  try {
    const { alignment } = req.query;
    const response = await axios.get(MARVEL_DATA_URL);
    let data = response.data.filter(hero => hero.biography.publisher === "Marvel Comics");

    if (alignment) {
      data = data.filter(h => h.biography.alignment === alignment.toLowerCase());
    }

    const characters = data.map(hero => ({
      _id: hero.id.toString(),
      name: hero.name,
      image: hero.images.md,
      universe: 'Marvel',
      alignment: hero.biography.alignment,
      stats: hero.powerstats
    }));

    res.json(characters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fuzzy Search for Live Recommendations
exports.searchCharacters = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);

    const response = await axios.get(MARVEL_DATA_URL);
    const cleanQuery = query.toLowerCase().replace(/\s+/g, '');

    const results = response.data
      .filter(hero => {
        const cleanName = hero.name.toLowerCase().replace(/\s+/g, '');
        return cleanName.includes(cleanQuery) && hero.biography.publisher === "Marvel Comics";
      })
      .map(hero => ({
        _id: hero.id.toString(),
        name: hero.name,
        image: hero.images.md,
        stats: hero.powerstats
      }));

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Detail Page
exports.getCharacterById = async (req, res) => {
  try {
    const response = await axios.get(MARVEL_DATA_URL);
    const hero = response.data.find(h => h.id.toString() === req.params.id);
    if (!hero) return res.status(404).json({ message: "Not found" });
    res.json(hero);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Stats Comparison
exports.compareCharacters = async (req, res) => {
  try {
    const { id1, id2 } = req.query;
    const response = await axios.get(MARVEL_DATA_URL);
    const char1 = response.data.find(h => h.id.toString() === id1);
    const char2 = response.data.find(h => h.id.toString() === id2);
    res.json({ char1, char2 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Save Favorite
exports.saveFavorite = async (req, res) => {
  try {
    const newFav = new Character(req.body);
    await newFav.save();
    res.status(201).json(newFav);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};