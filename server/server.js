const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// 1. Import routes (Only declare these ONCE)
const authRoutes = require('./routes/auth');
const characterRoutes = require('./routes/characters');
const postRoutes = require('./routes/posts');


// 2. Initialize the app (MUST happen before app.use)
const app = express();

// 3. Connect to MongoDB
connectDB();

// 4. Middleware

app.use(cors());
app.use(express.json());

// 5. Root route
app.get('/', (req, res) => {
  res.send('Marvel Multiverse API Running 🦸');
});

// 6. Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/posts', postRoutes);

// 7. Error handling (Should be LAST)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

// 8. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.use(cors());
app.use(express.json());

// Temporary in-memory database (Replace with MongoDB later)
let favoriteSquad = [];

// 🚀 FIX FOR THE 404: The GET route
app.get('/api/characters/favorites', (req, res) => {
  res.json(favoriteSquad);
});

// The POST route to add a movie to the squad
app.post('/api/characters/favorites', (req, res) => {
  const movie = req.body;
  
  // Check if already exists
  const exists = favoriteSquad.find(m => m.id === movie.id);
  if (!exists) {
    favoriteSquad.push(movie);
    res.status(201).json({ message: "Agent recruited to squad!" });
  } else {
    res.status(400).json({ message: "Agent already in squad" });
  }
});

// DELETE route to remove from squad
app.delete('/api/characters/favorites/:id', (req, res) => {
  const { id } = req.params;
  favoriteSquad = favoriteSquad.filter(m => m.id !== parseInt(id));
  res.json({ message: "Agent dismissed" });
});
app.use('/api/characters', require('./routes/characters'));