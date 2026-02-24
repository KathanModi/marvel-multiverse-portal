import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ForgotUsername = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setUsername('');
    try {
      // Hits the forgot-username endpoint in your authController
      const res = await axios.post('http://localhost:5000/api/auth/forgot-username', { email });
      // We show the username directly for this project
      setUsername(res.data.username); 
    } catch (err) {
      setMessage(err.response?.data?.msg || "AGENT NOT FOUND IN DATABASE.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={cardStyle}>
        <h2 style={headerStyle}>RECOVER ALIAS</h2>
        <p style={subtitleStyle}>ENTER YOUR EMAIL TO RETRIEVE YOUR AGENT IDENTITY</p>

        {message && <p style={errorStyle}>{message}</p>}
        {username && (
          <div style={successBox}>
            <p style={{ margin: 0, fontSize: '0.7rem' }}>IDENTITY CONFIRMED:</p>
            <h3 style={aliasText}>{username.toUpperCase()}</h3>
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          <input 
            type="email" 
            placeholder="AGENT@SHIELD.COM" 
            style={inputStyle} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" style={btnStyle} disabled={loading}>
            {loading ? 'SEARCHING...' : 'RECOVER USERNAME'}
          </button>
        </form>
        <Link to="/login" style={backLink}>RETURN TO LOGIN</Link>
      </motion.div>
    </div>
  );
};

// --- Styles ---
const containerStyle = { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#050505' };
const cardStyle = { background: '#111', padding: '40px', borderTop: '4px solid #ed1d24', width: '380px', textAlign: 'center' };
const headerStyle = { color: '#fff', fontFamily: 'Impact', fontSize: '1.8rem', marginBottom: '10px' };
const subtitleStyle = { color: '#666', fontSize: '0.7rem', marginBottom: '20px' };
const inputStyle = { width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', marginBottom: '15px' };
const btnStyle = { width: '100%', padding: '12px', background: '#ed1d24', color: '#fff', border: 'none', fontFamily: 'Impact', cursor: 'pointer' };
const successBox = { background: '#1a1a1a', border: '1px solid #00ff00', padding: '15px', marginBottom: '15px', color: '#00ff00' };
const aliasText = { margin: '5px 0 0 0', fontSize: '1.5rem', fontFamily: 'Impact', letterSpacing: '2px' };
const errorStyle = { color: '#ed1d24', fontSize: '0.8rem', marginBottom: '15px' };
const backLink = { color: '#666', fontSize: '0.7rem', textDecoration: 'none', marginTop: '20px', display: 'block' };
const formStyle = { display: 'flex', flexDirection: 'column' };

export default ForgotUsername;