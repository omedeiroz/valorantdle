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
  const [color, setColor] = useState('');

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
    "Gekko": "Usa",
    "Chamber": "French",
    "Neon": "Phillipines",
    "Deadlock": "Norway",
    "Vyse": "South Korea",
    "Iso": "Chinese",
    "Clove": "Scotland",
    "Reyna": "Mexican"
  };

  const gender = {
    "Brimstone": "Man",
    "Viper": "Women",
    "Omen": "Man",
    "Cypher": "Man",
    "Sova": "Man",
    "Jett": "Women",
    "Phoenix": "Man",
    "Sage": "Women",
    "Raze": "Women",
    "Killjoy": "Women",
    "Breach": "Man",
    "Yoru": "Man",
    "Astra": "Women",
    "KAY/O": "Man",
    "Skye": "Women",
    "Harbor": "Man",
    "Fade": "Women",
    "Gekko": "Man",
    "Chamber": "Man",
    "Neon": "Women",
    "Deadlock": "Women",
    "Vyse": "Women",
    "Iso": "Man",
    "Clove": "Non-Binary",
    "Reyna": "Women"
  };

  const skill = {
    "Brimstone": ["Molotov"],
    "Viper": ["Molotov"],
    "Omen": ["Bang"],
    "Cypher": ["Trap"],
    "Sova": ["Damage"],
    "Jett": ["None"],
    "Phoenix": ["Molotov", "Bang"],
    "Sage": ["None"],
    "Raze": ["Molotov"],
    "Killjoy": ["Molotov" , "Trap"],
    "Breach": ["Concussion" , "Molotov", "Bang"],
    "Yoru": ["None"],
    "Astra": ["Concussion"],
    "KAY/O": ["Molotov", "Bang"],
    "Skye": ["Bang", "Concussion"],
    "Harbor": ["None"],
    "Fade": ["Concussion"],
    "Gekko": ["Bang", "Molotov", "Concussion"],
    "Chamber": ["Trap"],
    "Neon": ["Concussion"],
    "Deadlock": ["Concussion", "Trap"],
    "Vyse": ["Bang", "Suppression"],
    "Iso": ["None"],
    "Clove": ["Suppression"],
    "Reyna": ["Bang"]
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
          gender: gender[agent.displayName],
          skill: skill[agent.displayName],
          nationality: nationalities[agent.displayName] || 'Unknown',
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
    console.log(randomAgent);
    const foundAgent = agents.find(agent => agent.name.toLowerCase() === agentName.toLowerCase());
    let contador = 0
    if (foundAgent) {
      const commomSkills = () => {
        let maxSkills = randomAgent.skill.length;
        let max = foundAgent.skill.length
        let contador = 0;
        foundAgent.skill.forEach(sk => {
          if (randomAgent.skill.includes(sk)) contador++;
        });        
      
        console.log(contador);
        

        if (contador === maxSkills && maxSkills === max) return 'correct';
        if (contador > 0 ) return 'half-correct';
        if (contador === 0) return 'incorrect';
        
        return '';
      };
      
      const color = commomSkills()
      console.log(color);

      const newGuess = {
        name: foundAgent.name,
        role: foundAgent.role,
        imageUrl: foundAgent.imageUrl,
        nationality: foundAgent.nationality,
        gender: foundAgent.gender,
        skill: skill[foundAgent.name],
        color: color,
        correct: {
          name: foundAgent.name === randomAgent.name,
          role: foundAgent.role === randomAgent.role,
          imageUrl: foundAgent.imageUrl === randomAgent.imageUrl,
          nationality: foundAgent.nationality === randomAgent.nationality,
          gender: foundAgent.gender === randomAgent.gender,
          skill: skill[foundAgent.name] === randomAgent.skill,
        }
      };

      setGuesses(prevGuesses => [newGuess, ...prevGuesses]);

      if (newGuess.correct.name) {
        setTimeout(() => {
          setShowMenu(true);
        }, 1000);
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
        <GuessResult key={index} guess={guess}/>
      ))}
      {showMenu && <Menu onRestart={handleRestart} />}
    </div>
  );
}

export default App;