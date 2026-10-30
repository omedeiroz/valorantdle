import { useMemo } from 'react';
import { useKeyedState } from '../hooks/useKeyedState';
import { useMaps } from '../hooks/useMaps';
import StatusScreen from '../components/StatusScreen';
import ZoomClue, { RADIANT_OPTIONS, radiantLabel } from '../components/ZoomClue';
import GuessMode from './GuessMode';

export const MAP_ZOOM_ID = 'mapzoom';

// São poucos mapas, então começa bem perto e abre devagar para não virar chute.
const ZOOM = { start: 9, step: 0.75, min: 2 };

// As artes de mapa preenchem a imagem toda; evita só as bordas.
const FOCUS = { x: [22, 78], y: [22, 78] };

// Nas artes de mapa a cor não ajuda a disfarçar; só o giro faz sentido.
const MAP_RADIANT = RADIANT_OPTIONS.filter((o) => o.key === 'spin');

const itself = (map) => map;

function MapZoomGame({ maps }) {
  const [radiant, setRadiant] = useKeyedState('mapzoom:radiant', true, { spin: false });

  // Formato que a busca, a lista de palpites e a tela de vitória esperam.
  const options = useMemo(
    () => maps.map((m) => ({ id: m.id, name: m.name, icon: m.thumb, portrait: m.splash, wideArt: true })),
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
      renderClue={(map, ctx) => (
        <ZoomClue
          {...ctx}
          itemId={map.id}
          image={map.portrait}
          answerName={map.name}
          hiddenAlt="Mapa secreto ampliado"
          zoom={ZOOM}
          focus={FOCUS}
          aspect="16 / 9"
          fit="cover"
          radiant={radiant}
          setRadiant={setRadiant}
          radiantOptions={MAP_RADIANT}
        />
      )}
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
  return <MapZoomGame maps={maps.filter((m) => m.splash)} />;
}
