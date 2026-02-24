import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';


const Settings = () => {
  const { user, login } = useContext(AuthContext);
  const [email, setEmail] = useState(user?.email || '');
  const [pic, setPic] = useState(user?.profilePic || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      
      // FIX: Match your middleware's requirement (Bearer Token)
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const res = await axios.put(
        'http://localhost:5000/api/auth/profile', 
        { email, profilePic: pic },
        config
      );
      
      // Update global state and localStorage
      login(res.data.user, token); 
      setMessage('DATABASE UPDATED, AGENT.');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.msg || 'ACCESS DENIED: UPDATE FAILED.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        style={cardStyle}
      >
        <h2 style={headerStyle}>ACCOUNT SETTINGS</h2>
        <p style={subtitleStyle}>MODIFY YOUR MULTIVERSE IDENTITY</p>

        <div style={avatarWrapper}>
          <img 
            src={pic || 'https://via.placeholder.com/100'} 
            alt="Profile" 
            style={avatarStyle} 
          />
        </div>
        
        {message && (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            style={{...msgStyle, color: message.includes('FAILED') ? '#ed1d24' : '#00ff00'}}
          >
            {message}
          </motion.p>
        )}

        <form onSubmit={handleUpdate} style={formStyle}>
          <label style={labelStyle}>UPDATE PROFILE PIC URL</label>
          <input 
            style={inputStyle} 
            value={pic} 
            placeholder="HTTPS://..."
            onChange={(e) => setPic(e.target.value)} 
          />

          <label style={labelStyle}>UPDATE COMMUNICATION EMAIL</label>
          <input 
            style={inputStyle} 
            type="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />

          <button type="submit" style={btnStyle} disabled={loading}>
            {loading ? 'SYNCING...' : 'SAVE CHANGES'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// --- Styles ---
const containerStyle = { minHeight: '90vh', background: '#050505', padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const cardStyle = { background: '#111', padding: '40px', border: '1px solid #333', borderTop: '4px solid #ed1d24', width: '100%', maxWidth: '450px', boxShadow: '0 10px 30px rgba(0,0,0,0.7)' };
const headerStyle = { color: '#fff', fontFamily: 'Impact', textAlign: 'center', fontSize: '2rem', marginBottom: '5px' };
const subtitleStyle = { color: '#666', fontSize: '0.7rem', textAlign: 'center', marginBottom: '25px', letterSpacing: '1px' };
const avatarWrapper = { display: 'flex', justifyContent: 'center', marginBottom: '25px' };
const avatarStyle = { width: '120px', height: '120px', borderRadius: '50%', border: '3px solid #ed1d24', objectFit: 'cover', background: '#000' };
const labelStyle = { color: '#999', fontSize: '0.65rem', fontWeight: 'bold', marginBottom: '8px' };
const inputStyle = { width: '100%', padding: '12px', background: '#000', border: '1px solid #222', color: '#fff', marginBottom: '20px', borderRadius: '4px', outline: 'none' };
const btnStyle = { width: '100%', padding: '15px', background: '#ed1d24', color: '#fff', border: 'none', fontFamily: 'Impact', cursor: 'pointer', fontSize: '1rem', letterSpacing: '1px' };
const msgStyle = { textAlign: 'center', fontSize: '0.8rem', marginBottom: '15px', fontWeight: 'bold' };
const formStyle = { display: 'flex', flexDirection: 'column' };


export default Settings;