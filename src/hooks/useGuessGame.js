import { useCallback, useMemo } from 'react';
import { useKeyedState } from './useKeyedState';

/**
 * Estado de uma partida: lista de palpites (ids de agentes) e se já acertou.
 *
 * - `gameKey` identifica a partida; quando muda, os palpites recomeçam.
 * - `persist` salva os palpites no navegador (usado no modo diário,
 *   para quem recarregar a página não perder o progresso).
 */
export function useGuessGame({ agents, answerId, gameKey, persist }) {
  const [ids, setIds] = useKeyedState(gameKey, persist, []);

  const byId = useMemo(() => new Map(agents.map((a) => [a.id, a])), [agents]);
  const guesses = useMemo(() => ids.map((id) => byId.get(id)).filter(Boolean), [ids, byId]);
  const won = answerId != null && ids.includes(answerId);

  const submit = useCallback(
    (agent) => {
      setIds((prev) =>
        prev.includes(agent.id) || prev.includes(answerId) ? prev : [...prev, agent.id],
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [answerId],
  );

  return { guesses, won, submit, attempts: guesses.length };
}
