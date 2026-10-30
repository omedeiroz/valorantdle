/**
 * Compara um palpite com a resposta, atributo por atributo.
 * Cada campo vira { value, status }, com status:
 *   'correct' | 'wrong'  → atributos de texto
 *   'higher' | 'lower'   → atributos numéricos: o número da resposta é maior/menor
 */

function compareText(a, b) {
  return a === b ? 'correct' : 'wrong';
}

function compareNumber(guess, answer) {
  if (guess == null || answer == null) return guess === answer && guess != null ? 'correct' : 'wrong';
  if (guess === answer) return 'correct';
  return answer > guess ? 'higher' : 'lower';
}

export const ATTRIBUTES = [
  { key: 'gender', label: 'Gênero', compare: compareText, format: (v) => v },
  { key: 'role', label: 'Função', compare: compareText, format: (v) => v },
  { key: 'year', label: 'Lançamento', compare: compareNumber, format: (v) => v ?? '?' },
  { key: 'ult', label: 'Ultimate', compare: compareNumber, format: (v) => (v == null ? '?' : `${v} pts`) },
  // Posição no ranking de pick entre os agentes da mesma função.
  { key: 'rolePick', label: 'Pick na função', compare: compareNumber, format: (v) => (v == null ? 'Novo' : `#${v}`) },
];

export function compareAgents(guess, answer) {
  const result = {
    agent: { value: guess.name, status: guess.id === answer.id ? 'correct' : 'wrong' },
  };
  for (const attr of ATTRIBUTES) {
    result[attr.key] = {
      value: attr.format(guess[attr.key]),
      status: attr.compare(guess[attr.key], answer[attr.key]),
    };
  }
  return result;
}

const EMOJI = { correct: '🟩', wrong: '🟥', higher: '⬆️', lower: '⬇️' };

export function toEmojiRow(comparison) {
  return ['agent', ...ATTRIBUTES.map((a) => a.key)].map((k) => EMOJI[comparison[k].status]).join('');
}

/** Remove acentos e caixa para comparar nomes digitados. */
export function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase();
}
