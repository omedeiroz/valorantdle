import React from 'react';


function AgentCard({ guess, color }) {  
  return (
    <div className="agent-card">
      <div className={`guess-box ${guess.correct.imageUrl ? 'correct' : 'incorrect'} `}>
        <img id="agent" src={guess.imageUrl} alt={`${guess.name}`} />
      </div>
      <div className={`guess-box ${guess.correct.name ? 'correct' : 'incorrect'}`}>
        {guess.name}
      </div>
      <div className={`guess-box ${guess.correct.gender ? 'correct' : 'incorrect'}`}>
        {guess.gender}
      </div>
      <div className={`guess-box ${guess.correct.role ? 'correct' : 'incorrect'}`}>
        {guess.role}
      </div>
      <div className={`guess-box skill-box ${guess.skill.length > 1 ? 'column' : 'row'} ${color}`}>
        {guess.skill}
      </div>
      <div className={`guess-box ${guess.correct.nationality ? 'correct' : 'incorrect'} nacionality`}>
        {guess.nationality}
      </div>
    </div>
  );
}

export default AgentCard;