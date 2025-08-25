import React from 'react';

function Menu({ onRestart }) {
  return (
    <div className="menu">
      <div className="menu-content">
        <div className="success-icon">🎉</div>
        <h2>Parabéns!</h2>
        <p>Você descobriu o agente de hoje!</p>
        <button onClick={onRestart} className="restart-button">
          <span className="restart-icon">🔄</span>
          Jogar Novamente
        </button>
      </div>
    </div>
  );
}

export default Menu;
