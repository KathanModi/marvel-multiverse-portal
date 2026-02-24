import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Radar } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const Comparison = () => {
  const [characters, setCharacters] = useState([]);
  const [hero1, setHero1] = useState(null);
  const [hero2, setHero2] = useState(null);
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/characters');
        setCharacters(res.data);
      } catch (err) {
        console.error("Error fetching characters:", err);
      }
    };
    fetchData();
  }, []);

  // --- WIN DETECTION LOGIC ---
  const calculateTotal = (hero) => {
    if (!hero || !hero.stats) return 0;
    return Object.values(hero.stats).reduce((a, b) => a + b, 0);
  };

  const total1 = calculateTotal(hero1);
  const total2 = calculateTotal(hero2);

  const winner = (hero1 && hero2) 
    ? (total1 > total2 ? 'hero1' : total2 > total1 ? 'hero2' : 'tie') 
    : null;

  const filtered1 = characters.filter(c => 
    c.name.toLowerCase().includes(search1.toLowerCase())
  );
  const filtered2 = characters.filter(c => 
    c.name.toLowerCase().includes(search2.toLowerCase())
  );

  const resetArena = () => {
    setHero1(null);
    setHero2(null);
    setSearch1('');
    setSearch2('');
    setShow1(false);
    setShow2(false);
  };

  const getChartData = () => ({
    labels: ['Intelligence', 'Strength', 'Speed', 'Durability', 'Power', 'Combat'],
    datasets: [
      {
        label: hero1?.name || 'Hero 1',
        data: hero1 ? Object.values(hero1.stats) : [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(237, 29, 36, 0.3)',
        borderColor: '#ed1d24',
        borderWidth: 3,
        pointBackgroundColor: '#ed1d24',
      },
      {
        label: hero2?.name || 'Hero 2',
        data: hero2 ? Object.values(hero2.stats) : [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(0, 174, 255, 0.3)',
        borderColor: '#00aeff',
        borderWidth: 3,
        pointBackgroundColor: '#00aeff',
      },
    ],
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      style={containerStyle}
    >
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={titleStyle}>BATTLE ANALYTICS</h1>
        <p style={{ color: '#888', letterSpacing: '2px' }}>COMPARE POWER LEVELS</p>
      </header>
      
      <div style={flexRow}>
        {/* HERO 1 SEARCH */}
        <div style={{ position: 'relative' }}>
          {/* WINNER BADGE 1 */}
          <AnimatePresence>
            {winner === 'hero1' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={winnerBadge}>
                WINNER (+{total1 - total2})
              </motion.div>
            )}
          </AnimatePresence>

          <input
            style={{ ...inputStyle, borderBottomColor: hero1 ? '#ed1d24' : '#333' }}
            placeholder="SEARCH HERO 1..."
            value={search1}
            onFocus={() => setShow1(true)}
            onChange={(e) => setSearch1(e.target.value)}
          />
          <AnimatePresence>
            {show1 && search1 && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={dropdownStyle}>
                {filtered1.slice(0, 6).map(c => (
                  <div key={c._id} style={itemStyle} onClick={() => { setHero1(c); setSearch1(c.name); setShow1(false); }}>
                    {c.name}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* VS / RESET BUTTON */}
        <div style={{ width: '100px', textAlign: 'center' }}>
          <AnimatePresence mode="wait">
            {hero1 || hero2 ? (
              <motion.button
                key="reset"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                onClick={resetArena}
                style={resetBtnStyle}
                whileHover={{ scale: 1.1, backgroundColor: '#fff', color: '#ed1d24' }}
              >
                RESET
              </motion.button>
            ) : (
              <motion.h2 key="vs" style={vsStyle}>VS</motion.h2>
            )}
          </AnimatePresence>
        </div>

        {/* HERO 2 SEARCH */}
        <div style={{ position: 'relative' }}>
          {/* WINNER BADGE 2 */}
          <AnimatePresence>
            {winner === 'hero2' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{...winnerBadge, color: '#00aeff', textShadow: '0 0 10px rgba(0,174,255,0.5)'}}>
                WINNER (+{total2 - total1})
              </motion.div>
            )}
          </AnimatePresence>

          <input
            style={{ ...inputStyle, borderBottomColor: hero2 ? '#00aeff' : '#333' }}
            placeholder="SEARCH HERO 2..."
            value={search2}
            onFocus={() => setShow2(true)}
            onChange={(e) => setSearch2(e.target.value)}
          />
          <AnimatePresence>
            {show2 && search2 && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={dropdownStyle}>
                {filtered2.slice(0, 6).map(c => (
                  <div key={c._id} style={itemStyle} onClick={() => { setHero2(c); setSearch2(c.name); setShow2(false); }}>
                    {c.name}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div 
        layout 
        style={chartWrapper}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Radar data={getChartData()} options={radarOptions} />
        {winner === 'tie' && hero1 && hero2 && (
           <div style={{textAlign: 'center', color: '#888', fontFamily: 'Impact', marginTop: '20px'}}>POWER LEVELS EQUAL: IT'S A TIE</div>
        )}
      </motion.div>
    </motion.div>
  );
};

// --- Styles ---
const winnerBadge = {
  position: 'absolute',
  top: '-35px',
  left: 0,
  right: 0,
  textAlign: 'center',
  fontFamily: 'Impact',
  fontSize: '1.2rem',
  color: '#ed1d24',
  textShadow: '0 0 10px rgba(237,29,36,0.5)',
  letterSpacing: '1px'
};

const containerStyle = { 
  padding: '80px 20px', 
  background: 'radial-gradient(circle, #1a1a1a 0%, #000 100%)', 
  minHeight: '100vh', 
  color: '#fff' 
};

const titleStyle = { 
  textAlign: 'center', 
  fontFamily: 'Impact, sans-serif', 
  fontSize: '4rem', 
  color: '#ed1d24', 
  margin: 0,
  letterSpacing: '3px'
};

const flexRow = { 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  gap: '30px', 
  margin: '60px 0' 
};

const vsStyle = { 
  fontSize: '2.5rem', 
  color: '#333', 
  fontFamily: 'Impact', 
  margin: 0,
  fontStyle: 'italic'
};

const inputStyle = { 
  width: '280px', 
  padding: '15px', 
  background: 'transparent', 
  border: 'none', 
  borderBottom: '2px solid #333', 
  color: '#fff', 
  outline: 'none', 
  fontSize: '1.1rem',
  transition: 'border-color 0.4s ease',
  textAlign: 'center'
};

const dropdownStyle = { 
  position: 'absolute', 
  top: '100%', 
  width: '100%', 
  background: '#111', 
  zIndex: 100, 
  border: '1px solid #333', 
  maxHeight: '250px', 
  overflowY: 'auto',
  boxShadow: '0px 10px 30px rgba(0,0,0,0.5)'
};

const itemStyle = { 
  padding: '12px', 
  cursor: 'pointer', 
  borderBottom: '1px solid #222', 
  fontSize: '0.9rem',
  transition: 'background 0.2s',
  backgroundColor: '#111',
  ':hover': { background: '#222' }
};

const resetBtnStyle = {
  padding: '10px 20px',
  background: '#ed1d24',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  fontFamily: 'Impact',
  cursor: 'pointer',
  fontSize: '1rem',
  transition: 'all 0.3s ease'
};

const chartWrapper = { 
  maxWidth: '700px', 
  margin: '0 auto', 
  background: 'rgba(255, 255, 255, 0.03)', 
  padding: '50px', 
  borderRadius: '30px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
};

const radarOptions = {
  scales: {
    r: {
      angleLines: { color: '#333' },
      grid: { color: '#333' },
      pointLabels: { color: '#888', font: { size: 14, family: 'Impact' } },
      ticks: { display: false },
      suggestedMin: 0,
      suggestedMax: 100
    }
  },
  plugins: {
    legend: {
      labels: { color: '#fff', font: { size: 14 } }
    }
  }
};

export default Comparison;
