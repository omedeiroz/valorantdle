import { AGENT_META, UNKNOWN } from '../data/agentMeta';
import { assignRoleRanks } from '../utils/ranking';

const AGENTS_URL =
  'https://valorant-api.com/v1/agents?isPlayableCharacter=true&language=pt-BR';

// Mude a versão sempre que o formato dos dados mudar, para invalidar o cache antigo.
const CACHE_KEY = 'valorantdle:agents:v3';
const CACHE_TTL = 1000 * 60 * 60 * 12; // 12h

function normalizeAgent(raw) {
  const meta = AGENT_META[raw.displayName] ?? {};

  return {
    id: raw.uuid,
    name: raw.displayName,
    role: raw.role?.displayName ?? UNKNOWN,
    roleIcon: raw.role?.displayIcon ?? null,
    icon: raw.displayIcon,
    portrait: raw.fullPortrait ?? raw.displayIcon,
    gender: meta.gender ?? UNKNOWN,
    year: meta.year ?? null,
    ult: meta.ult ?? null,
    pick: meta.pick ?? null,
    abilities: (raw.abilities ?? [])
      // Passivas não têm ícone na maioria dos agentes e quase ninguém as reconhece.
      .filter((a) => a.slot !== 'Passive' && a.displayIcon)
      .map((a) => ({
        id: `${raw.uuid}:${a.slot}`,
        slot: a.slot,
        name: a.displayName,
        // A API às vezes traz marcações como <whitebold>…</>; removemos.
        description: (a.description ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(),
        icon: a.displayIcon,
      })),
  };
}

function readCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (cached && Date.now() - cached.savedAt < CACHE_TTL) return cached.agents;
  } catch {
    /* cache indisponível ou corrompido: ignora */
  }
  return null;
}

function writeCache(agents) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), agents }));
  } catch {
    /* sem espaço ou modo privado: ignora */
  }
}

export async function fetchAgents({ signal } = {}) {
  const cached = readCache();
  if (cached) return cached;

  const response = await fetch(AGENTS_URL, { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const { data } = await response.json();
  if (!Array.isArray(data)) throw new Error('Resposta inesperada da API');

  const agents = assignRoleRanks(data.map(normalizeAgent)).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  writeCache(agents);
  return agents;
}
