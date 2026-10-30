import { useMemo } from 'react';
import { useAgents } from '../context/AgentsContext';
import GuessMode from './GuessMode';

// Quantos erros até liberar cada dica.
const HINT_UNFLIP = 3;
const HINT_NAME = 6;

const agentOf = (ability) => ability.agent;

function AbilityClue({ ability, attempts, won }) {
  const unflipped = won || attempts >= HINT_UNFLIP;
  const named = won || attempts >= HINT_NAME;

  let hint = null;
  if (!unflipped) hint = `Ícone desvira em ${HINT_UNFLIP - attempts} ${HINT_UNFLIP - attempts === 1 ? 'tentativa' : 'tentativas'}`;
  else if (!named) hint = `Nome revelado em ${HINT_NAME - attempts} ${HINT_NAME - attempts === 1 ? 'tentativa' : 'tentativas'}`;

  return (
    <div className="clue">
      <div className={`clue__icon ${unflipped ? '' : 'is-flipped'}`}>
        <img src={ability.icon} alt={named ? ability.name : 'Habilidade secreta'} />
      </div>
      <div className="clue__text">
        <h2>{named ? ability.name : 'Habilidade secreta'}</h2>
        {won && <p>{ability.description}</p>}
        {hint && <p className="clue__hint">{hint}</p>}
      </div>
    </div>
  );
}

export default function AbilityMode() {
  const { agents } = useAgents();

  const abilities = useMemo(
    () => agents.flatMap((agent) => agent.abilities.map((ability) => ({ ...ability, agent }))),
    [agents],
  );

  return (
    <GuessMode
      id="ability"
      label="Habilidade"
      title="De quem é esta habilidade?"
      pool={abilities}
      agentOf={agentOf}
      renderClue={(ability, ctx) => <AbilityClue ability={ability} {...ctx} />}
      describe={(ability) => `A habilidade era ${ability.name}.`}
    />
  );
}
