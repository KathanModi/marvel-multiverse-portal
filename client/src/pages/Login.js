import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // Added Link here
import axios from 'axios';
import { motion } from 'framer-motion';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/login', { 
        email, 
        password 
      });

      const { user, token } = res.data;
      login(user, token); 
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.response?.data?.message || 'ACCESS DENIED: INVALID CREDENTIALS';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={loginPage}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        style={loginForm}
      >
        <h2 style={formTitle}>IDENTIFY YOURSELF</h2>
        
        {error && <motion.div initial={{ x: -10 }} animate={{ x: 0 }} style={errorBox}>{error}</motion.div>}

        <form onSubmit={handleLogin} style={innerForm}>
          <label style={labelStyle}>AGENT EMAIL</label>
          <input 
            type="email"
            name="email"
            value={email}
            style={inputStyle} 
            placeholder="ENTER REGISTERED EMAIL" 
            onChange={onChange}
            required
          />

          <label style={labelStyle}>SECURITY CLEARANCE KEY</label>
          <input 
            type="password"
            name="password"
            value={password}
            style={inputStyle} 
            placeholder="ENTER PASSWORD" 
            onChange={onChange}
            required
          />

          <button 
            type="submit" 
            style={{...submitBtn, opacity: loading ? 0.7 : 1}}
            disabled={loading}
          >
            {loading ? 'VERIFYING...' : 'ACCESS DATABASE'}
          </button>
        </form>

        {/* --- NEW RECOVERY LINKS SECTION --- */}
        <div style={helpLinksContainer}>
          <Link to="/forgot-password" style={helpLink}>FORGOT SECURITY KEY?</Link>
          <span style={{ color: '#333' }}> | </span>
          <Link to="/forgot-username" style={helpLink}>RECOVER ALIAS</Link>
        </div>
        
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: '0.7rem' }}>
            NEW RECRUIT? <Link to="/register" style={{ color: '#ed1d24', textDecoration: 'none' }}>ENLIST HERE</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// --- Styles ---
const loginPage = { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#050505', backgroundImage: 'radial-gradient(circle, #1a0000 0%, #050505 100%)' };
const loginForm = { background: '#111', padding: '40px', border: '1px solid #333', borderTop: '4px solid #ed1d24', width: '100%', maxWidth: '400px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' };
const innerForm = { display: 'flex', flexDirection: 'column', gap: '15px' };
const formTitle = { color: '#fff', fontFamily: 'Impact', textAlign: 'center', fontSize: '2rem', marginBottom: '20px', letterSpacing: '2px' };
const labelStyle = { color: '#666', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px' };
const inputStyle = { padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '4px', outline: 'none' };
const submitBtn = { background: '#ed1d24', color: '#fff', border: 'none', padding: '15px', fontFamily: 'Impact', cursor: 'pointer', fontSize: '1.1rem', marginTop: '10px', transition: '0.3s' };
const errorBox = { background: 'rgba(237, 29, 36, 0.1)', color: '#ed1d24', padding: '10px', fontSize: '0.8rem', textAlign: 'center', border: '1px solid #ed1d24', marginBottom: '15px', fontWeight: 'bold' };

// Recovery Styles
const helpLinksContainer = { 
  marginTop: '20px', 
  display: 'flex', 
  justifyContent: 'center', 
  gap: '10px',
  borderTop: '1px solid #222',
  paddingTop: '15px'
};

const helpLink = { 
  color: '#ed1d24', 
  fontSize: '0.65rem', 
  textDecoration: 'none', 
  fontFamily: 'Arial, sans-serif', 
  fontWeight: 'bold',
  letterSpacing: '0.5px'
};

export default Login;
