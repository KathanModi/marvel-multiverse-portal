import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      layout // Smoothly slides when sorting
      layoutId={`bg-${movie.id}`} // Links to the Details Background
      onClick={() => navigate(`/movie/${movie.id}`)}
      whileHover={{ scale: 1.05 }}
      style={cardStyle}
    >
      <motion.img
        layoutId={`image-${movie.id}`} // Links to the Details Image
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        style={imgStyle}
      />
      <div style={cardOverlay}>
        <h3 style={cardTitle}>{movie.title}</h3>
      </div>
    </motion.div>
  );
};

const cardStyle = { position: 'relative', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', background: '#111' };
const imgStyle = { width: '100%', height: 'auto', display: 'block' };
const cardOverlay = { position: 'absolute', bottom: 0, width: '100%', padding: '10px', background: 'linear-gradient(transparent, black)' };
const cardTitle = { color: 'white', fontSize: '0.9rem', fontFamily: 'Impact' };

export default MovieCard;