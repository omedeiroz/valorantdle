import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import GuessResult from './components/GuessResult';
import Menu from './components/Menu';
import "./App.css";

function App() {
  const [agents, setAgents] = useState([]);
  const [randomAgent, setRandomAgent] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  
  const nationalities = {
    "Brimstone": "Usa",
    "Viper": "Usa",
    "Omen": "Shadow",
    "Cypher": "Morroco",
    "Sova": "Russia",
    "Jett": "South Korea",
    "Phoenix": "United Kingdom",
    "Sage": "Chinese",
    "Raze": "Brazil",
    "Killjoy": "Germany",
    "Breach": "Sweden",
    "Yoru": "Japan",
    "Astra": "Ghana",
    "KAY/O": "Robot",
    "Skye": "Australian",
    "Harbor": "India",
    "Fade": "Turkey",
    "Gekko": "🇲🇽",
    "Chamber": "French",
    "Neon": "Phillipines",
    "Deadlock": "Norway",
    "Vyse": "South Korea"
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

      setGuesses(prevGuesses => [newGuess, ...prevGuesses]);
      

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
      <SearchBar agents={agents} onSearch={handleSearch} guesses={guesses}/>
      {guesses.map((guess, index) => (
        <GuessResult key={index} guess={guess} />
      ))}
      {showMenu && <Menu onRestart={handleRestart} />}
    </div>
  );
}

export default App;