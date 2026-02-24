import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  
  const API_KEY = '4ec9a9a9220db9bb16091fbf9cf1ba53';

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=videos,credits`
        );
        setMovie(res.data);
        const trailer = res.data.videos.results.find(v => v.type === "Trailer" && v.site === "YouTube");
        setTrailerKey(trailer ? trailer.key : null);
      } catch (err) { console.error(err); }
    };
    fetchMovieData();
    window.scrollTo(0, 0);
  }, [id]);

  if (!movie) return <div style={loadingStyle}>DECRYPTING MISSION DATA...</div>;

  return (
    <div style={container}>
      {/* 1. CINEMATIC BACKGROUND LAYER */}
      <div style={bgWrapper}>
        {trailerKey ? (
          <iframe
            style={videoBg}
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}&modestbranding=1&rel=0`}
            allow="autoplay; encrypted-media"
            title="bg"
          />
        ) : (
          <img src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} style={videoBg} alt="bg" />
        )}
        {/* Visual Fix: This creates a soft 'stage' for the text without turning the whole screen black */}
        <div style={vignette}></div>
      </div>

      {/* 2. MISSION DATA LAYER */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }} 
        animate={{ opacity: 1, x: 0 }} 
        style={contentBox}
      >
        <button onClick={() => navigate(-1)} style={backBtn}>
          <span style={{color: '#ed1d24'}}>←</span> RETURN TO DATABASE
        </button>
        
        {/* Visual Fix: High Contrast White Title with 'Pop' Shadow */}
        <h1 style={titleStyle}>{movie.title.toUpperCase()}</h1>
        
        <div style={metaRow}>
          <span style={yearBadge}>{movie.release_date?.split('-')[0]}</span>
          <span style={metaItem}>{movie.runtime} MINS</span>
          <span style={ratingBadge}>⭐ {movie.vote_average?.toFixed(1)}</span>
        </div>

        <div style={infoGroup}>
          <h3 style={label}>MISSION SYNOPSIS</h3>
          <p style={description}>{movie.overview}</p>
        </div>

        <div style={infoGroup}>
          <h3 style={label}>ACTIVE AGENTS</h3>
          <div style={castRow}>
            {movie.credits?.cast.slice(0, 5).map(actor => (
              <div key={actor.id} style={actorUnit}>
                <div style={imgFrame}>
                  <img 
                    src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://via.placeholder.com/60'} 
                    style={actorThumb} 
                    alt={actor.name} 
                  />
                </div>
                <p style={actorName}>{actor.name.split(' ')[0]}</p>
              </div>
            ))}
          </div>
        </div>

        <button style={ctaBtn}>ADD TO SQUAD</button>
      </motion.div>
    </div>
  );
};

// --- STYLES: BALANCED FOR VISIBILITY & ALIGNMENT ---
const container = { 
  position: 'relative', 
  width: '100%', 
  height: '100vh', 
  background: '#050505', 
  overflow: 'hidden' 
};

const bgWrapper = { 
  position: 'absolute', 
  top: 0, 
  right: 0, 
  width: '100%', 
  height: '100%', 
  zIndex: 1 
};

const videoBg = { 
  width: '100vw', 
  height: '100vh', 
  objectFit: 'cover', 
  border: 'none', 
  opacity: 0.7 
};

const vignette = { 
  position: 'absolute', 
  top: 0, 
  left: 0, 
  width: '100%', 
  height: '100%', 
  background: 'linear-gradient(90deg, rgba(5,5,5,1) 0%, rgba(5,5,5,0.8) 25%, rgba(5,5,5,0) 70%)' 
};

const contentBox = { 
  position: 'relative', 
  zIndex: 10, 
  padding: '60px 5% 40px 80px', // Spacing fix: pushes text away from screen edge
  maxWidth: '800px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: '100%'
};

const backBtn = { 
  background: 'none', 
  border: 'none', 
  color: '#fff', 
  fontFamily: 'Impact', 
  fontSize: '0.8rem', 
  cursor: 'pointer', 
  marginBottom: '20px', 
  letterSpacing: '2px',
  opacity: 0.6
};

const titleStyle = { 
  fontFamily: 'Impact', 
  fontSize: 'clamp(2.5rem, 7vw, 5rem)', 
  color: '#FFFFFF', // High Visibility
  lineHeight: '0.9', 
  marginBottom: '20px', 
  letterSpacing: '1px',
  textShadow: '0 0 15px rgba(0,0,0,1), 2px 2px 5px rgba(0,0,0,1)' // Pop fix: creates an 'outline'
};

const metaRow = { 
  display: 'flex', 
  gap: '20px', 
  alignItems: 'center', 
  marginBottom: '35px', 
  fontFamily: 'Impact' 
};

const yearBadge = { background: '#ed1d24', padding: '2px 12px', color: '#fff', fontSize: '1.1rem' };
const metaItem = { color: '#888', fontSize: '1.1rem' };
const ratingBadge = { color: '#f5c518', fontSize: '1.1rem' };

const infoGroup = { marginBottom: '30px' };
const label = { color: '#ed1d24', fontFamily: 'Impact', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '10px' };

const description = { 
  fontSize: '1.1rem', 
  lineHeight: '1.6', 
  color: '#ddd', 
  maxWidth: '600px',
  textShadow: '1px 1px 2px rgba(0,0,0,0.8)' 
};

const castRow = { display: 'flex', gap: '15px' };
const actorUnit = { textAlign: 'center', width: '70px' };
const imgFrame = { width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #ed1d24', overflow: 'hidden', marginBottom: '5px' };
const actorThumb = { width: '100%', height: '100%', objectFit: 'cover' };
const actorName = { fontSize: '0.75rem', color: '#fff', opacity: 0.8 };

const ctaBtn = { 
  width: 'fit-content',
  padding: '14px 40px', 
  background: '#ed1d24', 
  color: '#fff', 
  border: 'none', 
  fontFamily: 'Impact', 
  fontSize: '1.1rem', 
  transform: 'skewX(-10deg)', 
  cursor: 'pointer',
  transition: '0.3s'
};

const loadingStyle = { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#050505', color: '#ed1d24', fontFamily: 'Impact', fontSize: '2rem' };

export default MovieDetails;
