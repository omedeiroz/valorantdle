import { load, save } from './storage';

const EVENT = 'valorantdle:progress';

/** Registra que o desafio diário de um minigame foi concluído (e em quantas tentativas). */
export function markDailyDone(modeId, day, attempts) {
  const key = `done:${modeId}:${day}`;
  if (load(key, null) != null) return;
  save(key, attempts);
  window.dispatchEvent(new Event(EVENT));
}

/** Tentativas usadas no desafio diário, ou null se ainda não concluiu. */
export function getDailyDone(modeId, day) {
  return load(`done:${modeId}:${day}`, null);
}

/** Avisa quando algum progresso muda (para o menu atualizar na hora). */
export function onProgressChange(callback) {
  window.addEventListener(EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}
