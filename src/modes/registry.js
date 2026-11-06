import AgentMode from './AgentMode';
import AbilityMode from './AbilityMode';
import ZoomMode from './ZoomMode';
import MapMode from './MapMode';
import MapZoomMode from './MapZoomMode';
import SkinMode from './SkinMode';
import QuoteMode from './QuoteMode';
import { QUOTES } from '../data/quotes';

/**
 * Lista central dos minigames. O menu inicial, o menu lateral e as abas do topo saem daqui.
 * Para criar um minigame novo, adicione uma entrada (sem `Component` ele aparece como "em breve").
 *
 * - id:   identificador usado no progresso salvo (deve ser o mesmo `id` passado ao GuessMode)
 * - path: rota (#/path)
 * - art:  ilustração do card no menu inicial ('mosaic' | 'ability' | 'zoom' | 'skin' | 'quote' | 'mapzoom' | 'map')
 * - standalone: não depende da lista de agentes (carrega os próprios dados)
 * - formatDone: como mostrar o resultado do desafio diário (padrão: tentativas)
 */
export const MODES = [
  {
    id: 'agent',
    path: 'agente',
    label: 'Agente',
    title: 'Adivinhe o agente',
    description: 'Compare gênero, função, lançamento, ultimate e pick na função até achar o agente secreto.',
    art: 'mosaic',
    Component: AgentMode,
  },
  {
    id: 'ability',
    path: 'habilidade',
    label: 'Habilidade',
    title: 'De quem é a habilidade?',
    description: 'Reconheça o agente pelo ícone da habilidade e acerte a tecla no bônus.',
    art: 'ability',
    Component: AbilityMode,
  },
  {
    id: 'zoom',
    path: 'zoom',
    label: 'Zoom',
    title: 'Que agente é esse?',
    description: 'Um pedaço bem ampliado do retrato. No Radiante, sem cor e/ou girado.',
    art: 'zoom',
    Component: ZoomMode,
  },
  {
    id: 'skin',
    path: 'skin',
    label: 'Skin',
    title: 'Que skin é essa?',
    description: 'Skins de Vandal, Phantom, Ghost, Operator, Sheriff e faca. Pistas de arma, coleção e edição a cada palpite.',
    art: 'skin',
    Component: SkinMode,
    standalone: true,
  },
  {
    id: 'quote',
    path: 'fala',
    label: 'Fala',
    title: 'Complete a fala',
    description: 'Descubra qual agente disse a frase e complete a palavra que falta.',
    art: 'quote',
    // Só fica jogável quando houver falas cadastradas em src/data/quotes.js.
    Component: QUOTES.length ? QuoteMode : null,
  },
  {
    id: 'mapzoom',
    path: 'que-mapa',
    label: 'Que mapa',
    title: 'Que mapa é esse?',
    description: 'Um pedaço ampliado do minimapa, que abre a cada erro. No Radiante, o minimapa gira.',
    art: 'mapzoom',
    Component: MapZoomMode,
    standalone: true,
  },
  {
    id: 'map',
    path: 'mapa',
    label: 'Onde estou',
    title: 'Onde estou?',
    description: 'Marque no minimapa onde fica cada callout. Quanto mais perto, mais pontos.',
    art: 'map',
    Component: MapMode,
    standalone: true,
    formatDone: (points) => `${points.toLocaleString('pt-BR')} pts`,
  },
];

export const PLAYABLE_MODES = MODES.filter((m) => m.Component);
