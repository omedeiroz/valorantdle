import { useCallback, useEffect, useState } from 'react';
import { fetchMaps } from '../services/mapsApi';

/** Carrega os mapas competitivos (com cache). */
export function useMaps() {
  const [state, setState] = useState({ maps: [], status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, status: 'loading' }));

    fetchMaps({ signal: controller.signal })
      .then((maps) => setState({ maps, status: maps.length ? 'ready' : 'error' }))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('Erro ao buscar mapas:', err);
        setState({ maps: [], status: 'error' });
      });

    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}
