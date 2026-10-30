import { useAgents } from '../context/AgentsContext';
import { useKeyedState } from '../hooks/useKeyedState';
import ZoomClue, { radiantLabel } from '../components/ZoomClue';
import GuessMode from './GuessMode';

// Zoom inicial, quanto ele diminui a cada erro e o mínimo antes de acertar.
const ZOOM = { start: 8, step: 0.8, min: 1.8 };

// Região do retrato onde costuma estar o agente (evita cair no fundo transparente).
const FOCUS = { x: [36, 64], y: [14, 52] };

const agentOf = (agent) => agent;

export default function ZoomMode() {
  const { agents } = useAgents();
  // Preferência do jogador, salva no navegador entre partidas.
  const [radiant, setRadiant] = useKeyedState('zoom:radiant', true, { gray: false, spin: false });

  return (
    <GuessMode
      id="zoom"
      label={radiantLabel('Zoom', radiant)}
      title="Que agente é esse?"
      pool={agents.filter((a) => a.portrait)}
      agentOf={agentOf}
      layout="list"
      renderClue={(agent, ctx) => (
        <ZoomClue
          {...ctx}
          itemId={agent.id}
          image={agent.portrait}
          answerName={agent.name}
          hiddenAlt="Agente secreto ampliado"
          zoom={ZOOM}
          focus={FOCUS}
          radiant={radiant}
          setRadiant={setRadiant}
        />
      )}
    />
  );
}
