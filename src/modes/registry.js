import AgentMode from './AgentMode';
import AbilityMode from './AbilityMode';
import ZoomMode from './ZoomMode';

/**
 * Lista central dos minigames. O menu inicial, o menu lateral e as abas do topo saem daqui.
 * Para criar um minigame novo, adicione uma entrada (sem `Component` ele aparece como "em breve").
 *
 * - id:   identificador usado no progresso salvo (deve ser o mesmo `id` passado ao GuessMode)
 * - path: rota (#/path)
 * - art:  ilustração do card no menu inicial ('mosaic' | 'ability' | 'zoom' | 'map')
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
    id: 'map',
    path: 'mapa',
    label: 'Mapa',
    title: 'Onde estou?',
    description: 'Veja um ponto de um mapa e marque no minimapa onde ele fica, no estilo LostGamer.',
    art: 'map',
    Component: null,
  },
];

export const PLAYABLE_MODES = MODES.filter((m) => m.Component);
