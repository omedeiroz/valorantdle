import React, { useState, useContext, useEffect } from 'react';
import { AgentContext } from './AgentProvider';
import SearchBar from './SearchBar';
import GuessResult from './GuessResult';
import Menu from './Menu';

function GameManager() {
  const { agents } = useContext(AgentContext);
  const [randomAgent, setRandomAgent] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const selectRandomAgent = () => {
    const randomIndex = Math.floor(Math.random() * agents.length);
    setRandomAgent(agents[randomIndex]);
  };

  useEffect(() => {
    if (agents.length > 0) {
      selectRandomAgent();
    }
  }, [agents]);

  const handleSearch = (agentName) => {
    const foundAgent = agents.find(agent => agent.name.toLowerCase() === agentName.toLowerCase());
    
    if (foundAgent) {
      const isCorrect = foundAgent.name === randomAgent.name;

      const commomSkills = () => {
        let maxSkills = randomAgent.skill.length;
        let max = foundAgent.skill.length
        let contador = 0;
        foundAgent.skill.forEach(sk => {
          if (randomAgent.skill.includes(sk)) contador++;
        });        
      
        

        if (contador === maxSkills && maxSkills === max) return 'correct';
        if (contador > 0 ) return 'half-correct';
        if (contador === 0) return 'incorrect';
        
        return '';
      };
      
      const color = commomSkills()
  
      const newGuess = {
        name: foundAgent.name,
        role: foundAgent.role,
        imageUrl: foundAgent.imageUrl,
        nationality: foundAgent.nationality,
        gender: foundAgent.gender,
        skill: foundAgent.skill,
        color: color,
        correct: {
          name: isCorrect,
          imageUrl: foundAgent.imageUrl === randomAgent.imageUrl,
          role: foundAgent.role === randomAgent.role,
          nationality: foundAgent.nationality === randomAgent.nationality,
          gender: foundAgent.gender === randomAgent.gender,
          skill: foundAgent.skill.join() === randomAgent.skill.join()
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

  return (
    <>
      <SearchBar onSearch={handleSearch} guesses={guesses} isFinished={isFinished} agents={agents}/>
      {guesses.map((guess, index) => (
        <GuessResult key={index} guess={guess} />
      ))}
      {showMenu && <Menu onRestart={handleRestart} />}
    </>
  );
}

export default GameManager;
