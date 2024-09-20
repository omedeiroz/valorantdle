import React from 'react';
import AgentCard from './AgentCard';

function GuessResult({ guess }) {
  return (
    <div className="guess-result">
      <AgentCard guess={guess} />
    </div>
  );
}

export default GuessResult;
