// Callouts em português, com as traduções oficiais da Riot.
const MAPS_URL = 'https://valorant-api.com/v1/maps?language=pt-BR';

// Mude a versão sempre que o formato dos dados mudar, para invalidar o cache antigo.
const CACHE_KEY = 'valorantdle:maps:v3';
const CACHE_TTL = 1000 * 60 * 60 * 12; // 12h

/**
 * Converte coordenadas do jogo em posição no minimapa (displayIcon), de 0 a 1.
 * Atenção: o eixo X do minimapa usa o Y do jogo e vice-versa.
 * Para conferir, ative "Mostrar callouts" no editor (#/mapa/editor).
 */
export function toMinimap(map, { x, y }) {
  return {
    x: y * map.xMultiplier + map.xScalarToAdd,
    y: x * map.yMultiplier + map.yScalarToAdd,
  };
}

/**
 * Nome exibido de um callout. A API separa o lugar (regionName, ex.: "Principal")
 * da área (superRegionName, ex.: "A"), então juntamos os dois: "Principal (A)".
 * Isso também diferencia lugares com o mesmo nome em áreas diferentes.
 */
export function calloutLabel({ regionName, superRegionName }) {
  const region = (regionName ?? '').trim();
  const area = (superRegionName ?? '').trim();
  // Só omite a área quando ela já aparece como palavra no nome (ex.: "Meio Superior").
  const words = region.toLowerCase().split(/\s+/);
  if (!area || words.includes(area.toLowerCase())) return region;
  return `${region} (${area})`;
}

function normalizeMap(raw) {
  const seen = new Set();
  const callouts = (raw.callouts ?? [])
    .map((c) => ({ name: calloutLabel(c), ...toMinimap(raw, c.location) }))
    .filter((c) => {
      const inside = c.x > 0.02 && c.x < 0.98 && c.y > 0.02 && c.y < 0.98;
      if (!inside || seen.has(c.name)) return false;
      seen.add(c.name);
      return true;
    });

  return {
    id: raw.uuid,
    name: raw.displayName,
    minimap: raw.displayIcon,
    splash: raw.splash,
    thumb: raw.listViewIcon ?? raw.splash,
    callouts,
  };
}

function readCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (cached && Date.now() - cached.savedAt < CACHE_TTL) return cached.maps;
  } catch {
    /* cache indisponível ou corrompido: ignora */
  }
  return null;
}

function writeCache(maps) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), maps }));
  } catch {
    /* sem espaço ou modo privado: ignora */
  }
}

export async function fetchMaps({ signal } = {}) {
  const cached = readCache();
  if (cached) return cached;

  const response = await fetch(MAPS_URL, { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const { data } = await response.json();
  if (!Array.isArray(data)) throw new Error('Resposta inesperada da API');

  // Só mapas competitivos: têm minimapa, fórmula de conversão e callouts suficientes.
  const maps = data
    .filter((m) => m.displayIcon && m.xMultiplier && m.yMultiplier && (m.callouts?.length ?? 0) >= 8)
    .map(normalizeMap)
    .filter((m) => m.callouts.length >= 8)
    .sort((a, b) => a.name.localeCompare(b.name));

  writeCache(maps);
  return maps;
}
