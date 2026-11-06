/**
 * Compara um palpite com a resposta, atributo por atributo.
 * Cada campo vira { value, status }, com status:
 *   'correct' | 'wrong'  → atributos de texto
 *   'higher' | 'lower'   → atributos numéricos: o número da resposta é maior/menor
 */

export function compareText(a, b) {
  return a === b ? 'correct' : 'wrong';
}

export function compareNumber(guess, answer) {
  if (guess == null || answer == null) return guess === answer && guess != null ? 'correct' : 'wrong';
  if (guess === answer) return 'correct';
  return answer > guess ? 'higher' : 'lower';
}

/**
 * Para rankings (#1 é o topo): a seta indica posição, não o número.
 * Resposta #4 contra palpite #1 → ▼ (a resposta está mais abaixo no ranking).
 */
export function compareRank(guess, answer) {
  const status = compareNumber(guess, answer);
  if (status === 'higher') return 'lower';
  if (status === 'lower') return 'higher';
  return status;
}

export const ATTRIBUTES = [
  { key: 'gender', label: 'Gênero', compare: compareText, format: (v) => v },
  { key: 'role', label: 'Função', compare: compareText, format: (v) => v },
  { key: 'year', label: 'Lançamento', compare: compareNumber, format: (v) => v ?? '?' },
  { key: 'ult', label: 'Ultimate', compare: compareNumber, format: (v) => (v == null ? '?' : `${v} pts`) },
  // Posição no ranking de pick entre os agentes da mesma função.
  { key: 'rolePick', label: 'Pick na função', compare: compareRank, format: (v) => (v == null ? 'Novo' : `#${v}`) },
];

/** `attributes` permite comparar outras coisas além de agentes (ex.: skins). */
export function compareAgents(guess, answer, attributes = ATTRIBUTES) {
  const result = {
    agent: { value: guess.name, status: guess.id === answer.id ? 'correct' : 'wrong' },
  };
  for (const attr of attributes) {
    result[attr.key] = {
      value: attr.format(guess[attr.key], guess),
      status: attr.compare(guess[attr.key], answer[attr.key]),
    };
  }
  return result;
}

const EMOJI = { correct: '🟩', wrong: '🟥', higher: '⬆️', lower: '⬇️' };

export function toEmojiRow(comparison, attributes = ATTRIBUTES) {
  return ['agent', ...attributes.map((a) => a.key)].map((k) => EMOJI[comparison[k].status]).join('');
}

/** Remove acentos e caixa para comparar nomes digitados. */
export function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase();
}
