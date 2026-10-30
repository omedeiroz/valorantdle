import { useCallback, useState } from 'react';
import { load, save } from '../utils/storage';

/** 'daily' (um desafio por dia, igual para todos) ou 'endless' (rodadas infinitas). */
export function useVariant(mode) {
  const key = `variant:${mode}`;
  const [variant, setVariantState] = useState(() => load(key, 'daily'));

  const setVariant = useCallback(
    (next) => {
      setVariantState(next);
      save(key, next);
    },
    [key],
  );

  return [variant, setVariant];
}
