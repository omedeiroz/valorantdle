import { useEffect, useState } from 'react';
import { MAP_SPOTS } from '../data/mapSpots';
import { useMaps } from '../hooks/useMaps';
import MapBoard from '../components/MapBoard';
import StatusScreen from '../components/StatusScreen';

const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-');

/**
 * Ferramenta para cadastrar pontos com imagem (#/mapa/editor).
 * Não aparece no menu: é só para quem mantém o site.
 */
function Editor({ maps }) {
  const [mapId, setMapId] = useState(maps[0].id);
  const [preview, setPreview] = useState(null);
  const [imagePath, setImagePath] = useState('');
  const [note, setNote] = useState('');
  const [point, setPoint] = useState(null);
  const [showCallouts, setShowCallouts] = useState(false);
  const [copied, setCopied] = useState(false);

  const map = maps.find((m) => m.id === mapId);
  const existing = MAP_SPOTS.filter((s) => s.map === mapId).length;

  // Sugere um nome de arquivo quando troca de mapa.
  useEffect(() => {
    setImagePath(`/spots/${slug(map.name)}-${existing + 1}.jpg`);
    setPoint(null);
  }, [map.name, existing]);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    const ext = file.name.split('.').pop().toLowerCase();
    setImagePath((p) => p.replace(/\.[a-z0-9]+$/, `.${ext}`));
  };

  const line = point
    ? `  { map: '${mapId}', image: '${imagePath}', x: ${point.x.toFixed(4)}, y: ${point.y.toFixed(4)}${
        note.trim() ? `, note: '${note.trim().replace(/'/g, "\\'")}'` : ''
      } }, // ${map.name}`
    : '';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(line);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt('Copie a linha:', line);
    }
  };

  return (
    <section className="mode editor">
      <header className="mode__header">
        <h1 className="mode__title">Editor de pontos</h1>
      </header>

      <ol className="editor__steps">
        <li>Escolha o mapa e carregue o print (ele não é enviado para lugar nenhum).</li>
        <li>Clique no minimapa exatamente onde o print foi tirado.</li>
        <li>
          Salve o print em <code>public{imagePath}</code> e cole a linha gerada em{' '}
          <code>src/data/mapSpots.js</code>.
        </li>
      </ol>

      <div className="editor__grid">
        <div className="editor__side">
          <label className="field">
            <span>Mapa</span>
            <select className="select" value={mapId} onChange={(e) => setMapId(e.target.value)}>
              {maps.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Print</span>
            <input type="file" accept="image/*" onChange={onFile} />
          </label>
          {preview && <img className="editor__preview" src={preview} alt="Print carregado" />}

          <label className="field">
            <span>Caminho do arquivo</span>
            <input className="input" value={imagePath} onChange={(e) => setImagePath(e.target.value)} />
          </label>

          <label className="field">
            <span>Observação (opcional)</span>
            <input
              className="input"
              placeholder="Ex.: Topo do Heaven do A"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>

          <label className="chip-check">
            <input type="checkbox" checked={showCallouts} onChange={(e) => setShowCallouts(e.target.checked)} />
            Mostrar callouts (conferir se os pontos da API batem com o minimapa)
          </label>

          <p className="editor__count">
            {existing} {existing === 1 ? 'ponto cadastrado' : 'pontos cadastrados'} em {map.name}.
          </p>
        </div>

        <div>
          <MapBoard
            map={map}
            guess={point}
            onPick={setPoint}
            extras={showCallouts ? map.callouts : undefined}
          />
        </div>
      </div>

      {line && (
        <div className="editor__output">
          <pre>{line}</pre>
          <button type="button" className="btn" onClick={copy}>
            {copied ? 'Copiado!' : 'Copiar linha'}
          </button>
        </div>
      )}
    </section>
  );
}

export default function MapEditor() {
  const { maps, status, retry } = useMaps();
  if (status === 'loading') return <StatusScreen message="Carregando mapas…" />;
  if (status === 'error') {
    return <StatusScreen type="error" message="Não foi possível carregar os mapas." onRetry={retry} />;
  }
  return <Editor maps={maps} />;
}
