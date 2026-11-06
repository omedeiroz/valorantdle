import { PICK_SOURCE } from '../data/agentMeta';
import { ATTRIBUTES, compareAgents } from '../utils/compare';


const ARROW = { higher: '▲', lower: '▼' };
const STATUS_LABEL = {
  correct: 'correto',
  wrong: 'errado',
  higher: 'a resposta está acima',
  lower: 'a resposta está abaixo',
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

/**
 * attributes:  colunas comparadas (padrão: as de agente)
 * firstLabel:  título da primeira coluna (a imagem do palpite)
 * footer:      texto embaixo da tabela (padrão: fonte do ranking de pick)
 */
export default function GuessTable({
  guesses,
  answer,
  attributes = ATTRIBUTES,
  firstLabel = 'Agente',
  footer = `Pick na função: ${PICK_SOURCE}`,
}) {
  if (!guesses.length || !answer) return null;
  const columns = [{ key: 'agent', label: firstLabel }, ...attributes];

  // Palpite mais recente em cima.
  const rows = [...guesses].reverse();

  return (
    <>
      <div className="guess-table-scroll">
        <div
          className="guess-table"
          role="table"
          aria-label="Seus palpites"
          style={{ '--cols': attributes.length }}
        >
          <div className="guess-table__row guess-table__head" role="row">
            {columns.map((c) => (
              <div key={c.key} role="columnheader">
                {c.label}
              </div>
            ))}
          </div>

          {rows.map((agent) => {
            const comparison = compareAgents(agent, answer, attributes);
            return (
              <div key={agent.id} className="guess-table__row" role="row">
                {columns.map((c, i) => (
                  <Cell key={c.key} column={c.key} agent={agent} cell={comparison[c.key]} index={i} />
                ))}
              </div>
            );
          })}
        </div>
      </div>
      {footer && <p className="guess-table__source">{footer}</p>}
    </>
  );
}
