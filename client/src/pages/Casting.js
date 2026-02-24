import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Casting = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const API_KEY = '4ec9a9a9220db9bb16091fbf9cf1ba53';

  const searchActor = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length > 2) {
      const res = await axios.get(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${val}`);
      setResults(res.data.results);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={searchContainer}>
        <h1 style={titleStyle}>CASTING ARCHIVES</h1>
        <input 
          style={searchBar} 
          placeholder="SEARCH ACTOR (e.g. Robert Downey Jr)..." 
          value={query}
          onChange={searchActor}
        />
      </div>

      <div style={actorGrid}>
        {results.map((actor) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={actor.id} 
            style={actorCard}
          >
            <div style={imageWrapper}>
              <img 
                src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : 'https://via.placeholder.com/500x750?text=No+Image'} 
                alt={actor.name} 
                style={actorImage} 
              />
            </div>
            <div style={actorInfo}>
              <h3 style={actorName}>{actor.name.toUpperCase()}</h3>
              <p style={knownFor}>FAMOUS FOR: {actor.known_for[0]?.title || 'Classified'}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const searchContainer = { textAlign: 'center', marginBottom: '60px' };
const titleStyle = { fontFamily: 'Impact', fontSize: '4rem', fontStyle: 'italic', color: '#ed1d24' };
const searchBar = { width: '80%', maxWidth: '700px', padding: '20px', background: '#111', border: 'none', borderBottom: '5px solid #ed1d24', color: '#fff', fontSize: '1.5rem', fontFamily: 'Impact', outline: 'none' };

const actorGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '30px' };
const actorCard = { background: '#111', border: '2px solid #222', overflow: 'hidden', position: 'relative' };
const imageWrapper = { height: '300px', overflow: 'hidden' };
const actorImage = { width: '100%', height: '100%', objectFit: 'cover' };
const actorInfo = { padding: '15px', background: 'linear-gradient(to top, #000, transparent)', position: 'absolute', bottom: 0, width: '100%' };
const actorName = { fontFamily: 'Impact', color: '#fff', margin: 0, fontSize: '1.2rem' };
const knownFor = { color: '#ed1d24', fontSize: '0.7rem', fontWeight: 'bold' };

const pageStyle = { padding: '60px', background: '#050505', minHeight: '100vh' };

export default Casting;