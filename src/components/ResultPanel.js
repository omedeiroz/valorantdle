import { useState } from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { compareAgents, toEmojiRow } from '../utils/compare';
import { todayKey } from '../utils/daily';

function buildShareText({ modeLabel, guesses, answer, variant, bonusResult }) {
  const header =
    variant === 'daily'
      ? `Valorantdle · ${modeLabel} · ${todayKey()}`
      : `Valorantdle · ${modeLabel} (infinito)`;
  const rows = guesses.map((g) => toEmojiRow(compareAgents(g, answer)));
  const plural = guesses.length === 1 ? 'tentativa' : 'tentativas';
  const bonus = bonusResult == null ? '' : `\nBônus: ${bonusResult ? '✅' : '❌'}`;
  return `${header}\n${guesses.length} ${plural}${bonus}\n\n${rows.join('\n')}\n\n${window.location.href}`;
}

export default function ResultPanel({
  answer,
  guesses,
  variant,
  modeLabel,
  detail,
  bonusResult,
  onNext,
  onPlayEndless,
}) {
  const countdown = useCountdown(variant === 'daily');
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const text = buildShareText({ modeLabel, guesses, answer, variant, bonusResult });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copie o resultado:', text);
    }
  };

  const plural = guesses.length === 1 ? 'tentativa' : 'tentativas';

  return (
    <section className="result" aria-live="polite">
      <img className="result__portrait" src={answer.portrait} alt="" />
      <div className="result__body">
        <p className="result__eyebrow">Você acertou!</p>
        <h2 className="result__title">{answer.name}</h2>
        {detail && <p className="result__detail">{detail}</p>}
        <p className="result__stats">
          <strong>{guesses.length}</strong> {plural}
          {bonusResult != null && <> · bônus {bonusResult ? '✅' : '❌'}</>}
        </p>

        <div className="result__actions">
          <button type="button" className="btn btn--ghost" onClick={share}>
            {copied ? 'Copiado!' : 'Compartilhar'}
          </button>
          {variant === 'endless' ? (
            <button type="button" className="btn" onClick={onNext}>
              Próxima rodada
            </button>
          ) : (
            <button type="button" className="btn" onClick={onPlayEndless}>
              Jogar no infinito
            </button>
          )}
        </div>

        {variant === 'daily' && (
          <p className="result__next">
            Próximo desafio em <time>{countdown}</time>
          </p>
        )}
      </div>
    </section>
  );
}
