import { compareAgents, normalize, toEmojiRow } from './compare';
import { pickRandom, pickSeeded, todayKey } from './daily';
import { assignRoleRanks } from './ranking';

const jett = { id: 'jett', name: 'Jett', gender: 'Feminino', role: 'Duelista', year: 2020, ult: 8, pick: 2, rolePick: 1 };
const neon = { id: 'neon', name: 'Neon', gender: 'Feminino', role: 'Duelista', year: 2022, ult: 7, pick: 7, rolePick: 3 };
const sova = { id: 'sova', name: 'Sova', gender: 'Masculino', role: 'Iniciador', year: 2020, ult: 8, pick: 4, rolePick: 1 };

describe('compareAgents', () => {
  it('marca tudo como correto quando é o próprio agente', () => {
    expect(toEmojiRow(compareAgents(jett, jett))).toBe('🟩🟩🟩🟩🟩🟩');
  });

  it('indica se a resposta é mais recente ou mais antiga', () => {
    expect(compareAgents(jett, neon).year.status).toBe('higher');
    expect(compareAgents(neon, jett).year.status).toBe('lower');
  });

  it('compara gênero e função separadamente', () => {
    const c = compareAgents(sova, jett);
    expect(c.gender.status).toBe('wrong');
    expect(c.role.status).toBe('wrong');
    expect(c.year.status).toBe('correct');
  });

  it('compara custo da ultimate e ranking de pick com setas', () => {
    const c = compareAgents(neon, jett);
    expect(c.ult).toEqual({ value: '7 pts', status: 'higher' });
    expect(c.rolePick).toEqual({ value: '#3', status: 'lower' });
  });

  it('mostra agente sem ranking como "Novo"', () => {
    expect(compareAgents({ ...jett, id: 'x', rolePick: null }, jett).rolePick).toEqual({ value: 'Novo', status: 'wrong' });
  });

  it('trata ano desconhecido como errado', () => {
    expect(compareAgents({ ...jett, id: 'x', year: null }, jett).year.status).toBe('wrong');
  });
});

describe('assignRoleRanks', () => {
  it('ranqueia cada agente só entre os da mesma função', () => {
    const ranked = assignRoleRanks([
      { id: 'clove', role: 'Controlador', pick: 1 },
      { id: 'jett', role: 'Duelista', pick: 2 },
      { id: 'reyna', role: 'Duelista', pick: 5 },
      { id: 'omen', role: 'Controlador', pick: 14 },
      { id: 'hush', role: 'Duelista', pick: null },
    ]);
    const rank = Object.fromEntries(ranked.map((a) => [a.id, a.rolePick]));
    expect(rank).toEqual({ clove: 1, jett: 1, reyna: 2, omen: 2, hush: null });
  });
});

describe('normalize', () => {
  it('ignora acentos, caixa e símbolos', () => {
    expect(normalize('KAY/O')).toBe('kayo');
    expect(normalize('Não-binárie')).toBe('naobinarie');
  });
});

describe('daily', () => {
  it('escolhe sempre o mesmo item para a mesma semente', () => {
    const items = [jett, neon, sova];
    expect(pickSeeded(items, 'agent:2026-10-30')).toBe(pickSeeded(items, 'agent:2026-10-30'));
  });

  it('não repete o item anterior no modo infinito', () => {
    for (let i = 0; i < 50; i++) expect(pickRandom([jett, neon], jett)).toBe(neon);
  });

  it('usa o fuso de Brasília para virar o dia', () => {
    // 02:30 UTC do dia 31 ainda é dia 30 em Brasília (UTC-3).
    expect(todayKey(new Date('2026-10-31T02:30:00Z'))).toBe('2026-10-30');
    expect(todayKey(new Date('2026-10-31T03:30:00Z'))).toBe('2026-10-31');
  });
});
