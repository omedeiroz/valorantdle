import React, { useState } from 'react';


function SearchBar({ agents, onSearch, guesses, isFinished }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [firstSuggestion, setFirstSuggestion] = useState('');

  const guessedAgents = guesses.map(guess => guess.name.toLowerCase());

  
    const handleInputChange = (event) => {
      console.log(isFinished);
      if(!isFinished){
      const value = event.target.value;
      setInputValue(value);
  
      if (value.length > 0) {
        const filteredAgents = agents.filter(agent =>
          agent.name.toLowerCase().startsWith(value.toLowerCase()) &&
          !guessedAgents.includes(agent.name.toLowerCase())
        );
        setSuggestions(filteredAgents);
        setFirstSuggestion(filteredAgents[0]?.name || '');
      } else {
        setSuggestions([]);
        setFirstSuggestion('');
      }
  }
}
  ;

  const handleSuggestionClick = (agentName) => {
    if(!isFinished){
      setInputValue('');
      setSuggestions([]);
      onSearch(agentName);
    }
  };

  const handleKeyDown = (event) => {
    if(!isFinished){
    if (event.key === 'Enter') {
      if (firstSuggestion) {
        setInputValue('');
        onSearch(firstSuggestion);
        setSuggestions([]);
        setFirstSuggestion('');
      }
    }
  }
}

  return (
    <div className="search-bar">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Digite o nome do agente"
      />
      <button onClick={() => onSearch(inputValue)}>Buscar</button>
      <ul className="suggestions">
        {suggestions.map((agent) => (
          <li key={agent.name} onClick={() => handleSuggestionClick(agent.name)}>
            <img src={agent.imageUrl} alt={agent.name} />
            <span>{agent.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchBar;