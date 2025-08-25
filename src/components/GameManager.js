import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AgentContext } from './AgentProvider';
import SearchBar from './SearchBar';
import GuessResult from './GuessResult';
import Menu from './Menu';

function GameManager() {
  const { agents, loading, error } = useContext(AgentContext);
  const [randomAgent, setRandomAgent] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const selectRandomAgent = useCallback(() => {
    if (!agents || agents.length === 0) return;
    const randomIndex = Math.floor(Math.random() * agents.length);
    setRandomAgent(agents[randomIndex]);
  }, [agents]);

  useEffect(() => {
    if (agents && agents.length > 0) {
      selectRandomAgent();
    }
  }, [agents, selectRandomAgent]);

  const handleSearch = (agentName) => {
    if (!randomAgent || !agents) return;
    
    const foundAgent = agents.find(agent => agent.name.toLowerCase() === agentName.toLowerCase());
    
    if (foundAgent) {
      const isCorrect = foundAgent.name === randomAgent.name;

      const newGuess = {
        name: foundAgent.name,
        role: foundAgent.role || 'Desconhecido',
        imageUrl: foundAgent.imageUrl,
        gender: foundAgent.gender || 'Desconhecido',
        releaseYear: foundAgent.releaseYear || 'Desconhecido',
        correct: {
          name: isCorrect,
          imageUrl: foundAgent.name === randomAgent.name,
          role: foundAgent.role === randomAgent.role,
          gender: foundAgent.gender === randomAgent.gender,
          releaseYear: foundAgent.releaseYear === randomAgent.releaseYear
        }
      };
    
    
      setGuesses(prevGuesses => [newGuess, ...prevGuesses]);

      if (isCorrect) {
        setIsFinished(true);
        setTimeout(() => {
          setShowMenu(true);
        }, 1000);
      }
    }
  };

  const handleRestart = () => {
    setIsFinished(false);
    selectRandomAgent();
    setGuesses([]);
    setShowMenu(false);
  };

  // Tela de carregamento
  if (loading) {
    return (
      <div className="game-container">
        <div className="game-header">
          <h1>Adivinhe o agente de Valorant de hoje!</h1>
          <div className="loading-message">
            <span className="stat-icon">⏳</span>
            Carregando agentes da API do Valorant...
          </div>
        </div>
      </div>
    );
  }

  // Tela de erro
  if (error) {
    return (
      <div className="game-container">
        <div className="game-header">
          <h1>Adivinhe o agente de Valorant de hoje!</h1>
          <div className="error-message">
            <span className="stat-icon">❌</span>
            {error}
            <button 
              onClick={() => window.location.reload()} 
              className="retry-button"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Verificação de segurança para agents
  if (!agents || agents.length === 0) {
    return (
      <div className="game-container">
        <div className="game-header">
          <h1>Adivinhe o agente de Valorant de hoje!</h1>
          <div className="loading-message">
            <span className="stat-icon">⏳</span>
            Nenhum agente encontrado. Tente recarregar a página.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Adivinhe o agente de Valorant de hoje!</h1>
      </div>

      <SearchBar onSearch={handleSearch} guesses={guesses} isFinished={isFinished} agents={agents}/>
      
      {guesses.map((guess, index) => (
        <GuessResult key={index} guess={guess} />
      ))}
      
      {showMenu && <Menu onRestart={handleRestart} />}
    </div>
  );
}

export default GameManager;
