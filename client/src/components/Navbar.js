import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={navStyle}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div style={logoSection}>
          <div style={marvelBox}>MARVEL</div>
          <div style={hubText}>MULTIVERSE</div>
          <div style={marvelBox}>PORTAL</div>
        </div>
      </Link>

      <div style={navLinks}>
        <Link to="/" style={linkStyle}>DATABASE</Link>
        <Link to="/mcu" style={linkStyle}>MCU 2026</Link>
        <Link to="/casting" style={linkStyle}>CASTING</Link>
        <Link to="/theories" style={linkStyle}>THEORIES</Link>
        <Link to="/comparison" style={linkStyle}>COMPARISON</Link>
        <Link to="/Favorites" style={linkStyle}>SQUADS</Link>
      </div>

      <div style={authSection}>
        {user ? (
          <div style={userWrapper}>
            {/* NEW: Profile Picture Link to Settings */}
            <Link to="/settings" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img 
                src={user.profilePic || 'https://via.placeholder.com/30'} 
                alt="Agent Avatar" 
                style={navAvatarStyle} 
              />
            </Link>

            <motion.span 
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={agentStatus}
            >
              ● AGENT: {user.username.toUpperCase()}
            </motion.span>
            
            <button onClick={logout} style={logoutBtn}>LOGOUT</button>
          </div>
        ) : (
          <div style={authButtons}>
            <Link to="/register" style={registerBtn}>ENLIST</Link>
            <Link to="/login" style={loginBtn}>SIGN IN</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

// --- Styles ---
const navStyle = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  padding: '15px 40px', 
  background: '#000', 
  borderBottom: '3px solid #ed1d24',
  position: 'sticky',
  top: 0,
  zIndex: 1000 
};

const logoSection = { display: 'flex', alignItems: 'center', gap: '5px' };
const marvelBox = { background: '#ed1d24', color: '#fff', padding: '2px 8px', fontFamily: 'Impact', fontSize: '1.8rem' };
const hubText = { color: '#fff', fontFamily: 'Impact', fontSize: '1.8rem', fontStyle: 'italic' };
const navLinks = { display: 'flex', gap: '25px' };
const linkStyle = { color: '#fff', textDecoration: 'none', fontFamily: 'Impact', fontSize: '1rem', letterSpacing: '1px', transition: 'color 0.3s' };
const authSection = { display: 'flex', alignItems: 'center' };
const authButtons = { display: 'flex', alignItems: 'center', gap: '15px' };
const userWrapper = { display: 'flex', alignItems: 'center', gap: '15px' };
const agentStatus = { color: '#ed1d24', fontFamily: 'Impact', fontSize: '0.9rem', letterSpacing: '1px' };
const logoutBtn = { background: 'transparent', border: '1px solid #ed1d24', color: '#fff', padding: '5px 15px', fontFamily: 'Impact', cursor: 'pointer', transition: '0.3s' };
const loginBtn = { background: '#ed1d24', color: '#fff', padding: '8px 20px', textDecoration: 'none', fontFamily: 'Impact', borderRadius: '2px', fontSize: '0.9rem' };
const registerBtn = { color: '#fff', textDecoration: 'none', fontFamily: 'Impact', fontSize: '0.9rem', letterSpacing: '1px', borderBottom: '1px solid transparent', transition: '0.3s' };

// NEW: Style for the Avatar in the Navbar
const navAvatarStyle = {
  width: '35px',
  height: '35px',
  borderRadius: '50%',
  border: '2px solid #ed1d24',
  objectFit: 'cover',
  cursor: 'pointer',
  transition: '0.3s'
};

export default Navbar;
