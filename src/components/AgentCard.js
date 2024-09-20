import React from 'react';

function AgentCard({ guess }) {

  console.log(guess.correct.imageUrl)
  
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
      <div className={`guess-box skill-box ${guess.color}`}>
        <div className="skill-container">
          {guess.skill.map((skill, index) => (
            <div key={index} className="skill-item">{skill}</div>
          ))}
        </div>
      </div>
      <div className={`guess-box ${guess.correct.nationality ? 'correct' : 'incorrect'} nacionality`}>
        {guess.nationality}
      </div>
    </div>
  );
}

export default AgentCard;
