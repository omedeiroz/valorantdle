/** Lista simples de palpites (só certo ou errado), usada em modos sem tabela de atributos. */
export default function GuessList({ guesses, answer }) {
  if (!guesses.length || !answer) return null;

  return (
    <ul className="guess-list" aria-label="Seus palpites">
      {[...guesses].reverse().map((agent) => {
        const correct = agent.id === answer.id;
        return (
          <li key={agent.id} className={`guess-list__item ${correct ? 'is-correct' : 'is-wrong'}`}>
            <img src={agent.icon} alt="" />
            <span>{agent.name}</span>
            <span className="guess-list__mark" aria-label={correct ? 'correto' : 'errado'}>
              {correct ? '✓' : '✕'}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
