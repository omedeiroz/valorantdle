import { useMemo, useState } from 'react';
import { useAgents } from '../context/AgentsContext';
import { useGuessGame } from '../hooks/useGuessGame';
import { useVariant } from '../hooks/useVariant';
import { pickRandom, pickSeeded, todayKey } from '../utils/daily';
import GuessTable from '../components/GuessTable';
import ResultPanel from '../components/ResultPanel';
import SearchBar from '../components/SearchBar';
import VariantToggle from '../components/VariantToggle';

/**
 * Base comum dos modos "adivinhe o agente a partir de X".
 *
 * Cada modo só define:
 *  - `pool`: lista de desafios possíveis (agentes, habilidades…)
 *  - `agentOf(item)`: qual agente é a resposta daquele desafio
 *  - `renderClue(item, ctx)`: a pista exibida acima da busca (opcional)
 *  - `describe(item)`: texto extra na tela de vitória (opcional)
 */
export default function GuessMode({ id, label, title, pool, agentOf, renderClue, describe }) {
  const { agents } = useAgents();
  const [variant, setVariant] = useVariant(id);
  const day = todayKey();

  const [round, setRound] = useState(0);
  const [endlessItem, setEndlessItem] = useState(() => pickRandom(pool));

  const dailyItem = useMemo(() => pickSeeded(pool, `${id}:${day}`), [pool, id, day]);
  const item = variant === 'daily' ? dailyItem : endlessItem;
  const answer = item ? agentOf(item) : null;

  const game = useGuessGame({
    agents,
    answerId: answer?.id,
    gameKey: variant === 'daily' ? `${id}:${day}` : `${id}:endless:${round}`,
    persist: variant === 'daily',
  });

  const nextRound = () => {
    setEndlessItem((prev) => pickRandom(pool, prev));
    setRound((r) => r + 1);
  };

  const switchVariant = (next) => {
    if (next === variant) return;
    if (next === 'endless') nextRound();
    setVariant(next);
  };

  if (!item) return null;

  return (
    <section className="mode">
      <header className="mode__header">
        <h1 className="mode__title">{title}</h1>
        <VariantToggle value={variant} onChange={switchVariant} />
      </header>

      {renderClue && renderClue(item, { attempts: game.attempts, won: game.won })}

      {game.won ? (
        <ResultPanel
          answer={answer}
          guesses={game.guesses}
          variant={variant}
          modeLabel={label}
          detail={describe?.(item)}
          onNext={nextRound}
          onPlayEndless={() => switchVariant('endless')}
        />
      ) : (
        <SearchBar
          agents={agents}
          excludeIds={game.guesses.map((g) => g.id)}
          onSelect={game.submit}
          disabled={game.won}
        />
      )}

      <GuessTable guesses={game.guesses} answer={answer} />

      {game.attempts === 0 && (
        <p className="mode__help">
          Cada palpite mostra o que bate com o agente secreto: <b className="tag tag--correct">verde</b>{' '}
          acertou, <b className="tag tag--wrong">vermelho</b> errou, e as setas no lançamento indicam se
          a resposta é mais recente (▲) ou mais antiga (▼).
        </p>
      )}
    </section>
  );
}
