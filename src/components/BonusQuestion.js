/**
 * Pergunta extra de uma tentativa só, exibida depois de acertar o agente.
 * `picked` é a opção escolhida (ou null enquanto não respondeu).
 */
export default function BonusQuestion({ question, options, correct, picked, onPick }) {
  const answered = picked != null;

  return (
    <section className="bonus" aria-live="polite">
      <p className="bonus__eyebrow">Bônus · uma chance</p>
      <h2 className="bonus__question">{question}</h2>

      <div className="bonus__options">
        {options.map((o) => {
          let state = '';
          if (answered && o.value === correct) state = 'is-correct';
          else if (answered && o.value === picked) state = 'is-wrong';

          return (
            <button
              key={o.value}
              type="button"
              className={`bonus__option ${state}`}
              disabled={answered}
              onClick={() => onPick(o.value)}
            >
              <kbd>{o.key}</kbd>
              <span>{o.label}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <p className={`bonus__verdict ${picked === correct ? 'is-correct' : 'is-wrong'}`}>
          {picked === correct ? 'Acertou o bônus!' : 'Errou o bônus.'}
        </p>
      )}
    </section>
  );
}
