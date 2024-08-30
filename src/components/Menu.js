import React from 'react';


function Menu({ onRestart }) {
  return (
    <div className="menu">
      <p>Parabéns! Você acertou o agente!</p>
      <button onClick={onRestart}>Reiniciar</button>
    </div>
  );
}

export default Menu;