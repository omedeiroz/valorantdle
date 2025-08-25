import React, { createContext, useState, useEffect } from 'react';

export const AgentContext = createContext();

const AgentProvider = ({ children }) => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Anos corretos de lançamento baseados na cronologia oficial
  const getReleaseYear = (agentName) => {
    const releaseYears = {
      // 2020 - Agentes originais e primeiros lançamentos
      "Brimstone": "2020", "Viper": "2020", "Omen": "2020", "Cypher": "2020", 
      "Sova": "2020", "Sage": "2020", "Phoenix": "2020", "Jett": "2020", 
      "Raze": "2020", "Breach": "2020", "Reyna": "2020", "Killjoy": "2020", "Skye": "2020",
      
      // 2021
      "Yoru": "2021", "Astra": "2021", "KAY/O": "2021", "Chamber": "2021",
      
      // 2022
      "Neon": "2022", "Fade": "2022", "Harbor": "2022",
      
      // 2023
      "Gekko": "2023", "Deadlock": "2023", "Iso": "2023",
      
      // 2024
      "Clove": "2024", "Vyse": "2024",
      
      // 2025
      "Tejo": "2025", "Waylay": "2025"
    };
    
    return releaseYears[agentName] || 'Desconhecido';
  };

  // Gêneros corretos baseados nas listas fornecidas
  const getGender = (agentName) => {
    const genders = {
      // Femininas (13)
      "Viper": "Feminina", "Killjoy": "Feminina", "Sage": "Feminina", "Jett": "Feminina",
      "Reyna": "Feminina", "Raze": "Feminina", "Skye": "Feminina", "Astra": "Feminina",
      "Neon": "Feminina", "Fade": "Feminina", "Deadlock": "Feminina", "Vyse": "Feminina", "Waylay": "Feminina",
      
      // Masculinos (13)
      "Brimstone": "Masculino", "Omen": "Masculino", "Cypher": "Masculino", "Sova": "Masculino",
      "Phoenix": "Masculino", "Breach": "Masculino", "Yoru": "Masculino", "KAY/O": "Masculino",
      "Chamber": "Masculino", "Harbor": "Masculino", "Gekko": "Masculino", "Iso": "Masculino", "Tejo": "Masculino",
      
      // Não-Binárie (1)
      "Clove": "Não-Binárie"
    };
    
    return genders[agentName] || 'Desconhecido';
  };

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Usando a API oficial do Valorant
        const response = await fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.data || !Array.isArray(data.data)) {
          throw new Error('Formato de dados inválido da API');
        }

        const agentsData = data.data.map(agent => ({
          name: agent.displayName,
          role: agent.role?.displayName || 'Desconhecido',
          imageUrl: agent.displayIcon,
          gender: getGender(agent.displayName),
          releaseYear: getReleaseYear(agent.displayName),
          nationality: agent.characterTags?.find(tag => tag.includes('Nationality'))?.replace('Nationality-', '') || 'Desconhecida',
          description: agent.description,
          abilities: agent.abilities?.map(ability => ({
            name: ability.displayName,
            description: ability.description,
            imageUrl: ability.displayIcon,
            slot: ability.slot
          })) || [],
          background: agent.background,
          characterTags: agent.characterTags || []
        }));

        setAgents(agentsData);
      } catch (error) {
        console.error('Erro ao buscar os agentes:', error);
        setError('Erro ao carregar os agentes. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const value = {
    agents,
    loading,
    error
  };

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  );
};

export default AgentProvider;
