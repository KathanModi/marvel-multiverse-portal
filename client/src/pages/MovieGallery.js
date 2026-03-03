import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import MovieCard from '../components/MovieCard';

const MovieGallery = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTimeline, setIsTimeline] = useState(false);
  
  const API_KEY = '4ec9a9a9220db9bb16091fbf9cf1ba53';

  // 1. UPDATED MCU TIMELINE (Current as of March 2026)
  const mcuTimelineMap = {
    "285": 1,    // Captain America: The First Avenger (1940s)
    "437342": 2, // The Fantastic Four: First Steps (1960s Retro-Future)
    "299537": 3, // Captain Marvel (1995)
    "1726": 4,   // Iron Man (2008)
    "10138": 5,  // Iron Man 2
    "1771": 6,   // The Incredible Hulk
    "10195": 7,  // Thor
    "24428": 8,  // The Avengers
    "68721": 9,  // Iron Man 3
    "76338": 10, // Thor: The Dark World
    "100402": 11, // Captain America: The Winter Soldier
    "118340": 12, // Guardians of the Galaxy
    "76341": 13, // Guardians of the Galaxy Vol. 2
    "99861": 14,  // Avengers: Age of Ultron
    "102899": 15, // Ant-Man
    "271110": 16, // Captain America: Civil War
    "284052": 17, // Doctor Strange
    "315635": 18, // Spider-Man: Homecoming
    "284054": 19, // Black Panther
    "284053": 20, // Thor: Ragnarok
    "299536": 21, // Avengers: Infinity War
    "299534": 22, // Avengers: Endgame
    "429617": 23, // Spider-Man: Far From Home
    "497698": 24, // Black Widow
    "616037": 25, // Shang-Chi
    "524434": 26, // Eternals
    "634649": 27, // Spider-Man: No Way Home
    "453395": 28, // Doctor Strange in the Multiverse of Madness
    "616038": 29, // Thor: Love and Thunder (Corrected ID)
    "505642": 30, // Black Panther: Wakanda Forever
    "640146": 31, // Ant-Man and the Wasp: Quantumania
    "447365": 32, // Guardians of the Galaxy Vol. 3
    "609681": 33, // The Marvels
    "533535": 34, // Deadpool & Wolverine
    "365177": 35, // Captain America: Brave New World
    "939243": 36, // Thunderbolts* (Late 2025)
    "124800": 37, // Daredevil: Born Again (Released March 2026)
    "1003596": 40, // Avengers: Doomsday (Dec 2026)
    "1003598": 41  // Avengers: Secret Wars (Dec 2027)
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_companies=420` 
        );
        
        const enrichedMovies = res.data.results.map(movie => ({
          ...movie,
          timelineIndex: mcuTimelineMap[movie.id.toString()] || 999
        }));

        setMovies(enrichedMovies);
        setLoading(false);
      } catch (err) {
        console.error("Multiverse Sync Error:", err);
        setLoading(false);
      }
    };
    fetchMovies();
  }, [API_KEY]);

  const sortedMovies = useMemo(() => {
    let list = [...movies];
    if (isTimeline) {
      return list.sort((a, b) => a.timelineIndex - b.timelineIndex);
    }
    return list.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
  }, [movies, isTimeline]);

  if (loading) return <div style={loaderStyle}>SYNCHRONIZING SACRED TIMELINE...</div>;

  return (
    <div style={pageContainer}>
      <header style={headerStyle}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={logoStyle}
        >
          MARVEL <span style={{color: '#fff'}}>PORTAL</span>
        </motion.h1>
        
        <div style={toggleWrapper}>
          <span style={!isTimeline ? activeText : inactiveText}>RELEASE</span>
          
          <div onClick={() => setIsTimeline(!isTimeline)} style={switchTrack}>
            <motion.div 
              animate={{ x: isTimeline ? 30 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={switchThumb}
            />
          </div>
          
          <span style={isTimeline ? activeText : inactiveText}>TIMELINE</span>
        </div>
      </header>

      <motion.div layout style={gridStyle}>
        <AnimatePresence mode="popLayout">
          {sortedMovies.map((movie) => (
            <motion.div
              layout
              key={movie.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <MovieCard movie={movie} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// --- STYLES (Phase 6 "Doom" Theme) ---

const pageContainer = {
  backgroundColor: '#050505',
  minHeight: '100vh',
  padding: '60px 5%',
  fontFamily: 'Impact, sans-serif'
};

const headerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '60px'
};

const logoStyle = {
  color: '#ed1d24',
  fontSize: '3.5rem',
  letterSpacing: '2px',
  margin: '0 0 20px 0',
  textShadow: '0 0 20px rgba(237, 29, 36, 0.4)'
};

const toggleWrapper = { display: 'flex', alignItems: 'center', gap: '20px' };

const switchTrack = {
  width: '60px',
  height: '30px',
  backgroundColor: '#111',
  borderRadius: '20px',
  padding: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  border: '2px solid #222'
};

const switchThumb = {
  width: '22px',
  height: '22px',
  backgroundColor: '#ed1d24',
  borderRadius: '50%',
  boxShadow: '0 0 15px rgba(237, 29, 36, 0.8)'
};

const activeText = { color: '#ed1d24', fontSize: '0.9rem', letterSpacing: '3px', fontWeight: 'bold' };
const inactiveText = { color: '#333', fontSize: '0.9rem', letterSpacing: '3px' };

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: '40px'
};

const loaderStyle = {
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#050505',
  color: '#ed1d24',
  fontSize: '1.2rem',
  letterSpacing: '8px',
  fontFamily: 'Impact'
};

export default MovieGallery;