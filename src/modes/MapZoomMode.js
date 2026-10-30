import { useMemo } from 'react';
import { useKeyedState } from '../hooks/useKeyedState';
import { useMaps } from '../hooks/useMaps';
import { seededFloat } from '../utils/daily';
import StatusScreen from '../components/StatusScreen';
import ZoomClue, { RADIANT_OPTIONS, radiantLabel } from '../components/ZoomClue';
import GuessMode from './GuessMode';

export const MAP_ZOOM_ID = 'mapzoom';

// Minimapa ampliado: começa perto e abre a cada erro.
const ZOOM = { start: 6, step: 0.6, min: 1.5 };

// No minimapa a cor não ajuda a disfarçar; só o giro faz sentido.
const MAP_RADIANT = RADIANT_OPTIONS.filter((o) => o.key === 'spin');

const itself = (map) => map;

function MapZoomGame({ maps }) {
  const [radiant, setRadiant] = useKeyedState('mapzoom:radiant', true, { spin: false });

  // Formato que a busca, a lista de palpites e a tela de vitória esperam.
  const options = useMemo(
    () =>
      maps.map((m) => ({
        id: m.id,
        name: m.name,
        icon: m.thumb,
        portrait: m.splash,
        wideArt: true,
        minimap: m.minimap,
        callouts: m.callouts,
      })),
    [maps],
  );

  return (
    <GuessMode
      id={MAP_ZOOM_ID}
      label={radiantLabel('Mapa', radiant, MAP_RADIANT)}
      title="Que mapa é esse?"
      pool={options}
      options={options}
      agentOf={itself}
      layout="list"
      searchPlaceholder="Digite o nome de um mapa…"
      renderClue={(map, ctx) => {
        // O foco cai sempre num callout, para nunca parar numa área vazia do minimapa.
        const spot = map.callouts[Math.floor(seededFloat(`${ctx.gameKey}:${map.id}:spot`) * map.callouts.length)];
        return (
          <ZoomClue
            {...ctx}
            itemId={map.id}
            image={map.minimap}
            answerName={map.name}
            hiddenAlt="Minimapa secreto ampliado"
            zoom={ZOOM}
            focusPoint={{ x: spot.x * 100, y: spot.y * 100 }}
            radiant={radiant}
            setRadiant={setRadiant}
            radiantOptions={MAP_RADIANT}
          />
        );
      }}
    />
  );
}

export default function MapZoomMode() {
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
  return <MapZoomGame maps={maps.filter((m) => m.minimap && m.callouts.length)} />;
}
