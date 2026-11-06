import { useState } from 'react';
import { normalize } from '../utils/compare';

/**
 * Bônus de digitar uma palavra, com algumas chances.
 * Ignora acentos e maiúsculas ao conferir.
 */
export default function WordBonus({ question, answer, tries, maxTries, onTry }) {
  const [text, setText] = useState('');
  const hit = tries.some((t) => normalize(t) === normalize(answer));
  const done = hit || tries.length >= maxTries;
  const left = maxTries - tries.length;

  const submit = (e) => {
    e.preventDefault();
    const word = text.trim();
    if (!word || done) return;
    onTry(word);
    setText('');
  };

  return (
    <section className="bonus" aria-live="polite">
      <p className="bonus__eyebrow">
        Bônus · {done ? 'encerrado' : `${left} ${left === 1 ? 'chance' : 'chances'}`}
      </p>
      <h2 className="bonus__question">{question}</h2>
      <p className="word__hint">
        {answer.length} letras · começa com <strong>{answer[0].toUpperCase()}</strong>
      </p>

      {!done && (
        <form className="search__field word__field" onSubmit={submit}>
          <input
            className="search__input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite a palavra que falta…"
            autoComplete="off"
            spellCheck={false}
            autoFocus
            aria-label="Palavra que falta"
          />
          <button type="submit" className="search__submit" disabled={!text.trim()} aria-label="Enviar palavra">
            ➤
          </button>
        </form>
      )}

      {tries.length > 0 && (
        <ul className="word__tries">
          {tries.map((t, i) => (
            <li key={i} className={normalize(t) === normalize(answer) ? 'is-correct' : 'is-wrong'}>
              {t}
            </li>
          ))}
        </ul>
      )}

      {done && (
        <p className={`bonus__verdict ${hit ? 'is-correct' : 'is-wrong'}`}>
          {hit ? 'Acertou a palavra!' : `A palavra era “${answer}”.`}
        </p>
      )}
    </section>
  );
}
