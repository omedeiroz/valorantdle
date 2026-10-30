const TIME_ZONE = 'America/Sao_Paulo';

/** Data de hoje no fuso de Brasília, no formato AAAA-MM-DD. */
export function todayKey(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(date);
}

/** Milissegundos até a próxima meia-noite no fuso de Brasília. */
export function msUntilNextDay(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: TIME_ZONE,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hourCycle: 'h23',
    })
      .formatToParts(now)
      .map((p) => [p.type, Number(p.value)]),
  );
  const elapsed = (parts.hour * 3600 + parts.minute * 60 + parts.second) * 1000;
  return 24 * 3600 * 1000 - elapsed;
}

/** Hash de string determinístico (FNV-1a de 32 bits). */
function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Escolhe o mesmo item para todo mundo a partir de uma semente (ex.: "agent:2026-10-30"). */
export function pickSeeded(items, seed) {
  if (!items.length) return null;
  return items[hash(seed) % items.length];
}

/** Número "aleatório" entre 0 e 1, sempre o mesmo para a mesma semente. */
export function seededFloat(seed) {
  return hash(seed) / 0x100000000;
}

/** Escolhe um item aleatório, evitando repetir o anterior quando possível. */
export function pickRandom(items, avoid) {
  if (!items.length) return null;
  const pool = items.length > 1 && avoid ? items.filter((i) => i !== avoid) : items;
  return pool[Math.floor(Math.random() * pool.length)];
}
