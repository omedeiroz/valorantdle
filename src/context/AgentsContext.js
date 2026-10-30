import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchAgents } from '../services/valorantApi';

const AgentsContext = createContext(null);

export function AgentsProvider({ children }) {
  const [state, setState] = useState({ agents: [], status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, status: 'loading' }));

    fetchAgents({ signal: controller.signal })
      .then((agents) => setState({ agents, status: 'ready' }))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('Erro ao buscar agentes:', err);
        setState({ agents: [], status: 'error' });
      });

    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return (
    <AgentsContext.Provider value={{ ...state, retry }}>
      {children}
    </AgentsContext.Provider>
  );
}

export function useAgents() {
  const ctx = useContext(AgentsContext);
  if (!ctx) throw new Error('useAgents precisa estar dentro de <AgentsProvider>');
  return ctx;
}
