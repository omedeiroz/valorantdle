import React from 'react';

function GameModeSelector({ onModeSelect, currentMode }) {
  return (
    <div className="mode-selector">
      <h2>Escolha o Modo de Jogo</h2>
      <div className="mode-buttons">
        <button 
          className={`mode-button ${currentMode === 'agent' ? 'active' : ''}`}
          onClick={() => onModeSelect('agent')}
        >
          <span className="mode-icon">🎯</span>
          <div className="mode-content">
            <h3>Modo Agente</h3>
            <p>Adivinhe o agente de Valorant de hoje!</p>
          </div>
        </button>
        
        <button 
          className={`mode-button ${currentMode === 'ability' ? 'active' : ''}`}
          onClick={() => onModeSelect('ability')}
        >
          <span className="mode-icon">⚡</span>
          <div className="mode-content">
            <h3>Modo Habilidade</h3>
            <p>Adivinhe qual agente tem esta habilidade!</p>
          </div>
        </button>
      </div>
    </div>
  );
}

export default GameModeSelector;
