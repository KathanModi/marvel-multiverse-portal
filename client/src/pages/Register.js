import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion'; // For smooth transitions

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Connecting to your MERN backend
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      // Auto-login upon successful registration
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("ACADEMY REJECTION: Email might already be in use or data is invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageContainer}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={formStyle}
      >
        <h2 style={titleStyle}>JOIN THE ACADEMY</h2>
        <p style={subtitleStyle}>ENLIST FOR MULTIVERSE SURVEILLANCE</p>

        <form onSubmit={handleSubmit}>
          <div style={inputGroup}>
            <label style={labelStyle}>AGENT ALIAS</label>
            <input 
              type="text" 
              placeholder="E.G. STAR-LORD" 
              style={inputStyle} 
              required
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>COMMUNICATION FREQUENCY (EMAIL)</label>
            <input 
              type="email" 
              placeholder="AGENT@SHIELD.COM" 
              style={inputStyle} 
              required
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>SECURITY CLEARANCE (PASSWORD)</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              style={inputStyle} 
              required
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: '#ff1f26' }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            style={{...btnStyle, opacity: loading ? 0.7 : 1}}
            disabled={loading}
          >
            {loading ? 'ENROLLING...' : 'ENLIST NOW'}
          </motion.button>
        </form>

        <p style={footerNote}>* BY JOINING, YOU AGREE TO DEFEND THE SACRED TIMELINE.</p>
      </motion.div>
    </div>
  );
};

// --- Futuristic Academy Styles ---
const pageContainer = { 
  height: '90vh', 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  backgroundColor: '#050505',
  backgroundImage: 'radial-gradient(circle, #1a0000 0%, #050505 100%)' 
};

const formStyle = { 
  background: '#111', 
  padding: '40px', 
  border: '1px solid #333', 
  borderTop: '4px solid #ed1d24',
  width: '400px',
  boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
};

const titleStyle = { 
  color: '#ed1d24', 
  textAlign: 'center', 
  fontFamily: 'Impact', 
  fontSize: '2rem',
  letterSpacing: '2px',
  margin: '0'
};

const subtitleStyle = {
  color: '#666',
  fontSize: '0.7rem',
  textAlign: 'center',
  marginBottom: '30px',
  letterSpacing: '1px'
};

const inputGroup = {
  marginBottom: '20px'
};

const labelStyle = {
  display: 'block',
  color: '#999',
  fontSize: '0.65rem',
  fontWeight: 'bold',
  marginBottom: '5px',
  fontFamily: 'Arial, sans-serif'
};

const inputStyle = { 
  width: '100%', 
  padding: '12px', 
  background: '#000', 
  border: '1px solid #222', 
  color: 'white',
  outline: 'none',
  fontSize: '0.9rem',
  borderRadius: '4px'
};

const btnStyle = { 
  width: '100%', 
  padding: '15px', 
  background: '#ed1d24', 
  color: 'white', 
  fontWeight: 'bold', 
  fontFamily: 'Impact',
  fontSize: '1.1rem',
  border: 'none', 
  cursor: 'pointer',
  marginTop: '10px',
  letterSpacing: '1px'
};

const footerNote = {
  color: '#444',
  fontSize: '0.6rem',
  textAlign: 'center',
  marginTop: '20px'
};

export default Register;