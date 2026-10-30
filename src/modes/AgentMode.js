import { useAgents } from '../context/AgentsContext';
import GuessMode from './GuessMode';

const agentOf = (agent) => agent;

export default function AgentMode() {
  const { agents } = useAgents();

  return (
    <GuessMode
      id="agent"
      label="Agente"
      title="Adivinhe o agente"
      pool={agents}
      agentOf={agentOf}
    />
  );
}
