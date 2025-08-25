import React from 'react';

function Menu({ onRestart, message, gameMode, onSwitchMode }) {
  const getButtonText = () => {
    if (gameMode === 'ability') {
      return 'Adivinhe a Habilidade';
    }
    return 'Adivinhe o Agente';
  };

  const getSwitchButtonText = () => {
    if (gameMode === 'ability') {
      return 'Adivinhe o Agente';
    }
    return 'Adivinhe a Habilidade';
  };

  const defaultMessage = gameMode === 'ability' 
    ? "Parabéns! Você descobriu qual agente tem esta habilidade!"
    : "Parabéns! Você descobriu o agente de hoje!";
  
  return (
    <div className="menu">
      <div className="menu-content">
        <div className="success-icon">🎉</div>
        <h2>Parabéns!</h2>
        <p>{message || defaultMessage}</p>
        <div className="menu-buttons">
          <button onClick={onRestart} className="restart-button">
            <span className="restart-icon">🔄</span>
            {getButtonText()}
          </button>
          <button onClick={onSwitchMode} className="switch-mode-button">
            <span className="switch-icon">🎯</span>
            {getSwitchButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Menu;
