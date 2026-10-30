import { MODES } from '../modes/registry';

export default function Home() {
  return (
    <section className="home">
      <header className="home__header">
        <p className="home__eyebrow">Minigames de Valorant</p>
        <h1 className="home__title">
          Escolha seu <span>desafio</span>
        </h1>
        <p className="home__lead">Desafios novos todo dia à meia-noite, ou jogue rodadas sem fim no modo infinito.</p>
      </header>

      <ul className="home__grid">
        {MODES.map((m, i) => {
          const soon = !m.Component;
          const content = (
            <>
              <span className="game-card__glyph" aria-hidden="true">
                {m.glyph}
              </span>
              <span className="game-card__index">{String(i + 1).padStart(2, '0')}</span>
              <h2 className="game-card__title">{m.title}</h2>
              <p className="game-card__desc">{m.description}</p>
              <span className="game-card__cta">{soon ? 'Em breve' : 'Jogar →'}</span>
            </>
          );

          return (
            <li key={m.path}>
              {soon ? (
                <div className="game-card is-soon" aria-disabled="true">
                  {content}
                </div>
              ) : (
                <a className="game-card" href={`#/${m.path}`}>
                  {content}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
