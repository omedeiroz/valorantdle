import { useCallback, useEffect, useState } from 'react';
import { fetchSkins } from '../services/skinsApi';

/** Carrega as skins da loja (com cache). */
export function useSkins() {
  const [state, setState] = useState({ skins: [], status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, status: 'loading' }));

    fetchSkins({ signal: controller.signal })
      .then((skins) => setState({ skins, status: skins.length ? 'ready' : 'error' }))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('Erro ao buscar skins:', err);
        setState({ skins: [], status: 'error' });
      });

    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}
