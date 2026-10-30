import { useRef } from 'react';

const pct = (v) => `${v * 100}%`;

/**
 * Minimapa clicável. Coordenadas sempre de 0 a 1.
 * - guess:  palpite do jogador (marcador vermelho)
 * - answer: local certo (marcador verde), com linha até o palpite
 * - extras: pontos rotulados (usado no editor para conferir os callouts)
 */
export default function MapBoard({ map, guess, answer, onPick, disabled, extras }) {
  const ref = useRef(null);

  const handleClick = (e) => {
    if (disabled || !onPick) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    onPick({ x: Math.min(1, Math.max(0, x)), y: Math.min(1, Math.max(0, y)) });
  };

  return (
    <div
      ref={ref}
      className={`board ${disabled ? 'is-disabled' : ''}`}
      onClick={handleClick}
      role="application"
      aria-label={`Minimapa de ${map.name}. Clique para marcar o local.`}
    >
      <img className="board__map" src={map.minimap} alt="" draggable={false} />

      {guess && answer && (
        <svg className="board__line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line x1={guess.x * 100} y1={guess.y * 100} x2={answer.x * 100} y2={answer.y * 100} />
        </svg>
      )}

      {extras?.map((p) => (
        <span key={p.name} className="board__extra" style={{ left: pct(p.x), top: pct(p.y) }}>
          <span>{p.name}</span>
        </span>
      ))}

      {answer && <span className="pin pin--answer" style={{ left: pct(answer.x), top: pct(answer.y) }} />}
      {guess && <span className="pin pin--guess" style={{ left: pct(guess.x), top: pct(guess.y) }} />}
    </div>
  );
}
