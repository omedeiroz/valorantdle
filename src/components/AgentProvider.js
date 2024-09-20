import React, { createContext, useState, useEffect } from 'react';

export const AgentContext = createContext();

const AgentProvider = ({ children }) => {

  const [agents, setAgents] = useState([]);

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
      } catch (error) {
        console.error('Erro ao buscar os agentes:', error);
      }
    };

    fetchAgents();
  }, []);

  return (
    <AgentContext.Provider value={{ agents }}>
      {children}
    </AgentContext.Provider>
  );
};

export default AgentProvider;
