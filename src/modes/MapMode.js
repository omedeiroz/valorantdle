import { useEffect, useMemo, useState } from 'react';
import { MAP_SPOTS } from '../data/mapSpots';
import { useCountdown } from '../hooks/useCountdown';
import { useKeyedState } from '../hooks/useKeyedState';
import { useMaps } from '../hooks/useMaps';
import { useVariant } from '../hooks/useVariant';
import { todayKey } from '../utils/daily';
import { buildRounds } from '../utils/mapRounds';
import { MAX_SCORE, distance, formatPoints, scoreEmoji, scoreFor } from '../utils/mapScore';
import { markDailyDone } from '../utils/progress';
import { load, save } from '../utils/storage';
import MapBoard from '../components/MapBoard';
import StatusScreen from '../components/StatusScreen';
import VariantToggle from '../components/VariantToggle';

export const MAP_MODE_ID = 'map';
const ROUNDS = 5;

const KINDS = [
  { value: 'callout', label: 'Callouts' },
  { value: 'image', label: 'Imagens' },
];

const newSeed = () => Math.random().toString(36).slice(2);

function Summary({ rounds, results, variant, kind, onNext, onPlayEndless }) {
  const countdown = useCountdown(variant === 'daily');
  const [copied, setCopied] = useState(false);
  const total = results.reduce((s, r) => s + r.score, 0);
  const max = MAX_SCORE * rounds.length;

  const share = async () => {
    const head =
      variant === 'daily'
        ? `Valorantdle · Onde estou? · ${todayKey()}`
        : 'Valorantdle · Onde estou? (infinito)';
    const text = `${head}\n${formatPoints(total)} / ${formatPoints(max)} pts\n\n${results
      .map((r) => scoreEmoji(r.score))
      .join('')}\n\n${window.location.href}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copie o resultado:', text);
    }
  };

  return (
    <section className="summary" aria-live="polite">
      <p className="result__eyebrow">Partida concluída</p>
      <h2 className="summary__total">
        {formatPoints(total)}
        <small> / {formatPoints(max)} pts</small>
      </h2>

      <ol className="summary__list">
        {rounds.map((round, i) => (
          <li key={i}>
            <span className="summary__emoji">{scoreEmoji(results[i].score)}</span>
            <span className="summary__what">
              {kind === 'callout' ? round.name : round.note || 'Imagem'} <small>· {round.map.name}</small>
            </span>
            <strong>{formatPoints(results[i].score)}</strong>
          </li>
        ))}
      </ol>

      <div className="result__actions">
        <button type="button" className="btn btn--ghost" onClick={share}>
          {copied ? 'Copiado!' : 'Compartilhar'}
        </button>
        {variant === 'endless' ? (
          <button type="button" className="btn" onClick={onNext}>
            Nova partida
          </button>
        ) : (
          <button type="button" className="btn" onClick={onPlayEndless}>
            Jogar no infinito
          </button>
        )}
      </div>
      {variant === 'daily' && (
        <p className="result__next">
          Próximo desafio em <time>{countdown}</time>
        </p>
      )}
    </section>
  );
}

function Prompt({ round }) {
  if (round.kind === 'image') {
    return (
      <div className="prompt prompt--image">
        <img src={round.image} alt="Local secreto" />
        <p>
          Onde foi tirado este print em <strong>{round.map.name}</strong>?
        </p>
      </div>
    );
  }
  return (
    <div className="prompt">
      <p className="prompt__label">Onde fica</p>
      <p className="prompt__callout">{round.name}</p>
      <p className="prompt__map">em {round.map.name}</p>
    </div>
  );
}

function MapGame({ maps }) {
  const [variant, setVariant] = useVariant(MAP_MODE_ID);
  const [kind, setKindState] = useState(() => load('map:kind', 'callout'));
  const [mapFilter, setMapFilter] = useState(null);
  const [endlessSeed, setEndlessSeed] = useState(newSeed);
  const day = todayKey();

  const hasSpots = MAP_SPOTS.length > 0;
  const activeKind = hasSpots ? kind : 'callout';
  const persist = variant === 'daily';
  // O diário é sempre em todos os mapas; o filtro vale só para o infinito.
  const filter = persist ? null : mapFilter;

  const gameKey = persist
    ? `map:${activeKind}:${day}`
    : `map:${activeKind}:endless:${endlessSeed}:${filter ?? 'all'}`;

  const rounds = useMemo(
    () =>
      buildRounds({
        maps,
        spots: MAP_SPOTS,
        kind: activeKind,
        seed: gameKey,
        count: ROUNDS,
        mapFilter: filter,
      }),
    [maps, activeKind, gameKey, filter],
  );

  const [results, setResults] = useKeyedState(gameKey, persist, []);
  const [guess, setGuess] = useState(null);
  const [revealing, setRevealing] = useState(false);

  // Nova partida: limpa o estado da rodada.
  useEffect(() => {
    setGuess(null);
    setRevealing(false);
  }, [gameKey]);

  const done = results.length >= rounds.length && rounds.length > 0;
  const finished = done && !revealing;
  const index = revealing ? results.length - 1 : results.length;
  const round = rounds[index];
  const total = results.reduce((s, r) => s + r.score, 0);

  useEffect(() => {
    // Só o modo de callouts conta como desafio do dia (é o que todo mundo pode jogar).
    if (finished && persist && activeKind === 'callout') markDailyDone(MAP_MODE_ID, day, total);
  }, [finished, persist, activeKind, day, total]);

  const confirm = () => {
    if (!guess || !round) return;
    const dist = distance(guess, round);
    setResults((prev) => [...prev, { x: guess.x, y: guess.y, dist, score: scoreFor(dist) }]);
    setRevealing(true);
  };

  const next = () => {
    setGuess(null);
    setRevealing(false);
  };

  // Espaço/Enter confirma ou avança, como no LostGamer.
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      if (e.key !== ' ' && e.key !== 'Enter') return;
      if (revealing) {
        e.preventDefault();
        next();
      } else if (guess) {
        e.preventDefault();
        confirm();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const setKind = (k) => {
    setKindState(k);
    save('map:kind', k);
  };

  const switchVariant = (v) => {
    if (v === variant) return;
    if (v === 'endless') setEndlessSeed(newSeed());
    setVariant(v);
  };

  const last = revealing ? results[results.length - 1] : null;

  return (
    <section className="mode">
      <header className="mode__header">
        <h1 className="mode__title">Onde estou?</h1>
        <VariantToggle value={variant} onChange={switchVariant} />
      </header>

      <div className="map-controls">
        <div className="toggle" role="radiogroup" aria-label="Tipo de rodada">
          {KINDS.map((k) => {
            const unavailable = k.value === 'image' && !hasSpots;
            return (
              <button
                key={k.value}
                type="button"
                role="radio"
                aria-checked={activeKind === k.value}
                disabled={unavailable}
                title={unavailable ? 'Nenhuma imagem cadastrada ainda (veja #/mapa/editor)' : undefined}
                className={`toggle__option ${activeKind === k.value ? 'is-active' : ''}`}
                onClick={() => setKind(k.value)}
              >
                {k.label}
                {unavailable && ' · em breve'}
              </button>
            );
          })}
        </div>

        {!persist && (
          <select
            className="select"
            value={mapFilter ?? ''}
            onChange={(e) => setMapFilter(e.target.value || null)}
            aria-label="Mapa"
          >
            <option value="">Todos os mapas</option>
            {maps.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {finished ? (
        <Summary
          rounds={rounds}
          results={results}
          variant={variant}
          kind={activeKind}
          onNext={() => setEndlessSeed(newSeed())}
          onPlayEndless={() => switchVariant('endless')}
        />
      ) : round ? (
        <>
          <div className="hud">
            <span>
              Rodada <strong>{index + 1}</strong>/{rounds.length}
            </span>
            <span>
              <strong>{formatPoints(total)}</strong> pts
            </span>
          </div>

          <div className="map-play">
            <Prompt round={round} />

            <div className="map-play__board">
              <MapBoard
                key={`${gameKey}:${index}`}
                map={round.map}
                guess={revealing ? last : guess}
                answer={revealing ? round : null}
                onPick={setGuess}
                disabled={revealing}
              />

              {revealing ? (
                <div className="reveal">
                  <p className="reveal__score">+{formatPoints(last.score)}</p>
                  <p className="reveal__detail">
                    {last.score === MAX_SCORE
                      ? 'Na mosca!'
                      : `Errou por ${Math.round(last.dist * 100)}% do mapa.`}
                    {round.note && ` ${round.note}.`}
                  </p>
                  <button type="button" className="btn" onClick={next}>
                    {results.length >= rounds.length ? 'Ver resultado' : 'Próxima rodada'}
                  </button>
                </div>
              ) : (
                <button type="button" className="btn btn--block" disabled={!guess} onClick={confirm}>
                  {guess ? 'Confirmar palpite' : 'Clique no minimapa'}
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <StatusScreen type="error" message="Não há rodadas disponíveis para essa combinação." />
      )}
    </section>
  );
}

export default function MapMode() {
  const { maps, status, retry } = useMaps();
  if (status === 'loading') return <StatusScreen message="Carregando mapas…" />;
  if (status === 'error') {
    return (
      <StatusScreen
        type="error"
        message="Não foi possível carregar os mapas. Verifique sua conexão."
        onRetry={retry}
      />
    );
  }
  return <MapGame maps={maps} />;
}
