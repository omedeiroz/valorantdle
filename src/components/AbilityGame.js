import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from './SearchBar';
import GuessResult from './GuessResult';
import Menu from './Menu';

function AbilityGame({ agents, onBackToModeSelect }) {
  const [randomAbility, setRandomAbility] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const selectRandomAbility = useCallback(() => {
    if (!agents || agents.length === 0) return;
    
    // Seleciona um agente aleatório
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    
    // Seleciona uma habilidade aleatória desse agente
    if (randomAgent.abilities && randomAgent.abilities.length > 0) {
      const randomAbilityIndex = Math.floor(Math.random() * randomAgent.abilities.length);
      const ability = randomAgent.abilities[randomAbilityIndex];
      
      setRandomAbility({
        ...ability,
        agentName: randomAgent.name,
        agentRole: randomAgent.role,
        agentGender: randomAgent.gender,
        agentReleaseYear: randomAgent.releaseYear
      });
    }
  }, [agents]);

  useEffect(() => {
    if (agents && agents.length > 0) {
      selectRandomAbility();
    }
  }, [agents, selectRandomAbility]);

  // Mostrar dica automaticamente após 5 tentativas
  useEffect(() => {
    if (guesses.length >= 5 && !showHint) {
      setShowHint(true);
    }
  }, [guesses.length, showHint]);

  const handleSearch = (agentName) => {
    if (!randomAbility || !agents) return;
    
    const foundAgent = agents.find(agent => agent.name.toLowerCase() === agentName.toLowerCase());
    
    if (foundAgent) {
      const isCorrect = foundAgent.name === randomAbility.agentName;

      const newGuess = {
        name: foundAgent.name,
        role: foundAgent.role || 'Desconhecido',
        imageUrl: foundAgent.imageUrl,
        gender: foundAgent.gender || 'Desconhecido',
        releaseYear: foundAgent.releaseYear || 'Desconhecido',
        correct: {
          name: isCorrect,
          imageUrl: foundAgent.name === randomAbility.agentName,
          role: foundAgent.role === randomAbility.agentRole,
          gender: foundAgent.gender === randomAbility.agentGender,
          releaseYear: foundAgent.releaseYear === randomAbility.agentReleaseYear
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
    // NÃO chama selectRandomAbility aqui - mantém a mesma habilidade
    setGuesses([]);
    setShowMenu(false);
    setShowHint(false);
  };

  const handleBackToModeSelect = () => {
    onBackToModeSelect();
  };

  if (!randomAbility) {
    return (
      <div className="game-container">
        <div className="loading-message">
          <span className="stat-icon">⏳</span>
          Carregando habilidade...
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="header-content">
          <button onClick={handleBackToModeSelect} className="back-button">
            ← Voltar aos Modos
          </button>
          <h1>Qual agente tem esta habilidade?</h1>
        </div>
      </div>

      <div className="ability-display">
        <div className="ability-card">
          <div className="ability-image-container">
            <img 
              src={randomAbility.imageUrl} 
              alt={randomAbility.name}
              className={`ability-image ${showHint ? '' : 'flipped'}`}
            />
            {!showHint && (
              <div className="flip-overlay">
                <span>Dica disponível após 5 tentativas</span>
              </div>
            )}
          </div>
          <div className="ability-info">
            <h3>{showHint ? randomAbility.name : 'Habilidade Secreta'}</h3>
            {showHint && (
              <p className="ability-description">{randomAbility.description}</p>
            )}
          </div>
          {!showHint && (
            <div className="hint-counter">
              <span className="hint-icon">⏳</span>
              Dica disponível em {Math.max(0, 5 - guesses.length)} tentativas
            </div>
          )}
        </div>
      </div>

      <SearchBar onSearch={handleSearch} guesses={guesses} isFinished={isFinished} agents={agents}/>
      
      {guesses.map((guess, index) => (
        <GuessResult key={index} guess={guess} />
      ))}
      
      {showMenu && (
        <Menu 
          onRestart={handleRestart} 
          message={`Parabéns! Você descobriu que a habilidade "${randomAbility.name}" pertence ao agente ${randomAbility.agentName}!`}
          gameMode="ability"
          onSwitchMode={() => {
            // Limpar estado e voltar para seleção de modo
            setGuesses([]);
            setShowMenu(false);
            setIsFinished(false);
            setRandomAbility(null);
            onBackToModeSelect();
          }}
        />
      )}
    </div>
  );
}

export default AbilityGame;
