import React from 'react';


function AgentCard({ guess }) {
  return (
    <div className="agent-card">
      <div className={`guess-box ${guess.correct.imageUrl ? 'correct' : 'incorrect'}`}>
        <img src={guess.imageUrl} alt={`${guess.name}`} />
      </div>
      <div className={`guess-box ${guess.correct.name ? 'correct' : 'incorrect'}`}>
        {guess.name}
      </div>
      <div className={`guess-box ${guess.correct.role ? 'correct' : 'incorrect'}`}>
        {guess.role}
      </div>
      <div className={`guess-box ${guess.correct.nationality ? 'correct' : 'incorrect'} nacionality`}>
        {guess.nationality}
      </div>
      <div className={`guess-box ${guess.correct.abilities ? 'correct' : 'incorrect'}`}>
        <div className="ability-container">
          {guess.abilities.map((ability, index) => (
            <img key={index} src={ability.imageUrl} alt={ability.name} className="ability-icon" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AgentCard;