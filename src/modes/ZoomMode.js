import { useAgents } from '../context/AgentsContext';
import { useKeyedState } from '../hooks/useKeyedState';
import { seededFloat } from '../utils/daily';
import GuessMode from './GuessMode';

// Zoom inicial e quanto ele diminui a cada erro.
const ZOOM_START = 8;
const ZOOM_STEP = 0.8;
const ZOOM_MIN = 1.8;

// Região do retrato onde costuma estar o agente (evita cair no fundo transparente).
const FOCUS_X = [36, 64];
const FOCUS_Y = [14, 52];

// Ângulos possíveis no Radiante (giro de verdade, nunca 0°).
const ANGLES = [45, 90, 135, 180, 225, 270, 315];

const RADIANT_OPTIONS = [
  { key: 'gray', label: 'Sem cor' },
  { key: 'spin', label: 'Girada' },
];

const agentOf = (agent) => agent;
const lerp = ([a, b], t) => a + (b - a) * t;

function radiantLabel(radiant) {
  const parts = RADIANT_OPTIONS.filter((o) => radiant[o.key]).map((o) => o.label.toLowerCase());
  return parts.length ? `Zoom · Radiante (${parts.join(' + ')})` : 'Zoom';
}

function ZoomClue({ agent, attempts, won, gameKey, radiant, setRadiant }) {
  // Ponto de foco e ângulo fixos por partida: todos veem o mesmo no diário.
  const seed = `${gameKey}:${agent.id}`;
  const x = lerp(FOCUS_X, seededFloat(`${seed}:x`));
  const y = lerp(FOCUS_Y, seededFloat(`${seed}:y`));
  const angle = ANGLES[Math.floor(seededFloat(`${seed}:a`) * ANGLES.length)];

  const scale = won ? 1 : Math.max(ZOOM_MIN, ZOOM_START - attempts * ZOOM_STEP);
  const rotate = !won && radiant.spin ? angle : 0;
  const gray = !won && radiant.gray;

  const transform = won
    ? 'none'
    : `rotate(${rotate}deg) scale(${scale}) translate(${50 - x}%, ${50 - y}%)`;

  // Trocar as opções depois do primeiro palpite seria trapaça (deixaria a imagem mais fácil).
  const locked = attempts > 0 && !won;

  return (
    <div className="zoom">
      <div className="zoom__frame">
        <img
          className={`zoom__image ${gray ? 'is-gray' : ''}`}
          src={agent.portrait}
          alt={won ? agent.name : 'Agente secreto ampliado'}
          style={{ transform }}
          draggable={false}
        />
      </div>

      <div className="zoom__side">
        <p className="zoom__eyebrow">Modo Radiante</p>
        <div className="zoom__options">
          {RADIANT_OPTIONS.map((o) => (
            <label key={o.key} className={`chip ${radiant[o.key] ? 'is-on' : ''} ${locked ? 'is-locked' : ''}`}>
              <input
                type="checkbox"
                checked={!!radiant[o.key]}
                disabled={locked}
                onChange={(e) => setRadiant((r) => ({ ...r, [o.key]: e.target.checked }))}
              />
              {o.label}
            </label>
          ))}
        </div>
        <p className="zoom__hint">
          {won
            ? 'Imagem completa revelada.'
            : locked
              ? 'Opções travadas até o fim da rodada. A imagem abre um pouco a cada erro.'
              : 'Escolha antes do primeiro palpite. A imagem abre um pouco a cada erro.'}
        </p>
      </div>
    </div>
  );
}

export default function ZoomMode() {
  const { agents } = useAgents();
  // Preferência do jogador, salva no navegador entre partidas.
  const [radiant, setRadiant] = useKeyedState('zoom:radiant', true, { gray: false, spin: false });

  return (
    <GuessMode
      id="zoom"
      label={radiantLabel(radiant)}
      title="Que agente é esse?"
      pool={agents.filter((a) => a.portrait)}
      agentOf={agentOf}
      layout="list"
      renderClue={(agent, ctx) => (
        <ZoomClue agent={agent} {...ctx} radiant={radiant} setRadiant={setRadiant} />
      )}
    />
  );
}
