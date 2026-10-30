// Dados que a valorant-api.com não fornece.
// Ao lançar um agente novo, basta adicionar uma linha aqui.
// Campos ausentes aparecem como "?" no jogo, sem quebrar nada.
//
// gender: gênero do agente
// year:   ano de lançamento
// ult:    custo da ultimate em pontos
// pick:   posição no ranking de pick da ranqueada (1 = mais escolhido)

/** De onde veio o ranking de pick. Atualize junto com os números. */
export const PICK_SOURCE = 'Ranqueada, todos os elos · Temporada 2026, Ato 5 · MetaBot';

export const AGENT_META = {
  Astra: { gender: 'Feminino', year: 2021, ult: 7, pick: 19 },
  Breach: { gender: 'Masculino', year: 2020, ult: 9, pick: 26 },
  Brimstone: { gender: 'Masculino', year: 2020, ult: 8, pick: 24 },
  Chamber: { gender: 'Masculino', year: 2021, ult: 8, pick: 3 },
  Clove: { gender: 'Não-binárie', year: 2024, ult: 8, pick: 1 },
  Cypher: { gender: 'Masculino', year: 2020, ult: 7, pick: 12 },
  Deadlock: { gender: 'Feminino', year: 2023, ult: 7, pick: 23 },
  Fade: { gender: 'Feminino', year: 2022, ult: 8, pick: 6 },
  Gekko: { gender: 'Masculino', year: 2023, ult: 8, pick: 29 },
  Harbor: { gender: 'Masculino', year: 2022, ult: 7, pick: 28 },
  Hush: { gender: 'Feminino', year: 2026, ult: 8, pick: null }, // lançada no Ato 6
  Iso: { gender: 'Masculino', year: 2023, ult: 7, pick: 20 },
  Jett: { gender: 'Feminino', year: 2020, ult: 8, pick: 2 },
  'KAY/O': { gender: 'Masculino', year: 2021, ult: 8, pick: 27 },
  Killjoy: { gender: 'Feminino', year: 2020, ult: 9, pick: 16 },
  Miks: { gender: 'Masculino', year: 2026, ult: 8, pick: 22 },
  Neon: { gender: 'Feminino', year: 2022, ult: 7, pick: 7 },
  Omen: { gender: 'Masculino', year: 2020, ult: 7, pick: 14 },
  Phoenix: { gender: 'Masculino', year: 2020, ult: 6, pick: 9 },
  Raze: { gender: 'Feminino', year: 2020, ult: 8, pick: 11 },
  Reyna: { gender: 'Feminino', year: 2020, ult: 6, pick: 5 },
  Sage: { gender: 'Feminino', year: 2020, ult: 7, pick: 18 },
  Skye: { gender: 'Feminino', year: 2020, ult: 8, pick: 13 },
  Sova: { gender: 'Masculino', year: 2020, ult: 8, pick: 4 },
  Tejo: { gender: 'Masculino', year: 2025, ult: 9, pick: 21 },
  Veto: { gender: 'Masculino', year: 2025, ult: 7, pick: 25 },
  Viper: { gender: 'Feminino', year: 2020, ult: 9, pick: 15 },
  Vyse: { gender: 'Feminino', year: 2024, ult: 8, pick: 17 },
  Waylay: { gender: 'Feminino', year: 2025, ult: 8, pick: 8 },
  Yoru: { gender: 'Masculino', year: 2021, ult: 7, pick: 10 },
};

export const UNKNOWN = 'Desconhecido';
