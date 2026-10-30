/**
 * Converte o ranking geral de pick (`pick`) em ranking dentro da função (`rolePick`).
 * Ex.: se os duelistas mais escolhidos são Jett (#2 geral) e Reyna (#5 geral),
 * Jett vira #1 e Reyna #2 entre os duelistas.
 * Agentes sem `pick` (lançamentos recentes) ficam com `rolePick: null`.
 */
export function assignRoleRanks(agents) {
  const byRole = new Map();
  for (const agent of agents) {
    if (agent.pick == null) continue;
    if (!byRole.has(agent.role)) byRole.set(agent.role, []);
    byRole.get(agent.role).push(agent);
  }

  const rank = new Map();
  for (const group of byRole.values()) {
    group
      .sort((a, b) => a.pick - b.pick)
      .forEach((agent, i) => rank.set(agent.id, i + 1));
  }

  return agents.map((agent) => ({ ...agent, rolePick: rank.get(agent.id) ?? null }));
}
