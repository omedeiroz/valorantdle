import { useKeyedState } from '../hooks/useKeyedState';
import { useSkins } from '../hooks/useSkins';
import { compareNumber, compareText } from '../utils/compare';
import StatusScreen from '../components/StatusScreen';
import ZoomClue, { radiantLabel } from '../components/ZoomClue';
import GuessMode from './GuessMode';

export const SKIN_MODE_ID = 'skin';

// Skins são imagens largas (a arma deitada): foco no meio, zoom abrindo a cada erro.
const ZOOM = { start: 5, step: 0.5, min: 1.3 };
const FOCUS = { x: [28, 72], y: [42, 58] };

// Colunas comparadas a cada palpite.
const SKIN_ATTRIBUTES = [
  { key: 'weapon', label: 'Arma', compare: compareText, format: (v) => v },
  { key: 'category', label: 'Tipo', compare: compareText, format: (v) => v },
  { key: 'collection', label: 'Coleção', compare: compareText, format: (v) => v },
  // Edição: ▲ = a resposta é de uma edição mais cara; ▼ = mais barata.
  { key: 'tier', label: 'Edição', compare: compareNumber, format: (_, skin) => skin.tierName },
];

const itself = (skin) => skin;

function SkinGame({ skins }) {
  const [radiant, setRadiant] = useKeyedState('skin:radiant', true, { gray: false, spin: false });

  return (
    <GuessMode
      id={SKIN_MODE_ID}
      label={radiantLabel('Skin', radiant)}
      title="Que skin é essa?"
      pool={skins}
      options={skins}
      agentOf={itself}
      searchPlaceholder="Digite o nome de uma skin…"
      attributes={SKIN_ATTRIBUTES}
      firstLabel="Skin"
      tableFooter={null}
      help={
        <>
          Cada palpite mostra o que bate com a skin secreta: arma, tipo, coleção e edição. Na edição, ▲ quer dizer
          que a resposta é de uma edição mais cara (Select → Deluxe → Premium → Exclusive → Ultra) e ▼, mais barata.
        </>
      }
      renderClue={(skin, ctx) => (
        <ZoomClue
          {...ctx}
          itemId={skin.id}
          image={skin.portrait}
          answerName={skin.name}
          hiddenAlt="Skin secreta ampliada"
          zoom={ZOOM}
          focus={FOCUS}
          aspect="2 / 1"
          radiant={radiant}
          setRadiant={setRadiant}
        />
      )}
    />
  );
}

export default function SkinMode() {
  const { skins, status, retry } = useSkins();
  if (status === 'loading') return <StatusScreen message="Carregando skins…" />;
  if (status === 'error') {
    return (
      <StatusScreen
        type="error"
        message="Não foi possível carregar as skins. Verifique sua conexão."
        onRetry={retry}
      />
    );
  }
  return <SkinGame skins={skins} />;
}
