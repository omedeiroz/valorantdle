/**
 * Compara um palpite com a resposta, atributo por atributo.
 * Cada campo vira { value, status }, com status 'correct' | 'wrong' | 'higher' | 'lower'.
 */
export function compareAgents(guess, answer) {
  const same = (key) => (guess[key] === answer[key] ? 'correct' : 'wrong');

  let yearStatus = 'wrong';
  if (guess.year == null || answer.year == null) yearStatus = 'wrong';
  else if (guess.year === answer.year) yearStatus = 'correct';
  else yearStatus = answer.year > guess.year ? 'higher' : 'lower';

  return {
    agent: { value: guess.name, status: guess.id === answer.id ? 'correct' : 'wrong' },
    gender: { value: guess.gender, status: same('gender') },
    role: { value: guess.role, status: same('role') },
    year: { value: guess.year ?? '?', status: yearStatus },
  };
}

const EMOJI = { correct: '🟩', wrong: '🟥', higher: '⬆️', lower: '⬇️' };

export function toEmojiRow(comparison) {
  return ['agent', 'gender', 'role', 'year'].map((k) => EMOJI[comparison[k].status]).join('');
}

/** Remove acentos e caixa para comparar nomes digitados. */
export function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase();
}
