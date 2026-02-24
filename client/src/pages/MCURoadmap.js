import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MCURoadmap = () => {
  const [content, setContent] = useState([]);
  const [view, setView] = useState('all'); 
  const navigate = useNavigate();
  const API_KEY = '4ec9a9a9220db9bb16091fbf9cf1ba53';

  const MCU_KEYWORD = '180547';
  const MARVEL_STUDIOS = '420';

  const getPhase = (date) => {
    if (!date) return "PHASE 6";
    const year = parseInt(date.split('-')[0]);
    const month = parseInt(date.split('-')[1]);
    if (year <= 2012) return "PHASE 1";
    if (year <= 2015) return "PHASE 2";
    if (year <= 2019 && !(year === 2019 && month > 7)) return "PHASE 3";
    if (year <= 2022) return "PHASE 4";
    if (year <= 2025 && !(year === 2025 && month > 5)) return "PHASE 5";
    return "PHASE 6";
  };

  useEffect(() => {
    const fetchEverything = async () => {
      try {
        // Fetch multiple pages to ensure we get ALL content
        const moviePages = [1, 2, 3];
        const tvPages = [1, 2, 3];

        const movieRequests = moviePages.map(p => 
          axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_companies=${MARVEL_STUDIOS}&with_keywords=${MCU_KEYWORD}&page=${p}`)
        );
        const tvRequests = tvPages.map(p => 
          axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_keywords=${MCU_KEYWORD}&page=${p}`)
        );

        const responses = await Promise.all([...movieRequests, ...tvRequests]);

        let combinedData = [];

        responses.forEach((res, index) => {
          const isMovie = index < moviePages.length;
          const items = res.data.results.map(item => ({
            ...item,
            media_type: isMovie ? 'movie' : 'tv',
            release: isMovie ? item.release_date : item.first_air_date,
            display_title: isMovie ? item.title : item.name
          }));
          combinedData.push(...items);
        });

        // --- THE CLEANUP FILTER ---
        const cleaned = combinedData.filter(item => {
          const title = item.display_title.toLowerCase();
          const id = item.id.toString();
          
          // IDs for Helstrom (TV: 91462) and MPower (TV: 221051)
          const isHelstrom = id === '91462' || title.includes("helstrom");
          const isMPower = id === '221051' || title.includes("mpower");
          
          return !isHelstrom && !isMPower;
        });

        // Deduplicate and Sort
        const unique = Array.from(new Map(cleaned.map(item => [item.id, item])).values());
        setContent(unique.sort((a, b) => new Date(b.release) - new Date(a.release)));
        
      } catch (err) {
        console.error("Sync Error:", err);
      }
    };
    fetchEverything();
  }, [API_KEY]);

  const doomsdayEssentials = ["Loki", "Deadpool", "Fantastic Four", "Doctor Strange", "Avengers", "Daredevil", "Spider-Man", "Wonder Man"];

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <h1 style={logoStyle}>THE SACRED TIMELINE</h1>
        <div style={btnGroup}>
          <button onClick={() => setView('all')} style={{ ...tabBtn, borderBottom: view === 'all' ? '3px solid #ed1d24' : 'none' }}>ALL MCU</button>
          <button onClick={() => setView('doomsday')} style={{ ...tabBtn, borderBottom: view === 'doomsday' ? '3px solid #ed1d24' : 'none' }}>BATTLE FOR DOOMSDAY 💀</button>
        </div>
      </header>

      <div style={movieGrid}>
        {content
          .filter(item => view === 'all' || doomsdayEssentials.some(e => item.display_title.includes(e)))
          .map((item) => (
          <motion.div 
            layout 
            key={`${item.media_type}-${item.id}`} 
            whileHover={{ scale: 1.05, filter: "brightness(1.2)" }}
            style={movieCard}
            onClick={() => navigate(`/${item.media_type}/${item.id}`)}
          >
            <div style={phaseBadge}>{getPhase(item.release)}</div>
            <div style={typeBadge}>{item.media_type === 'tv' ? 'SERIES' : 'MOVIE'}</div>
            <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.display_title} style={posterStyle} />
            <div style={movieInfo}>
              <h4 style={movieTitle}>{item.display_title.toUpperCase()}</h4>
              <p style={movieDate}>{item.release?.split('-')[0] || "2026"}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Styles ---
const pageStyle = { padding: '40px', background: '#050505', minHeight: '100vh', color: '#fff' };
const headerStyle = { textAlign: 'center', marginBottom: '50px' };
const logoStyle = { fontFamily: 'Impact', fontSize: '3.5rem', color: '#fff', letterSpacing: '4px' };
const btnGroup = { display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '20px' };
const tabBtn = { background: 'none', border: 'none', color: '#fff', padding: '10px 20px', cursor: 'pointer', fontFamily: 'Impact', fontSize: '1.2rem' };
const movieGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '30px' };
const movieCard = { background: '#111', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', position: 'relative', border: '1px solid #333' };
const posterStyle = { width: '100%', height: '330px', objectFit: 'cover' };
const movieInfo = { padding: '15px', textAlign: 'center' };
const movieTitle = { fontSize: '1rem', fontFamily: 'Impact', margin: '0 0 5px 0', height: '2.5rem' };
const movieDate = { color: '#ed1d24', fontWeight: 'bold' };
const phaseBadge = { position: 'absolute', top: '10px', left: '10px', background: '#ed1d24', padding: '4px 8px', fontSize: '0.7rem', fontWeight: 'bold', zIndex: 10 };
const typeBadge = { position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.8)', padding: '4px 8px', fontSize: '0.6rem', border: '1px solid #fff', zIndex: 10 };

export default MCURoadmap;