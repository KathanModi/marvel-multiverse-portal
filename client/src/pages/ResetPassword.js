import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const { token } = useParams(); // Grabs token from URL
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      // Hits the reset endpoint in your authController
      const res = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      setMessage(res.data.msg);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setMessage(err.response?.data?.msg || "RESET FAILED. LINK EXPIRED.");
    }
  };

  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={cardStyle}>
        <h2 style={headerStyle}>RESET SECURITY KEY</h2>
        {message && <p style={msgStyle}>{message}</p>}
        <form onSubmit={handleReset} style={formStyle}>
          <input 
            type="password" 
            placeholder="NEW PASSWORD" 
            style={inputStyle} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" style={btnStyle}>UPDATE ACCESS</button>
        </form>
      </motion.div>
    </div>
  );
};

// Use the same styles as your Login page for consistency
const containerStyle = { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#050505' };
const cardStyle = { background: '#111', padding: '40px', borderTop: '4px solid #ed1d24', width: '350px' };
const headerStyle = { color: '#fff', fontFamily: 'Impact', textAlign: 'center' };
const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', marginBottom: '20px' };
const btnStyle = { width: '100%', padding: '12px', background: '#ed1d24', color: '#fff', border: 'none', fontFamily: 'Impact', cursor: 'pointer' };
const msgStyle = { color: '#00ff00', textAlign: 'center', fontSize: '0.8rem' };
const formStyle = { display: 'flex', flexDirection: 'column' };

export default ResetPassword;