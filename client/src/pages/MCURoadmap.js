import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const API_KEY = '4ec9a9a9220db9bb16091fbf9cf1ba53';

// ─────────────────────────────────────────────────────────────────
// OFFICIAL DISNEY+ / MARVEL.COM CHRONOLOGICAL ORDER (Jan 2026)
// Source: marvel.com/articles/movies/mcu-timeline-order-disney-plus
// Keys = TMDB ID strings, values = sort position
// ─────────────────────────────────────────────────────────────────
const DISNEY_TIMELINE = {
  // Eyes of Wakanda (animated) — TMDB TV id
  "228565": 5,
  // Captain America: The First Avenger
  "1771": 10,
  // Captain Marvel
  "299537": 20,
  // Iron Man
  "1726": 30,
  // Iron Man 2
  "10138": 40,
  // The Incredible Hulk
  "1724": 50,
  // Thor
  "10195": 60,
  // The Avengers
  "24428": 70,
  // Thor: The Dark World
  "76338": 80,
  // Iron Man 3
  "68721": 90,
  // Captain America: The Winter Soldier
  "100402": 100,
  // Guardians of the Galaxy
  "118340": 110,
  // Guardians of the Galaxy Vol. 2
  "283995": 120,
  // Daredevil S1 (Netflix) — TMDB TV
  "61889": 125,
  // Avengers: Age of Ultron
  "99861": 130,
  // Ant-Man
  "102899": 140,
  // Captain America: Civil War
  "271110": 150,
  // Black Widow
  "497698": 155,
  // Black Panther
  "284054": 160,
  // Spider-Man: Homecoming
  "315635": 165,
  // Doctor Strange
  "284052": 170,
  // Thor: Ragnarok
  "283566": 175,
  // Ant-Man and the Wasp ← was missing before
  "363088": 180,
  // Avengers: Infinity War
  "299536": 185,
  // Avengers: Endgame
  "299534": 190,
  // Loki S1
  "84958": 200,
  // What If...? S1
  "91363": 205,
  // WandaVision
  "85271": 210,
  // Shang-Chi
  "566525": 215,
  // The Falcon and the Winter Soldier
  "88396": 220,
  // Spider-Man: Far From Home
  "429617": 225,
  // Eternals
  "524434": 230,
  // Doctor Strange in the Multiverse of Madness
  "616037": 235,
  // Hawkeye
  "88329": 240,
  // Moon Knight
  "92749": 245,
  // Black Panther: Wakanda Forever
  "505642": 250,
  // Echo
  "202555": 255,
  // She-Hulk: Attorney at Law
  "92776": 260,
  // Ms. Marvel
  "92783": 265,
  // Thor: Love and Thunder
  "616038": 270,
  // Ironheart
  "138502": 275,
  // Werewolf By Night
  "117283": 278,
  // The Guardians of the Galaxy Holiday Special
  "114472": 280,
  // Ant-Man and the Wasp: Quantumania
  "640146": 285,
  // Guardians of the Galaxy Vol. 3
  "447365": 290,
  // Secret Invasion
  "114479": 295,
  // The Marvels
  "609681": 300,
  // Loki S2
  // Same TMDB id as S1 (84958) — handled by title matching in sort
  // What If...? S2 — same id as S1 (91363)
  // Deadpool & Wolverine
  "533535": 310,
  // Agatha All Along
  "93405": 315,
  // What If...? S3 — same id (91363)
  // Daredevil: Born Again
  "102454": 320,
  // Spider-Man: No Way Home
  "634649": 325,
  // Captain America: Brave New World ← was missing
  "822119": 330,
  // Thunderbolts* ← was wrong id before
  "986056": 335,
  // Fantastic Four: First Steps
  "1010581": 340,
  // Wonder Man
  "111110": 345,
  // Avengers: Doomsday
  "939243": 350,
  // Spider-Man: Brand New Day
  "124800": 355,
  // Avengers: Secret Wars
  "1003596": 360,
};

// ─────────────────────────────────────────────────────────────────
// RELEASE ORDER — grouped by Phase
// Phase dates based on official MCU phase boundaries
// ─────────────────────────────────────────────────────────────────
const getPhase = (releaseDate, title) => {
  const t = title.toLowerCase();
  if (["secret wars", "doomsday"].some(k => t.includes(k))) return "PHASE 6";
  if (["fantastic four", "thunderbolts", "ironheart", "wonder man", "brand new day", "brave new world"].some(k => t.includes(k))) return "PHASE 5";
  if (!releaseDate) return "PHASE 6";
  const year = parseInt(releaseDate.split('-')[0]);
  if (year <= 2012) return "PHASE 1";
  if (year <= 2015) return "PHASE 2";
  if (year <= 2019) return "PHASE 3";
  if (year <= 2022) return "PHASE 4";
  if (year <= 2025) return "PHASE 5";
  return "PHASE 6";
};

const phaseColors = {
  "PHASE 1": "#f5a623",
  "PHASE 2": "#7ed321",
  "PHASE 3": "#4a90e2",
  "PHASE 4": "#9b59b6",
  "PHASE 5": "#e74c3c",
  "PHASE 6": "#ed1d24",
};

const doomsdayEssentials = [
  "Loki", "Deadpool", "Fantastic Four", "Doctor Strange",
  "Avengers", "Daredevil", "Spider-Man", "WandaVision", "Thunderbolts"
];

const MCURoadmap = () => {
  const [content, setContent] = useState([]);
  const [view, setView] = useState('all');
  const [isTimeline, setIsTimeline] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEverything = async () => {
      try {
        setLoading(true);
        const pages = [1, 2, 3];

        const movieRequests = pages.map(p =>
          axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_companies=420&with_keywords=180547&page=${p}`)
        );
        const tvRequests = pages.map(p =>
          axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_keywords=180547&page=${p}`)
        );

        const responses = await Promise.all([...movieRequests, ...tvRequests]);
        let combined = [];

        responses.forEach((res, i) => {
          const isMovie = i < pages.length;
          const items = res.data.results.map(item => ({
            ...item,
            media_type: isMovie ? 'movie' : 'tv',
            release: isMovie ? item.release_date : item.first_air_date,
            display_title: isMovie ? item.title : item.name,
          }));
          combined.push(...items);
        });

        // Composite key prevents TV/movie same-ID overwrite
        const unique = Array.from(
          new Map(combined.map(item => [`${item.media_type}-${item.id}`, item])).values()
        );

        setContent(unique);
      } catch (err) {
        console.error('MCU fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEverything();
  }, []);

  const sortedContent = useMemo(() => {
    let filtered = content
      .filter(item => {
        if (view === 'series') return item.media_type === 'tv';
        if (view === 'doomsday') return doomsdayEssentials.some(e => item.display_title.includes(e));
        return true;
      })
      .filter(item => item.release);

    if (isTimeline) {
      // Use official Disney+ order; unknowns go to the very end sorted by release date
      return [...filtered].sort((a, b) => {
        const ap = DISNEY_TIMELINE[a.id.toString()] ?? 9999;
        const bp = DISNEY_TIMELINE[b.id.toString()] ?? 9999;
        if (ap !== bp) return ap - bp;
        return new Date(a.release) - new Date(b.release);
      });
    }

    // Release order: sort purely by date
    return [...filtered].sort((a, b) => new Date(a.release) - new Date(b.release));
  }, [content, view, isTimeline]);

  // Group by phase for release-order display
  const groupedByPhase = useMemo(() => {
    if (isTimeline) return null;
    const groups = {};
    sortedContent.forEach(item => {
      const phase = getPhase(item.release, item.display_title);
      if (!groups[phase]) groups[phase] = [];
      groups[phase].push(item);
    });
    return groups;
  }, [sortedContent, isTimeline]);

  const phaseOrder = ["PHASE 1", "PHASE 2", "PHASE 3", "PHASE 4", "PHASE 5", "PHASE 6"];

  const renderCard = (item, index) => {
    const phase = getPhase(item.release, item.display_title);
    const phaseColor = phaseColors[phase] || '#ed1d24';
    const priority = DISNEY_TIMELINE[item.id.toString()];

    return (
      <motion.div
        key={`${item.media_type}-${item.id}`}
        style={movieCard}
        onClick={() => navigate(`/${item.media_type}/${item.id}`)}
        whileHover={{ scale: 1.05, borderColor: phaseColor }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index * 0.01, 0.4) }}
      >
        <div style={{ ...phaseBadge, background: phaseColor }}>{phase}</div>
        <div style={typeBadge}>{item.media_type === 'tv' ? '📺' : '🎬'}</div>

        {isTimeline && priority && (
          <div style={timelinePosBadge}>#{Math.round(priority / 5)}</div>
        )}

        {item.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            alt={item.display_title}
            style={posterStyle}
          />
        ) : (
          <div style={noPosterStyle}>
            <span style={{ fontSize: '2.5rem' }}>🎬</span>
          </div>
        )}

        <div style={movieInfo}>
          <h4 style={movieTitle}>{item.display_title.toUpperCase()}</h4>
          <p style={{ ...movieDate, color: phaseColor }}>{item.release}</p>
        </div>
      </motion.div>
    );
  };

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <motion.h1
          style={logoStyle}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          THE SACRED <span style={{ color: '#ed1d24' }}>TIMELINE</span>
        </motion.h1>

        <motion.div style={switchContainer} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <span style={!isTimeline ? activeLabel : inactiveLabel}>RELEASE ORDER</span>
          <div style={switchTrack} onClick={() => setIsTimeline(prev => !prev)}>
            <motion.div
              animate={{ x: isTimeline ? 32 : 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
              style={switchThumb}
            />
          </div>
          <span style={isTimeline ? activeLabel : inactiveLabel}>CHRONOLOGICAL</span>
        </motion.div>

        <div style={btnGroup}>
          {[
            { key: 'all', label: 'ALL MCU' },
            { key: 'series', label: 'SERIES ONLY 📺' },
            { key: 'doomsday', label: 'BATTLE FOR DOOMSDAY 💀' },
          ].map(btn => (
            <button
              key={btn.key}
              onClick={() => setView(btn.key)}
              style={{
                ...tabBtn,
                borderBottom: view === btn.key ? '3px solid #ed1d24' : '3px solid transparent',
                color: view === btn.key ? '#fff' : '#888',
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {!loading && (
          <p style={countStyle}>
            {sortedContent.length} TITLES &nbsp;·&nbsp;
            <span style={{ color: isTimeline ? '#ed1d24' : '#aaa' }}>
              {isTimeline ? '⏱ DISNEY+ CHRONOLOGICAL ORDER' : '📅 RELEASE ORDER BY PHASE'}
            </span>
          </p>
        )}
      </header>

      {loading ? (
        <div style={loadingStyle}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            style={spinnerStyle}
          />
          <p style={{ color: '#555', fontFamily: 'Impact', marginTop: '20px', letterSpacing: '2px' }}>
            LOADING THE MULTIVERSE...
          </p>
        </div>
      ) : isTimeline ? (
        // ── CHRONOLOGICAL: flat grid, key forces full remount on toggle ──
        <div key="timeline" style={movieGrid}>
          {sortedContent.map((item, i) => renderCard(item, i))}
        </div>
      ) : (
        // ── RELEASE ORDER: grouped by Phase with headers ──
        <div key="release">
          {phaseOrder.map(phase => {
            const items = groupedByPhase?.[phase];
            if (!items || items.length === 0) return null;
            return (
              <div key={phase} style={{ marginBottom: '60px' }}>
                <div style={{ ...phaseHeader, borderColor: phaseColors[phase], color: phaseColors[phase] }}>
                  ── {phase} ──
                </div>
                <div style={movieGrid}>
                  {items.map((item, i) => renderCard(item, i))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── STYLES ───────────────────────────────────────────────────────
const pageStyle = { padding: '40px', background: '#050505', minHeight: '100vh', color: '#fff' };
const headerStyle = { textAlign: 'center', marginBottom: '50px' };
const logoStyle = { fontFamily: 'Impact', fontSize: '3.5rem', color: '#fff', letterSpacing: '4px', margin: 0 };
const switchContainer = { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', margin: '20px 0' };
const switchTrack = { width: '64px', height: '32px', background: '#1a1a1a', borderRadius: '20px', padding: '4px', cursor: 'pointer', border: '2px solid #ed1d24', display: 'flex', alignItems: 'center' };
const switchThumb = { width: '24px', height: '24px', background: '#ed1d24', borderRadius: '50%' };
const activeLabel = { fontFamily: 'Impact', color: '#ed1d24', fontSize: '0.9rem' };
const inactiveLabel = { fontFamily: 'Impact', color: '#555', fontSize: '0.9rem' };
const btnGroup = { display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '10px' };
const tabBtn = { background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontFamily: 'Impact', fontSize: '1.1rem', padding: '5px 15px', transition: 'color 0.2s' };
const countStyle = { color: '#444', fontFamily: 'Impact', letterSpacing: '3px', marginTop: '15px', fontSize: '0.85rem' };
const loadingStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh' };
const spinnerStyle = { width: '48px', height: '48px', border: '4px solid #1a1a1a', borderTop: '4px solid #ed1d24', borderRadius: '50%' };
const phaseHeader = { fontFamily: 'Impact', fontSize: '1.6rem', letterSpacing: '6px', textAlign: 'center', borderTop: '1px solid', borderBottom: '1px solid', padding: '12px 0', marginBottom: '30px' };
const movieGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' };
const movieCard = { background: '#111', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', position: 'relative', border: '1px solid #222', transition: 'border-color 0.2s' };
const posterStyle = { width: '100%', height: '300px', objectFit: 'cover', display: 'block' };
const noPosterStyle = { width: '100%', height: '300px', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const movieInfo = { padding: '12px', textAlign: 'center' };
const movieTitle = { fontSize: '0.85rem', fontFamily: 'Impact', height: '2.4rem', margin: 0, overflow: 'hidden' };
const movieDate = { fontSize: '0.75rem', marginTop: '4px', fontFamily: 'Impact', letterSpacing: '1px' };
const phaseBadge = { position: 'absolute', top: '8px', left: '8px', padding: '3px 7px', fontSize: '0.65rem', fontWeight: 'bold', zIndex: 10, borderRadius: '3px' };
const typeBadge = { position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.85)', padding: '3px 7px', fontSize: '0.7rem', border: '1px solid #333', zIndex: 10, borderRadius: '3px' };
const timelinePosBadge = { position: 'absolute', bottom: '56px', right: '8px', background: 'rgba(0,0,0,0.9)', color: '#ed1d24', padding: '3px 7px', fontSize: '0.7rem', fontFamily: 'Impact', border: '1px solid #ed1d24', zIndex: 10, borderRadius: '3px' };

export default MCURoadmap;