import React from 'react';

function AgentCard({ guess }) {



  return (
    <div className="agent-card-container">
      <div className="info-row">
        <div className="info-item">Agente</div>
        <div className="info-item">Nome</div>
        <div className="info-item">Sexo</div>
        <div className="info-item">Posição</div>
        <div className="info-item">Habilidade</div>
        <div className="info-item">Nacionalidade</div>
      </div>

      <div className="agent-card">
        <div className={`guess-box spin-delay-1 ${guess.correct.imageUrl ? 'correct' : 'incorrect'} `}>
          <img id="agent" src={guess.imageUrl} alt={`${guess.name}`} />
        </div>
        <div className={`guess-box spin-delay-2 ${guess.correct.name ? 'correct' : 'incorrect'}`}>
          {guess.name}
        </div>
        <div className={`guess-box spin-delay-3 ${guess.correct.gender ? 'correct' : 'incorrect'}`}>
          {guess.gender}
        </div>
        <div className={`guess-box spin-delay-4 ${guess.correct.role ? 'correct' : 'incorrect'}`}>
          {guess.role}
        </div>
        <div className={`guess-box skill-box spin-delay-5 ${guess.color}`}>
          <div className="skill-container">
            {guess.skill.map((skill, index) => (
              <div key={index} className="skill-item">{skill}</div>
            ))}
          </div>
        </div>
        <div className={`guess-box spin-delay-6 ${guess.correct.nationality ? 'correct' : 'incorrect'} nationality`}>
          {guess.nationality}
        </div>
      </div>
    </div>
  );
}

export default AgentCard;
