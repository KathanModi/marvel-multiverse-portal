import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const HeroCard = ({ character }) => {
  const [isHovered, setIsHovered] = useState(false);

  const saveFavorite = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) return alert("🛑 ACCESS DENIED: Please login first!");

    try {
      await axios.post(
        '/api/characters/favorites',
        {
          characterId: character._id,
          name: character.name,
          image: character.image,
          stats: character.stats
        },
        { headers: { 'x-auth-token': token } }
      );
      alert(`💥 ${character.name} SECURED IN DATABASE!`);
    } catch (err) {
      console.error("Save Error:", err.response?.data);
      alert("ERROR: Hero already exists in favorites.");
    }
  };

  return (
    <motion.div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
    >
      <div style={imgContainer}>
        <img src={character.image} alt={character.name} style={imgStyle} />
        
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={statsOverlay}
            >
              <h4 style={overlayTitle}>POWER PROFILE</h4>
              {/* ✅ FIXED: Changed statsList to statsContainer to match defined styles */}
              <div style={statsContainer}>
                {Object.entries(character.stats || {}).map(([key, value]) => (
                  <div key={key} style={statGrid}>
                    <span style={statLabel}>{key.toUpperCase()}</span>
                    <div style={barTrack}>
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${value}%` }} 
                        style={{
                          ...barFill,
                          boxShadow: value > 80 ? '0 0 15px #ed1d24' : 'none'
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={infoStyle}>
        <h3 style={heroNameFont}>{character.name}</h3>
        <button onClick={saveFavorite} style={comicBtn}>
          ADD TO SQUAD
        </button>
      </div>
    </motion.div>
  );
};

// --- Superhero Design Styles ---
const cardStyle = { 
  background: '#000', 
  borderRadius: '0px', 
  overflow: 'hidden', 
  border: '3px solid #222', 
  position: 'relative',
  boxShadow: '10px 10px 0px #ed1d24' 
};

const imgContainer = { height: '350px', position: 'relative', borderBottom: '4px solid #ed1d24' };
const imgStyle = { width: '100%', height: '100%', objectFit: 'cover' };

const statsOverlay = {
  position: 'absolute', inset: 0, 
  background: 'linear-gradient(to right, rgba(0,0,0,0.95), rgba(0,0,0,0.7))',
  padding: '30px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center'
};

const overlayTitle = { 
  color: '#ed1d24', 
  fontFamily: 'Impact, sans-serif', 
  fontSize: '1.5rem', 
  fontStyle: 'italic',
  marginBottom: '20px', 
  letterSpacing: '2px',
  borderLeft: '4px solid #ed1d24',
  paddingLeft: '10px'
};

// ✅ Define statsContainer here
const statsContainer = { display: 'flex', flexDirection: 'column', gap: '5px' };

const statGrid = { 
  display: 'grid', 
  gridTemplateColumns: '100px 1fr', 
  alignItems: 'center', 
  marginBottom: '12px' 
};

const statLabel = { 
  color: '#fff', 
  fontFamily: 'Impact, sans-serif', 
  fontSize: '0.8rem', 
  letterSpacing: '1px',
  fontStyle: 'italic'
};

const barTrack = { height: '8px', background: '#333', transform: 'skewX(-20deg)', overflow: 'hidden' };
const barFill = { height: '100%', background: '#ed1d24', transition: 'width 1s ease-out' };

const infoStyle = { padding: '20px', background: '#111', textAlign: 'center' };

const heroNameFont = { 
  margin: '0 0 15px 0', 
  color: '#fff', 
  fontFamily: 'Impact, sans-serif', 
  fontSize: '1.8rem', 
  textTransform: 'uppercase', 
  letterSpacing: '1px',
  fontStyle: 'italic',
  textShadow: '2px 2px 0px #ed1d24'
};

const comicBtn = { 
  width: '100%', 
  padding: '10px', 
  background: '#ed1d24', 
  color: '#fff', 
  fontFamily: 'Impact, sans-serif', 
  fontSize: '1rem',
  border: 'none', 
  cursor: 'pointer',
  transform: 'skewX(-10deg)',
  transition: '0.2s',
  letterSpacing: '1px'
};

export default HeroCard;
