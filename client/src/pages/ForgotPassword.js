import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Hits the recovery endpoint we added to the authController
      const res = await axios.post('/api/auth/forgot-password', { email });
      setMessage(res.data.msg);
    } catch (err) {
      setMessage(err.response?.data?.msg || "TRANSMISSION FAILED. CHECK SIGNAL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        style={cardStyle}
      >
        <h2 style={headerStyle}>RECOVER IDENTITY</h2>
        <p style={subtitleStyle}>ENTER YOUR REGISTERED EMAIL TO RESET ACCESS</p>

        {message && <div style={msgBoxStyle}>{message}</div>}

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
            {loading ? 'SENDING...' : 'SEND RECOVERY LINK'}
          </button>
        </form>
        <a href="/login" style={backLink}>BACK TO LOGIN</a>
      </motion.div>
    </div>
  );
};

// --- Styles ---
const containerStyle = { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#050505' };
const cardStyle = { background: '#111', padding: '40px', border: '1px solid #333', borderTop: '4px solid #ed1d24', width: '400px', textAlign: 'center' };
const headerStyle = { color: '#fff', fontFamily: 'Impact', fontSize: '2rem', marginBottom: '10px' };
const subtitleStyle = { color: '#666', fontSize: '0.8rem', marginBottom: '20px' };
const inputStyle = { width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', marginBottom: '15px' };
const btnStyle = { width: '100%', padding: '12px', background: '#ed1d24', color: '#fff', border: 'none', fontFamily: 'Impact', cursor: 'pointer' };
const msgBoxStyle = { background: 'rgba(237, 29, 36, 0.1)', color: '#ed1d24', padding: '10px', fontSize: '0.8rem', marginBottom: '15px', border: '1px solid #ed1d24' };
const backLink = { color: '#666', fontSize: '0.7rem', textDecoration: 'none', marginTop: '15px', display: 'block' };
const formStyle = { display: 'flex', flexDirection: 'column' };

export default ForgotPassword;
