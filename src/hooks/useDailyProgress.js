import { useEffect, useState } from 'react';
import { PLAYABLE_MODES } from '../modes/registry';
import { todayKey } from '../utils/daily';
import { getDailyDone, onProgressChange } from '../utils/progress';

function read() {
  const day = todayKey();
  return Object.fromEntries(PLAYABLE_MODES.map((m) => [m.id, getDailyDone(m.id, day)]));
}

/**
 * Progresso dos desafios de hoje: { [modeId]: tentativas | null }.
 * Atualiza sozinho quando um desafio é concluído.
 */
export function useDailyProgress() {
  const [progress, setProgress] = useState(read);

  useEffect(() => onProgressChange(() => setProgress(read())), []);

  const done = Object.values(progress).filter((v) => v != null).length;
  return { progress, done, total: PLAYABLE_MODES.length };
}
