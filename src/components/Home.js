import { useCountdown } from '../hooks/useCountdown';
import { useDailyProgress } from '../hooks/useDailyProgress';
import { MODES } from '../modes/registry';
import ModeArt from './ModeArt';

function StatusBadge({ value, format }) {
  if (value == null) return <span className="badge badge--todo">Desafio de hoje</span>;
  const text = format ? format(value) : `Feito em ${value} ${value === 1 ? 'tentativa' : 'tentativas'}`;
  return <span className="badge badge--done">✓ {text}</span>;
}

export default function Home() {
  const countdown = useCountdown();
  const { progress, done, total } = useDailyProgress();

  return (
    <section className="home">
      <header className="hero">
        <div className="hero__text">
          <p className="hero__eyebrow">Minigames de Valorant</p>
          <h1 className="hero__title">
            Escolha seu
            <br />
            <span>desafio</span>
          </h1>
          <p className="hero__lead">
            Um desafio novo por dia em cada minigame, igual para todo mundo. Ou jogue sem parar no modo infinito.
          </p>
        </div>

        <div className="hero__panel" aria-label="Progresso de hoje">
          <p className="hero__panel-label">Hoje</p>
          <p className="hero__panel-value">
            {done}
            <small>/{total}</small>
          </p>
          <div className="hero__bar" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}>
            {Array.from({ length: total }, (_, i) => (
              <span key={i} className={i < done ? 'is-filled' : ''} />
            ))}
          </div>
          <p className="hero__panel-foot">
            Novos desafios em <time>{countdown}</time>
          </p>
        </div>
      </header>

      <ul className="cards">
        {MODES.map((m, i) => {
          const soon = !m.Component;
          const inner = (
            <>
              <div className="card__art">
                <ModeArt type={m.art} />
              </div>
              <div className="card__body">
                <div className="card__top">
                  <span className="card__index">{String(i + 1).padStart(2, '0')}</span>
                  {soon ? <span className="badge badge--soon">Em breve</span> : <StatusBadge value={progress[m.id]} format={m.formatDone} />}
                </div>
                <h2 className="card__title">{m.title}</h2>
                <p className="card__desc">{m.description}</p>
                <span className="card__cta">{soon ? 'Em desenvolvimento' : 'Jogar'}</span>
              </div>
            </>
          );

          return (
            <li key={m.path}>
              {soon ? (
                <div className="card is-soon" aria-disabled="true">
                  {inner}
                </div>
              ) : (
                <a className="card" href={`#/${m.path}`}>
                  {inner}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
