export const MAX_SCORE = 5000;

// Dentro deste raio (fração do tamanho do mapa) a pontuação é máxima:
// callouts são áreas, não pontos exatos.
const PERFECT_RADIUS = 0.03;
// Quanto maior, mais rápido os pontos caem com a distância.
const FALLOFF = 12;

/** Distância entre dois pontos do minimapa (coordenadas de 0 a 1). */
export function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Pontos de 0 a 5000 conforme a distância do palpite até o local certo. */
export function scoreFor(dist) {
  if (dist <= PERFECT_RADIUS) return MAX_SCORE;
  return Math.round(MAX_SCORE * Math.exp(-(dist - PERFECT_RADIUS) * FALLOFF));
}

/** Emoji de uma rodada, para o texto de compartilhar. */
export function scoreEmoji(score) {
  if (score >= 4500) return '🟩';
  if (score >= 2500) return '🟨';
  if (score >= 800) return '🟧';
  return '🟥';
}

export const formatPoints = (n) => n.toLocaleString('pt-BR');
