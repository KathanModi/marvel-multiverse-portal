const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');

// Helper to check if controller exists (prevents the [object Undefined] crash)
const checkFn = (fn) => fn || ((req, res) => res.status(500).send("Controller function missing"));

// 🔎 Search + Filters (Must be above /:id)
router.get('/search', checkFn(characterController.searchCharacters));

// 📊 Power stats comparison
router.get('/compare', checkFn(characterController.compareCharacters));

// ❤️ Save favorite heroes
router.post('/favorites', checkFn(characterController.saveFavorite));

// 🧠 Character detail pages
router.get('/:id', checkFn(characterController.getCharacterById));

// 🏠 Default Home (All characters)
router.get('/', checkFn(characterController.getAllCharacters));

module.exports = router;