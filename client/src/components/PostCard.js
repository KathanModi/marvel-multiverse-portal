import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CharacterCard = ({ character }) => {
  const { user, token } = useContext(AuthContext);

  const handleAddFavorite = () => {
    if (!token) {
      alert('Please login to add favorites');
      return;
    }
    // Add favorite logic here
  };

  return (
    <div className="character-card">
      <img src={character.image} alt={character.name} />
      <h3>{character.name}</h3>
      <p className="universe">{character.universe}</p>
      <p className="alignment">{character.alignment}</p>
      <div className="card-actions">
        <Link to={`/character/${character._id}`}>View Details</Link>
        <button onClick={handleAddFavorite}>❤️ Favorite</button>
      </div>
    </div>
  );
};

export default CharacterCard;