import { PICK_SOURCE } from '../data/agentMeta';
import { ATTRIBUTES, compareAgents } from '../utils/compare';

const COLUMNS = [{ key: 'agent', label: 'Agente' }, ...ATTRIBUTES];

const ARROW = { higher: '▲', lower: '▼' };
const STATUS_LABEL = {
  correct: 'correto',
  wrong: 'errado',
  higher: 'o da resposta é maior',
  lower: 'o da resposta é menor',
};

function Cell({ column, agent, cell, index }) {
  const style = { animationDelay: `${index * 110}ms` };
  const className = `cell cell--${cell.status === 'correct' ? 'correct' : 'wrong'}`;

  if (column === 'agent') {
    return (
      <div className={`${className} cell--agent`} style={style} title={agent.name} role="cell">
        <img src={agent.icon} alt={agent.name} />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={style}
      role="cell"
      aria-label={`${cell.value}: ${STATUS_LABEL[cell.status]}`}
    >
      <span>{cell.value}</span>
      {ARROW[cell.status] && <span className="cell__arrow">{ARROW[cell.status]}</span>}
    </div>
  );
}

export default function GuessTable({ guesses, answer }) {
  if (!guesses.length || !answer) return null;

  // Palpite mais recente em cima.
  const rows = [...guesses].reverse();

  return (
    <>
      <div className="guess-table-scroll">
        <div className="guess-table" role="table" aria-label="Seus palpites">
          <div className="guess-table__row guess-table__head" role="row">
            {COLUMNS.map((c) => (
              <div key={c.key} role="columnheader">
                {c.label}
              </div>
            ))}
          </div>

          {rows.map((agent) => {
            const comparison = compareAgents(agent, answer);
            return (
              <div key={agent.id} className="guess-table__row" role="row">
                {COLUMNS.map((c, i) => (
                  <Cell key={c.key} column={c.key} agent={agent} cell={comparison[c.key]} index={i} />
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <p className="guess-table__source">Pick na função: {PICK_SOURCE}</p>
    </>
  );
}
