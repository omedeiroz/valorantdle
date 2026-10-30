import { useEffect, useRef, useState } from 'react';
import { seededFloat } from '../utils/daily';

// Ângulos possíveis no Radiante (giro de verdade, nunca 0°).
const ANGLES = [45, 90, 135, 180, 225, 270, 315];

export const RADIANT_OPTIONS = [
  { key: 'gray', label: 'Sem cor' },
  { key: 'spin', label: 'Girada' },
];

/** Rótulo do modo para o texto de compartilhar, ex.: "Zoom · Radiante (sem cor + girada)". */
export function radiantLabel(base, radiant, options = RADIANT_OPTIONS) {
  const parts = options.filter((o) => radiant[o.key]).map((o) => o.label.toLowerCase());
  return parts.length ? `${base} · Radiante (${parts.join(' + ')})` : base;
}

const lerp = ([a, b], t) => a + (b - a) * t;

/**
 * A imagem é recriada a cada rodada (via `key`), então já nasce ampliada,
 * sem animar a partir da imagem inteira da rodada anterior. Ela também fica
 * invisível até carregar, para não piscar antes do zoom.
 */
function ZoomImage({ src, alt, transform, gray, fit }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <img
      ref={ref}
      className={`zoom__image ${gray ? 'is-gray' : ''} ${loaded ? '' : 'is-loading'}`}
      src={src}
      alt={alt}
      style={{ transform, objectFit: fit }}
      draggable={false}
      onLoad={() => setLoaded(true)}
    />
  );
}

/**
 * Pista de imagem ampliada que abre a cada erro, com o Modo Radiante.
 *
 * zoom:   { start, step, min } — zoom inicial, quanto diminui por erro e o mínimo
 * focus:  { x: [min, max], y: [min, max] } — região (em %) onde o foco pode cair
 *         ou focusPoint: { x, y } (em %) para fixar o foco num ponto específico
 * aspect: proporção do quadro ('1 / 1', '16 / 9'…)
 * fit:    'contain' (retratos com fundo transparente) ou 'cover' (artes que preenchem tudo)
 * radiantOptions: quais opções do Radiante o modo oferece (padrão: todas)
 */
export default function ZoomClue({
  image,
  answerName,
  hiddenAlt,
  attempts,
  won,
  gameKey,
  itemId,
  zoom,
  focus,
  focusPoint,
  aspect = '1 / 1',
  fit = 'contain',
  radiant,
  setRadiant,
  radiantOptions = RADIANT_OPTIONS,
}) {
  const enabled = (key) => radiantOptions.some((o) => o.key === key) && !!radiant[key];
  // Ponto de foco e ângulo fixos por partida: todos veem o mesmo no diário.
  const seed = `${gameKey}:${itemId}`;
  const x = focusPoint ? focusPoint.x : lerp(focus.x, seededFloat(`${seed}:x`));
  const y = focusPoint ? focusPoint.y : lerp(focus.y, seededFloat(`${seed}:y`));
  const angle = ANGLES[Math.floor(seededFloat(`${seed}:a`) * ANGLES.length)];

  const scale = Math.max(zoom.min, zoom.start - attempts * zoom.step);
  const rotate = enabled('spin') ? angle : 0;
  const transform = won
    ? 'none'
    : `rotate(${rotate}deg) scale(${scale}) translate(${50 - x}%, ${50 - y}%)`;

  // Trocar as opções depois do primeiro palpite seria trapaça (deixaria a imagem mais fácil).
  const locked = attempts > 0 && !won;

  return (
    <div className="zoom">
      <div className={`zoom__frame ${aspect === '1 / 1' ? '' : 'zoom__frame--wide'}`} style={{ aspectRatio: aspect }}>
        <ZoomImage
          key={seed}
          src={image}
          alt={won ? answerName : hiddenAlt}
          transform={transform}
          gray={!won && enabled('gray')}
          fit={fit}
        />
      </div>

      <div className="zoom__side">
        <p className="zoom__eyebrow">Modo Radiante</p>
        <div className="zoom__options">
          {radiantOptions.map((o) => (
            <label key={o.key} className={`chip ${radiant[o.key] ? 'is-on' : ''} ${locked ? 'is-locked' : ''}`}>
              <input
                type="checkbox"
                checked={!!radiant[o.key]}
                disabled={locked}
                onChange={(e) => setRadiant((r) => ({ ...r, [o.key]: e.target.checked }))}
              />
              {o.label}
            </label>
          ))}
        </div>
        <p className="zoom__hint">
          {won
            ? 'Imagem completa revelada.'
            : locked
              ? 'Opções travadas até o fim da rodada. A imagem abre um pouco a cada erro.'
              : 'Escolha antes do primeiro palpite. A imagem abre um pouco a cada erro.'}
        </p>
      </div>
    </div>
  );
}
