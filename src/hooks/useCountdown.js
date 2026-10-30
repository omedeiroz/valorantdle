import { useEffect, useState } from 'react';
import { msUntilNextDay } from '../utils/daily';

function format(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

/** Tempo restante até o próximo desafio diário, atualizado a cada segundo. */
export function useCountdown(active = true) {
  const [ms, setMs] = useState(msUntilNextDay);

  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => setMs(msUntilNextDay()), 1000);
    return () => clearInterval(id);
  }, [active]);

  return format(ms);
}
