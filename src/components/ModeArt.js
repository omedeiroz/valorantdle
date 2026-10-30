import { useMemo } from 'react';
import { useAgents } from '../context/AgentsContext';
import { useMaps } from '../hooks/useMaps';
import { pickSeeded, todayKey } from '../utils/daily';

const SLOT_KEYS = { Grenade: 'C', Ability1: 'Q', Ability2: 'E', Ultimate: 'X' };

/**
 * Agente aleatório para ilustrar os cards, nunca igual às respostas de hoje
 * (para o menu não entregar o desafio diário).
 */
function useShowcaseAgent() {
  const { agents } = useAgents();
  return useMemo(() => {
    if (!agents.length) return null;
    const day = todayKey();
    const spoilers = new Set([
      pickSeeded(agents, `agent:${day}`)?.id,
      pickSeeded(agents.filter((a) => a.portrait), `zoom:${day}`)?.id,
    ]);
    const safe = agents.filter((a) => !spoilers.has(a.id) && a.portrait && a.abilities.length >= 4);
    return safe[Math.floor(Math.random() * safe.length)] ?? null;
  }, [agents]);
}

function Mosaic() {
  const { agents } = useAgents();
  return (
    <div className="art art--mosaic">
      {agents.slice(0, 24).map((a) => (
        <img key={a.id} src={a.icon} alt="" loading="lazy" />
      ))}
    </div>
  );
}

function Abilities({ agent }) {
  const abilities = (agent?.abilities ?? []).filter((a) => SLOT_KEYS[a.slot]);
  const order = ['Grenade', 'Ability1', 'Ability2', 'Ultimate'];
  abilities.sort((a, b) => order.indexOf(a.slot) - order.indexOf(b.slot));

  return (
    <div className="art art--ability">
      {abilities.map((a) => (
        <div key={a.id} className="art__ability">
          <img src={a.icon} alt="" loading="lazy" />
          <kbd>{SLOT_KEYS[a.slot]}</kbd>
        </div>
      ))}
    </div>
  );
}

function Zoom({ agent }) {
  return (
    <div className="art art--zoom">
      {agent && <img src={agent.portrait} alt="" loading="lazy" />}
      <span className="art__reticle" />
    </div>
  );
}

function MapZoomArt() {
  const { maps } = useMaps();
  // Mapa aleatório que não seja a resposta de hoje.
  const map = useMemo(() => {
    const withArt = maps.filter((m) => m.splash);
    const answer = pickSeeded(withArt, `mapzoom:${todayKey()}`)?.id;
    const safe = withArt.filter((m) => m.id !== answer);
    return safe[Math.floor(Math.random() * safe.length)] ?? null;
  }, [maps]);

  return (
    <div className="art art--zoom art--mapzoom">
      {map && <img src={map.splash} alt="" loading="lazy" />}
      <span className="art__reticle" />
    </div>
  );
}

function MapArt() {
  return (
    <div className="art art--map">
      <svg viewBox="0 0 200 120" aria-hidden="true">
        <path d="M30 20h50v25h30V15h60v40h-25v45H90V75H55v25H30z" />
        <circle cx="128" cy="58" r="6" />
        <circle cx="128" cy="58" r="14" />
      </svg>
    </div>
  );
}

export default function ModeArt({ type }) {
  const agent = useShowcaseAgent();
  if (type === 'mosaic') return <Mosaic />;
  if (type === 'ability') return <Abilities agent={agent} />;
  if (type === 'zoom') return <Zoom agent={agent} />;
  if (type === 'mapzoom') return <MapZoomArt />;
  return <MapArt />;
}
