import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Favorites = () => {
  const [squad, setSquad] = useState([]);

  const fetchSquad = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/characters/favorites');
      setSquad(res.data);
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  useEffect(() => {
    fetchSquad();
  }, []);

  const removeAgent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/characters/favorites/${id}`);
      fetchSquad(); 
    } catch (err) {
      console.error("Dismissal failed:", err);
    }
  };

  return (
    <div style={{ padding: '120px 5%', background: '#000', minHeight: '100vh', color: '#fff' }}>
      <h1 style={{ fontFamily: 'Impact', fontSize: '3.5rem', letterSpacing: '2px', textAlign: 'center' }}>
        MY ACTIVE SQUAD
      </h1>
      <div style={{ width: '60px', height: '4px', background: '#ed1d24', margin: '10px auto 40px' }}></div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px' }}>
        {squad.map((agent, index) => (
          <div key={agent.id || index} style={{ border: '1px solid #333', padding: '15px', background: '#111', textAlign: 'center' }}>
            <img 
              // FIX: Only add TMDB prefix if it's a partial path. Marvel API gives full URLs.
              src={agent.poster_path?.startsWith('http') ? agent.poster_path : `https://image.tmdb.org/t/p/w500${agent.poster_path}`} 
              alt={agent.name} 
              style={{ width: '100%', borderRadius: '4px', marginBottom: '10px' }} 
              onError={(e) => { e.target.src = 'https://via.placeholder.com/200x300?text=Agent+Classified'; }}
            />
            <p style={{ fontFamily: 'Impact', fontSize: '1.2rem', marginBottom: '15px' }}>
              {(agent.name || agent.title)?.toUpperCase()}
            </p>
            <button 
              onClick={() => removeAgent(agent.id)} 
              style={{ background: '#ed1d24', color: '#fff', border: 'none', padding: '8px 20px', cursor: 'pointer', fontFamily: 'Impact', width: '100%' }}
            >
              DISMISS
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;