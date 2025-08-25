import React from 'react';

function AgentCard({ guess }) {
  return (
    <div className="agent-card-container">
      <div className="agent-header">
        <div className="agent-image">
          <img src={guess.imageUrl} alt={`${guess.name}`} />
        </div>
        <div className="agent-name">{guess.name}</div>
      </div>
      
      <div className="comparison-table">
        <div className="table-header">
          <div className="header-cell">Agente</div>
          <div className="header-cell">Gênero</div>
          <div className="header-cell">Posição</div>
          <div className="header-cell">Ano de Fabricação</div>
        </div>
        
        <div className="table-row">
          <div className={`table-cell agent-cell ${guess.correct.imageUrl ? 'correct' : 'incorrect'}`}>
            <img src={guess.imageUrl} alt={`${guess.name}`} />
          </div>
          <div className={`table-cell ${guess.correct.gender ? 'correct' : 'incorrect'}`}>
            {guess.gender}
          </div>
          <div className={`table-cell ${guess.correct.role ? 'correct' : 'incorrect'}`}>
            {guess.role}
          </div>
          <div className={`table-cell year-cell ${guess.correct.releaseYear ? 'correct' : 'incorrect'}`}>
            {guess.releaseYear}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentCard;
