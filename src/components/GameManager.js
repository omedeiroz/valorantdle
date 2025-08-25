import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AgentContext } from './AgentProvider';
import SearchBar from './SearchBar';
import GuessResult from './GuessResult';
import Menu from './Menu';
import GameModeSelector from './GameModeSelector';
import AbilityGame from './AbilityGame';

function GameManager() {
  const { agents, loading, error } = useContext(AgentContext);
  const [gameMode, setGameMode] = useState('agent'); // 'agent' ou 'ability'
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
    if (agents && agents.length > 0 && gameMode === 'agent') {
      selectRandomAgent();
    }
  }, [agents, selectRandomAgent, gameMode]);

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
    if (gameMode === 'agent') {
      selectRandomAgent();
    }
    setGuesses([]);
    setShowMenu(false);
  };

  const handleModeSelect = (mode) => {
    console.log('Trocando para modo:', mode);
    setGameMode(mode);
    setGuesses([]);
    setShowMenu(false);
    setIsFinished(false);
    setRandomAgent(null);
  };

  // Tela de carregamento
  if (loading) {
    return (
      <div className="game-container">
        <div className="game-header">
          <h1>Valorant Game</h1>
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
          <h1>Valorant Game</h1>
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
          <h1>Valorant Game</h1>
          <div className="loading-message">
            <span className="stat-icon">⏳</span>
            Nenhum agente encontrado. Tente recarregar a página.
          </div>
        </div>
      </div>
    );
  }

  // Seletor de modo
  if (!gameMode) {
    return (
      <div className="game-container">
        <GameModeSelector onModeSelect={handleModeSelect} currentMode={gameMode} />
      </div>
    );
  }

  // Modo de habilidade
  if (gameMode === 'ability') {
    return (
      <AbilityGame 
        agents={agents} 
        onBackToModeSelect={() => handleModeSelect(null)} 
      />
    );
  }

  // Modo de agente (padrão)
  return (
    <div className="game-container">
      <div className="game-header">
        <div className="header-content">
          <button onClick={() => handleModeSelect(null)} className="back-button">
            ← Voltar aos Modos
          </button>
          <h1>Adivinhe o agente de Valorant de hoje!</h1>
        </div>
      </div>

      <SearchBar onSearch={handleSearch} guesses={guesses} isFinished={isFinished} agents={agents}/>
      
      {guesses.map((guess, index) => (
        <GuessResult key={index} guess={guess} />
      ))}
      
      {showMenu && <Menu onRestart={handleRestart} gameMode={gameMode} onSwitchMode={() => {
        console.log('Tentando trocar modo. Modo atual:', gameMode);
        const newMode = gameMode === 'agent' ? 'ability' : 'agent';
        console.log('Novo modo:', newMode);
        handleModeSelect(newMode);
      }} />}
    </div>
  );
}

export default GameManager;
