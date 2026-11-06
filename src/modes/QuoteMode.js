import { useMemo } from 'react';
import { useAgents } from '../context/AgentsContext';
import { QUOTES } from '../data/quotes';
import GuessMode from './GuessMode';

export const QUOTE_MODE_ID = 'quote';

const BONUS = {
  kind: 'text',
  question: 'Qual palavra completa a fala?',
  maxTries: 3,
  answerOf: (quote) => quote.word,
};

const agentOf = (quote) => quote.agentData;

/** Divide a fala em [antes, palavra, depois], achando a palavra sem ligar para maiúsculas. */
function splitQuote(text, word) {
  const i = text.toLowerCase().indexOf(word.toLowerCase());
  if (i === -1) return [text, '', ''];
  return [text.slice(0, i), text.slice(i, i + word.length), text.slice(i + word.length)];
}

function QuoteClue({ quote, revealAll }) {
  const [before, word, after] = splitQuote(quote.text, quote.word);
  return (
    <blockquote className="quote">
      <span className="quote__mark" aria-hidden="true">
        “
      </span>
      <p className="quote__text">
        {before}
        {revealAll ? (
          <mark className="quote__word">{word}</mark>
        ) : (
          <span className="quote__blank" aria-label="palavra escondida">
            {'_'.repeat(Math.max(3, word.length))}
          </span>
        )}
        {after}
      </p>
      <p className="quote__who">— {revealAll ? quote.agentData.name : 'Quem disse isso?'}</p>
    </blockquote>
  );
}

export default function QuoteMode() {
  const { agents } = useAgents();

  // Liga cada fala ao agente da API; ignora falas com agente ou palavra inválidos.
  const quotes = useMemo(() => {
    const byName = new Map(agents.map((a) => [a.name.toLowerCase(), a]));
    return QUOTES.map((q, i) => ({ ...q, id: `q${i}`, agentData: byName.get(q.agent.toLowerCase()) })).filter(
      (q) => q.agentData && q.text.toLowerCase().includes(q.word.toLowerCase()),
    );
  }, [agents]);

  return (
    <GuessMode
      id={QUOTE_MODE_ID}
      label="Fala"
      title="Complete a fala"
      pool={quotes}
      agentOf={agentOf}
      layout="list"
      bonus={BONUS}
      help="Descubra quem disse a fala. Depois, complete a palavra que falta (3 chances)."
      renderClue={(quote, ctx) => <QuoteClue quote={quote} revealAll={ctx.revealAll} />}
    />
  );
}
