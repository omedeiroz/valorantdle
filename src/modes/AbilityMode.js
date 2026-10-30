import { useMemo } from 'react';
import { useAgents } from '../context/AgentsContext';
import GuessMode from './GuessMode';

// Quantos erros até liberar cada dica.
const HINT_UNFLIP = 3;
const HINT_NAME = 6;

// Slots da API → tecla padrão no jogo, na ordem do teclado.
const SLOT_OPTIONS = [
  { value: 'Grenade', key: 'C', label: 'Primeira' },
  { value: 'Ability1', key: 'Q', label: 'Segunda' },
  { value: 'Ability2', key: 'E', label: 'Terceira' },
  { value: 'Ultimate', key: 'X', label: 'Ultimate' },
];

const BONUS = {
  question: 'Qual tecla é essa habilidade?',
  options: SLOT_OPTIONS,
  answerOf: (ability) => ability.slot,
};

const agentOf = (ability) => ability.agent;
const plural = (n) => `${n} ${n === 1 ? 'tentativa' : 'tentativas'}`;

function AbilityClue({ ability, attempts, won, revealAll, gameKey }) {
  const unflipped = won || attempts >= HINT_UNFLIP;
  const named = won || attempts >= HINT_NAME;

  let hint = null;
  if (!unflipped) hint = `Ícone desvira em ${plural(HINT_UNFLIP - attempts)}`;
  else if (!named) hint = `Nome revelado em ${plural(HINT_NAME - attempts)}`;

  return (
    <div className="clue">
      {/* `key` recria o ícone a cada rodada, para ele já nascer virado (sem animar e revelar). */}
      <div key={`${gameKey}:${ability.id}`} className={`clue__icon ${unflipped ? '' : 'is-flipped'}`}>
        <img src={ability.icon} alt={named ? ability.name : 'Habilidade secreta'} />
      </div>
      <div className="clue__text">
        <h2>{named ? ability.name : 'Habilidade secreta'}</h2>
        {/* A descrição só aparece depois do bônus, para não entregar a tecla. */}
        {revealAll && <p>{ability.description}</p>}
        {hint && <p className="clue__hint">{hint}</p>}
      </div>
    </div>
  );
}

export default function AbilityMode() {
  const { agents } = useAgents();

  const abilities = useMemo(
    () =>
      agents.flatMap((agent) =>
        agent.abilities
          .filter((a) => SLOT_OPTIONS.some((o) => o.value === a.slot))
          .map((ability) => ({ ...ability, agent })),
      ),
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
      describe={(ability) => {
        const slot = SLOT_OPTIONS.find((o) => o.value === ability.slot);
        return `A habilidade era ${ability.name} (${slot.key}).`;
      }}
      bonus={BONUS}
    />
  );
}
