import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroCard from '../components/HeroCard';
import { motion } from 'framer-motion';

const Home = () => {
  const [characters, setCharacters] = useState([]);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/characters');
        // Sort A-Z so the sections make sense
        const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
        setCharacters(sorted);
      } catch (err) {
        console.error("Error fetching characters:", err);
      }
    };
    fetchData();
  }, []);

  const scrollToLetter = (letter) => {
    const element = document.getElementById(`section-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={pageContainer}>
      {/* --- A-Z NAVIGATION RAIL --- */}
      <nav style={alphabetNav}>
        {alphabet.map((letter) => (
          <button 
            key={letter} 
            onClick={() => scrollToLetter(letter)} 
            style={letterBtn}
            onMouseEnter={(e) => (e.target.style.color = '#ed1d24')}
            onMouseLeave={(e) => (e.target.style.color = '#444')}
          >
            {letter}
          </button>
        ))}
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main style={mainContent} className="comic-scrollbar">
        <header style={headerStyle}>
          <h1 style={mainTitle}>HERO DATABASE</h1>
          <div style={redLine}></div>
        </header>

        {alphabet.map((letter) => {
          // Only show letters that actually have heroes
          const heroesForLetter = characters.filter(c => 
            c.name.toUpperCase().startsWith(letter)
          );

          if (heroesForLetter.length === 0) return null;

          return (
            <section key={letter} id={`section-${letter}`} style={letterSection}>
              <h2 style={sectionLabel}>{letter}</h2>
              <div style={cardGrid}>
                {heroesForLetter.map(hero => (
                  <HeroCard key={hero._id} character={hero} />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* --- GLOBAL CSS FOR THE RED SCROLLBAR --- */}
      <style>
        {`
          .comic-scrollbar::-webkit-scrollbar {
            width: 10px;
          }
          .comic-scrollbar::-webkit-scrollbar-track {
            background: #000;
          }
          .comic-scrollbar::-webkit-scrollbar-thumb {
            background: #ed1d24;
            border: 2px solid #000;
          }
          .comic-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #ff4d4d;
          }
          /* Smooth scroll for the whole page */
          html {
            scroll-behavior: smooth;
          }
        `}
      </style>
    </div>
  );
};

// --- Superhero Layout Styles ---
const pageContainer = {
  display: 'flex',
  background: '#050505',
  minHeight: '100vh',
  color: '#fff'
};

const alphabetNav = {
  position: 'fixed',
  right: '15px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 100,
  background: 'rgba(0,0,0,0.9)',
  padding: '15px 5px',
  border: '1px solid #222',
  boxShadow: '-5px 0 15px rgba(0,0,0,0.5)'
};

const letterBtn = {
  background: 'none',
  border: 'none',
  color: '#444',
  fontFamily: 'Impact, sans-serif',
  fontSize: '0.8rem',
  cursor: 'pointer',
  transition: '0.2s',
  padding: '2px 0'
};

const mainContent = {
  flex: 1,
  padding: '60px 80px 60px 40px',
  height: '100vh',
  overflowY: 'auto'
};

const headerStyle = { textAlign: 'center', marginBottom: '80px' };
const mainTitle = { 
  fontFamily: 'Impact, sans-serif', 
  fontSize: '4rem', 
  fontStyle: 'italic', 
  letterSpacing: '4px',
  textShadow: '4px 4px 0px #ed1d24'
};
const redLine = { width: '100px', height: '5px', background: '#ed1d24', margin: '10px auto' };

const letterSection = { marginBottom: '100px' };
const sectionLabel = {
  fontFamily: 'Impact, sans-serif',
  fontSize: '3rem',
  color: '#ed1d24',
  marginBottom: '30px',
  borderBottom: '1px solid #333',
  display: 'inline-block',
  paddingRight: '50px'
};

const cardGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '40px'
};

export default Home;