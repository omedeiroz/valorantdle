import { useCallback, useEffect, useMemo, useState } from 'react';
import { load, save } from '../utils/storage';

/**
 * Estado de uma partida: lista de palpites (ids de agentes) e se já acertou.
 *
 * - `gameKey` identifica a partida; quando muda, os palpites recomeçam.
 * - `persist` salva os palpites no navegador (usado no modo diário,
 *   para quem recarregar a página não perder o progresso).
 */
export function useGuessGame({ agents, answerId, gameKey, persist }) {
  const initial = useCallback(() => (persist ? load(gameKey, []) : []), [gameKey, persist]);
  const [state, setState] = useState(() => ({ key: gameKey, ids: initial() }));

  // Trocou de partida: descarta os palpites anteriores já neste render.
  let ids = state.ids;
  if (state.key !== gameKey) {
    ids = initial();
    setState({ key: gameKey, ids });
  }

  useEffect(() => {
    if (persist && state.key === gameKey) save(gameKey, state.ids);
  }, [persist, gameKey, state]);

  const byId = useMemo(() => new Map(agents.map((a) => [a.id, a])), [agents]);

  const guesses = useMemo(
    () => ids.map((id) => byId.get(id)).filter(Boolean),
    [ids, byId],
  );

  const won = answerId != null && ids.includes(answerId);

  const submit = useCallback(
    (agent) => {
      setState((s) =>
        s.ids.includes(agent.id) || s.ids.includes(answerId)
          ? s
          : { ...s, ids: [...s.ids, agent.id] },
      );
    },
    [answerId],
  );

  return { guesses, won, submit, attempts: guesses.length };
}
