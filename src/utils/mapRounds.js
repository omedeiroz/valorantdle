import { seededFloat } from './daily';

/**
 * Monta as rodadas de uma partida de forma determinística a partir de uma semente
 * (no diário, todo mundo recebe as mesmas rodadas).
 *
 * kind:      'callout' (adivinhar onde fica um callout) ou 'image' (onde foi tirado o print)
 * mapFilter: id de um mapa específico, ou null para todos
 */
export function buildRounds({ maps, spots = [], kind, seed, count, mapFilter = null }) {
  const pool = [];
  for (const map of maps) {
    if (mapFilter && map.id !== mapFilter) continue;
    if (kind === 'callout') {
      for (const c of map.callouts) pool.push({ kind, map, name: c.name, x: c.x, y: c.y });
    } else {
      for (const s of spots) {
        if (s.map === map.id) pool.push({ kind, map, image: s.image, note: s.note, x: s.x, y: s.y });
      }
    }
  }

  // Embaralha com a semente (Fisher–Yates) e pega as primeiras, variando de mapa quando dá.
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededFloat(`${seed}:${i}`) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const rounds = [];
  const usedMaps = new Set();
  for (const item of shuffled) {
    if (rounds.length >= count) break;
    if (!mapFilter && usedMaps.has(item.map.id) && usedMaps.size < maps.length) continue;
    rounds.push(item);
    usedMaps.add(item.map.id);
  }
  // Se faltou (poucos mapas), completa com o que sobrou.
  for (const item of shuffled) {
    if (rounds.length >= count) break;
    if (!rounds.includes(item)) rounds.push(item);
  }
  return rounds;
}
