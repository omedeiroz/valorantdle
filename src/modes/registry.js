import AgentMode from './AgentMode';
import AbilityMode from './AbilityMode';

/**
 * Lista central dos minigames. O menu inicial e as abas do topo saem daqui.
 * Para criar um minigame novo, adicione uma entrada (sem `Component` ele aparece como "em breve").
 */
export const MODES = [
  {
    path: 'agente',
    label: 'Agente',
    title: 'Adivinhe o agente',
    description: 'Descubra o agente secreto comparando gênero, função, lançamento, ultimate e pick.',
    glyph: '?',
    Component: AgentMode,
  },
  {
    path: 'habilidade',
    label: 'Habilidade',
    title: 'De quem é a habilidade?',
    description: 'Reconheça o agente pelo ícone da habilidade e acerte a tecla no bônus.',
    glyph: 'Q',
    Component: AbilityMode,
  },
  {
    path: 'mapa',
    label: 'Mapa',
    title: 'Onde estou?',
    description: 'Veja um ponto de um mapa e marque no minimapa onde ele fica, no estilo LostGamer.',
    glyph: '⌖',
    Component: null,
  },
];

export const PLAYABLE_MODES = MODES.filter((m) => m.Component);
