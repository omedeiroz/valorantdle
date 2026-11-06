import { useEffect, useMemo, useState } from 'react';
import { useAgents } from '../context/AgentsContext';
import { useGuessGame } from '../hooks/useGuessGame';
import { useKeyedState } from '../hooks/useKeyedState';
import { useVariant } from '../hooks/useVariant';
import { pickRandom, pickSeeded, todayKey } from '../utils/daily';
import { markDailyDone } from '../utils/progress';
import BonusQuestion from '../components/BonusQuestion';
import WordBonus from '../components/WordBonus';
import { normalize } from '../utils/compare';
import GuessList from '../components/GuessList';
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
 *  - `bonus`: pergunta extra depois de acertar (opcional)
 *      Múltipla escolha: { question, options: [{ value, key, label }], answerOf(item) }
 *      Palavra digitada: { kind: 'text', question, maxTries, answerOf(item) }
 *  - `layout`: 'table' (compara atributos) ou 'list' (só certo/errado)
 *  - `options`: lista de respostas possíveis na busca (padrão: os agentes).
 *      Cada uma precisa de { id, name, icon }; `portrait` aparece na vitória.
 *  - `searchPlaceholder`: texto da busca
 *  - `attributes`, `firstLabel`, `tableFooter`: colunas da tabela (padrão: as de agente)
 *  - `help`: texto de ajuda antes do primeiro palpite (padrão: o da tabela de agentes)
 */
export default function GuessMode({
  id,
  label,
  title,
  pool,
  agentOf,
  renderClue,
  describe,
  bonus,
  layout = 'table',
  options,
  searchPlaceholder,
  attributes,
  firstLabel,
  tableFooter,
  help,
}) {
  const { agents: allAgents } = useAgents();
  const agents = options ?? allAgents;
  const [variant, setVariant] = useVariant(id);
  const day = todayKey();

  const [round, setRound] = useState(0);
  const [endlessItem, setEndlessItem] = useState(() => pickRandom(pool));

  const dailyItem = useMemo(() => pickSeeded(pool, `${id}:${day}`), [pool, id, day]);
  const item = variant === 'daily' ? dailyItem : endlessItem;
  const answer = item ? agentOf(item) : null;

  const persist = variant === 'daily';
  const gameKey = persist ? `${id}:${day}` : `${id}:endless:${round}`;

  const game = useGuessGame({ agents, answerId: answer?.id, gameKey, persist });
  const [bonusPick, setBonusPick] = useKeyedState(`${gameKey}:bonus`, persist, null);

  const nextRound = () => {
    setEndlessItem((prev) => pickRandom(pool, prev));
    setRound((r) => r + 1);
  };

  const switchVariant = (next) => {
    if (next === variant) return;
    if (next === 'endless') nextRound();
    setVariant(next);
  };

  const bonusCorrect = bonus && item ? bonus.answerOf(item) : null;
  const bonusState = bonusStatus(bonus, bonusPick, bonusCorrect);
  const waitingBonus = game.won && bonus && !bonusState.done;
  const finished = game.won && !waitingBonus;

  // Marca o desafio diário como concluído (aparece no menu inicial e no menu lateral).
  useEffect(() => {
    if (finished && persist) markDailyDone(id, day, game.attempts);
  }, [finished, persist, id, day, game.attempts]);

  if (!item) return null;

  return (
    <section className="mode">
      <header className="mode__header">
        <h1 className="mode__title">{title}</h1>
        <VariantToggle value={variant} onChange={switchVariant} />
      </header>

      {renderClue &&
        renderClue(item, {
          attempts: game.attempts,
          won: game.won,
          revealAll: game.won && !waitingBonus,
          gameKey,
        })}

      {game.won && bonus?.kind === 'text' && (
        <WordBonus
          question={bonus.question}
          answer={bonusCorrect}
          tries={bonusPick ?? []}
          maxTries={bonus.maxTries}
          onTry={(word) => setBonusPick((prev) => [...(prev ?? []), word])}
        />
      )}

      {game.won && bonus && bonus.kind !== 'text' && (
        <BonusQuestion
          question={bonus.question}
          options={bonus.options}
          correct={bonusCorrect}
          picked={bonusPick}
          onPick={setBonusPick}
        />
      )}

      {finished && (
        <ResultPanel
          answer={answer}
          guesses={game.guesses}
          variant={variant}
          modeLabel={label}
          detail={describe?.(item)}
          bonusResult={bonus ? bonusState.correct : undefined}
          attributes={attributes}
          compactShare={layout === 'list'}
          onNext={nextRound}
          onPlayEndless={() => switchVariant('endless')}
        />
      )}

      {!game.won && (
        <SearchBar
          agents={agents}
          excludeIds={game.guesses.map((g) => g.id)}
          onSelect={game.submit}
          disabled={game.won}
          placeholder={searchPlaceholder}
        />
      )}

      {layout === 'table' ? (
        <GuessTable
          guesses={game.guesses}
          answer={answer}
          attributes={attributes}
          firstLabel={firstLabel}
          footer={tableFooter}
        />
      ) : (
        <GuessList guesses={game.guesses} answer={answer} />
      )}

      {game.attempts === 0 && help && <p className="mode__help">{help}</p>}

      {layout === 'table' && game.attempts === 0 && !help && (
        <p className="mode__help">
          Cada palpite mostra o que bate com o agente secreto: <b className="tag tag--correct">verde</b>{' '}
          acertou e <b className="tag tag--wrong">vermelho</b> errou. Em lançamento e ultimate, a seta diz se
          o número da resposta é maior (▲) ou menor (▼). No pick, ▲ quer dizer que a resposta está mais acima no
          ranking da função (mais escolhida) e ▼, mais abaixo.
        </p>
      )}
    </section>
  );
}

/** Situação do bônus: já terminou? acertou? */
function bonusStatus(bonus, pick, correct) {
  if (!bonus) return { done: true, correct: false };
  if (bonus.kind === 'text') {
    const tries = pick ?? [];
    const hit = tries.some((t) => normalize(t) === normalize(correct));
    return { done: hit || tries.length >= bonus.maxTries, correct: hit };
  }
  return { done: pick != null, correct: pick === correct };
}
