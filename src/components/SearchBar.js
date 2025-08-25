import React, { useState } from 'react';

function SearchBar({ onSearch, guesses, isFinished, agents }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const guessedAgents = guesses.map(guess => guess.name.toLowerCase());

  const handleInputChange = (event) => {
    if (!isFinished) {
      const value = event.target.value;
      setInputValue(value);

      if (value.length > 0) {
        const filteredAgents = agents.filter(agent =>
          agent.name.toLowerCase().startsWith(value.toLowerCase()) &&
          !guessedAgents.includes(agent.name.toLowerCase())
        );
        setSuggestions(filteredAgents);
      } else {
        setSuggestions([]);
      }
    }
  };

  const handleSuggestionClick = (agentName) => {
    if (!isFinished) {
      setInputValue('');
      setSuggestions([]);
      onSearch(agentName);
    }
  };

  const handleSearch = () => {
    if (inputValue.trim() && !isFinished) {
      onSearch(inputValue.trim());
      setInputValue('');
      setSuggestions([]);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (suggestions.length > 0) {
        const firstSuggestion = suggestions[0];
        handleSuggestionClick(firstSuggestion.name);
      } else {
        handleSearch();
      }
    }
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <input
          type="text"
          value={inputValue}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          placeholder="Digite o nome do agente..."
          disabled={isFinished}
          className="search-input"
        />
        <button 
          onClick={handleSearch} 
          disabled={isFinished || !inputValue.trim()}
          className="search-button"
        >
          <span className="search-icon">🔍</span>
          Buscar
        </button>
      </div>
      
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((agent) => (
            <li key={agent.name} onClick={() => handleSuggestionClick(agent.name)}>
              <img src={agent.imageUrl} alt={agent.name} />
              <span>{agent.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
