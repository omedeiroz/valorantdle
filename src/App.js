import React from 'react';
import './App.css';
import AgentProvider from './components/AgentProvider';
import GameManager from './components/GameManager';

function App() {
  return (
    <div className="app">
      <AgentProvider>
        <GameManager />
      </AgentProvider>
    </div>
  );
}

export default App;
