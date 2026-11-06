// Skins de Vandal, Phantom, Ghost, Operator, Sheriff e faca (só as da loja, que têm edição), em português.
const BASE = 'https://valorant-api.com/v1';
const LANG = 'language=pt-BR';

// Mude a versão sempre que o formato dos dados mudar, para invalidar o cache antigo.
const CACHE_KEY = 'valorantdle:skins:v2';
const CACHE_TTL = 1000 * 60 * 60 * 12; // 12h

// Categoria da arma (vem como "EEquippableCategory::Rifle").
const CATEGORY = {
  Sidearm: 'Pistola',
  SMG: 'Submetralhadora',
  Shotgun: 'Escopeta',
  Rifle: 'Rifle',
  Sniper: 'Sniper',
  Heavy: 'Pesada',
  Melee: 'Corpo a corpo',
};

// Armas que entram no jogo (por id na API, com o nome como reserva).
const WEAPONS = {
  '9c82e19d-4575-0200-1a81-3eacf00cf872': 'Vandal',
  'ee8e8d15-496b-07ac-e5f6-8fae5d4c7b1a': 'Phantom',
  '1baa85b4-4c70-1284-64bb-6481dfc3bb4e': 'Ghost',
  'a03b24d3-4319-996d-0f8c-94bbfba1dfc7': 'Operator',
  'e336c6b8-418d-9340-d77f-7a9e4cfe0702': 'Sheriff',
  '2f59173c-4bed-b6c3-2191-dea9b58be9c7': 'Faca',
};
const WEAPON_NAMES = new Set(Object.values(WEAPONS).map((n) => n.toLowerCase()));

/** Nome da arma se ela entra no jogo, ou null. A faca vem como "Corpo a Corpo" na API. */
function allowedWeapon(weapon) {
  if (WEAPONS[weapon.uuid]) return WEAPONS[weapon.uuid];
  if ((weapon.category ?? '').endsWith('::Melee')) return 'Faca';
  const name = (weapon.displayName ?? '').trim();
  return WEAPON_NAMES.has(name.toLowerCase()) ? name : null;
}

// Ordem das edições, da mais barata para a mais cara.
const TIER_ORDER = ['Select', 'Deluxe', 'Premium', 'Exclusive', 'Ultra'];

function tierName(tier) {
  return (tier.displayName ?? tier.devName ?? '')
    .replace(/^Edição\s+/i, '')
    .replace(/\s+Edition$/i, '')
    .trim();
}

function tierRank(tier) {
  const i = TIER_ORDER.indexOf(tier.devName);
  return i === -1 ? tier.rank ?? 0 : i;
}

function skinImage(skin) {
  return skin.chromas?.[0]?.fullRender ?? skin.displayIcon ?? skin.levels?.[0]?.displayIcon ?? null;
}

async function getJson(path, signal) {
  const response = await fetch(`${BASE}/${path}?${LANG}`, { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const { data } = await response.json();
  if (!Array.isArray(data)) throw new Error('Resposta inesperada da API');
  return data;
}

function readCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (cached && Date.now() - cached.savedAt < CACHE_TTL) return cached.skins;
  } catch {
    /* cache indisponível ou corrompido: ignora */
  }
  return null;
}

function writeCache(skins) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), skins }));
  } catch {
    /* sem espaço ou modo privado: ignora */
  }
}

export async function fetchSkins({ signal } = {}) {
  const cached = readCache();
  if (cached) return cached;

  const [weapons, tiers, themes] = await Promise.all([
    getJson('weapons', signal),
    getJson('contenttiers', signal),
    getJson('themes', signal),
  ]);

  const tierById = new Map(tiers.map((t) => [t.uuid, t]));
  const themeById = new Map(themes.map((t) => [t.uuid, t.displayName]));
  const seen = new Set();
  const skins = [];

  for (const weapon of weapons) {
    const weaponName = allowedWeapon(weapon);
    if (!weaponName) continue;
    const category = CATEGORY[(weapon.category ?? '').split('::').pop()] ?? 'Outra';
    for (const skin of weapon.skins ?? []) {
      const tier = tierById.get(skin.contentTierUuid);
      const image = skinImage(skin);
      // Sem edição = skin padrão ou do passe de batalha: fora do jogo.
      if (!tier || !image || seen.has(skin.displayName)) continue;
      seen.add(skin.displayName);
      skins.push({
        id: skin.uuid,
        name: skin.displayName,
        icon: skin.displayIcon ?? image,
        portrait: image,
        wideArt: true,
        weapon: weaponName,
        category,
        collection: themeById.get(skin.themeUuid) ?? '?',
        tier: tierRank(tier),
        tierName: tierName(tier),
      });
    }
  }

  skins.sort((a, b) => a.name.localeCompare(b.name));
  writeCache(skins);
  return skins;
}
