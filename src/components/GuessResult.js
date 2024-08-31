import React from 'react';
import AgentCard from './AgentCard';


function GuessResult({ guess, color }) { 
  return (
    <div className="guess-result">
      <AgentCard guess={guess} color={color}/>
    </div>
  );
}

export default GuessResult;