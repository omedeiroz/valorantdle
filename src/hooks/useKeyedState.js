import { useEffect, useState } from 'react';
import { load, save } from '../utils/storage';

/**
 * useState que recomeça sempre que `key` muda e, se `persist` for true,
 * fica salvo no navegador sob essa chave.
 */
export function useKeyedState(key, persist, initialValue) {
  const read = () => (persist ? load(key, initialValue) : initialValue);
  const [state, setState] = useState(() => ({ key, value: read() }));

  let value = state.value;
  if (state.key !== key) {
    value = read();
    setState({ key, value });
  }

  useEffect(() => {
    if (persist && state.key === key) save(key, state.value);
  }, [persist, key, state]);

  const setValue = (next) =>
    setState((s) => ({ ...s, value: typeof next === 'function' ? next(s.value) : next }));

  return [value, setValue];
}
