import React, { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import GuessResult from './components/GuessResult';
import './App.css';

function App() {
  const [agents, setAgents] = useState([]);
  const [randomAgent, setRandomAgent] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  const nationalities = {
    "Brimstone": "🇺🇸",
    "Viper": "🇺🇸",
    "Omen": "Sombras",
    "Cypher": "🇲🇦",
    "Sova": "🇷🇺",
    "Jett": "🇰🇷",
    "Phoenix": "🇬🇧",
    "Sage": "🇨🇳",
    "Raze": "🇧🇷",
    "Killjoy": "🇩🇪",
    "Breach": "🇸🇪",
    "Yoru": "🇯🇵",
    "Astra": "🇳🇬",
    "KAY/O": "🇺🇸",
    "Skye": "🇦🇺",
    "Harbor": "🇮🇳",
    "Fade": "🇹🇷",
    "Gekko": "🇲🇽"
  };

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true');
        const data = await response.json();
        const agentsData = data.data.map(agent => ({
          name: agent.displayName,
          role: agent.role?.displayName,
          imageUrl: agent.displayIcon,
          nationality: nationalities[agent.displayName] || 'Unknown',
          abilities: agent.abilities.slice(0, 4).map(ability => ({
            name: ability.displayName,
            imageUrl: ability.displayIcon
          })),
        }));
        setAgents(agentsData);
        const randomIndex = Math.floor(Math.random() * agentsData.length);
        setRandomAgent(agentsData[randomIndex]);
      } catch (error) {
        console.error('Erro ao buscar os agentes:', error);
      }
    };

    fetchAgents();
  }, []);

  const handleSearch = (agentName) => {
    const foundAgent = agents.find(agent => agent.name.toLowerCase() === agentName.toLowerCase());
    if (foundAgent) {
      const newGuess = {
        name: foundAgent.name,
        role: foundAgent.role,
        imageUrl: foundAgent.imageUrl,
        nationality: foundAgent.nationality,
        abilities: foundAgent.abilities,
        correct: {
          name: foundAgent.name === randomAgent.name,
          role: foundAgent.role === randomAgent.role,
          imageUrl: foundAgent.imageUrl === randomAgent.imageUrl,
          nationality: foundAgent.nationality === randomAgent.nationality,
          abilities: foundAgent.abilities.every((ability, index) =>
            ability.imageUrl === randomAgent.abilities[index].imageUrl
          )
        }
      };
      setGuesses(prevGuesses => [newGuess, ...prevGuesses]); // Adiciona o novo palpite no início

      if (newGuess.correct.name) {
        setTimeout(() => {
          setShowMenu(true);
        }, 3000);
      }
    }
  };

  const handleRestart = () => {
    const randomIndex = Math.floor(Math.random() * agents.length);
    setRandomAgent(agents[randomIndex]);
    setGuesses([]);
    setShowMenu(false);
  };

  return (
    <div className="app">
      <SearchBar agents={agents} onSearch={handleSearch} />
      {guesses.map((guess, index) => (
        <GuessResult key={index} guess={guess} />
      ))}

      {showMenu && (
        <div className="menu">
          <p>Parabéns! Você acertou o agente!</p>
          <button onClick={handleRestart}>Reiniciar</button>
        </div>
      )}
    </div>
  );
}

export default App;
