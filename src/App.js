import './App.css';
import { AgentsProvider, useAgents } from './context/AgentsContext';
import { useHashRoute } from './hooks/useHashRoute';
import Home from './components/Home';
import StatusScreen from './components/StatusScreen';
import { PLAYABLE_MODES } from './modes/registry';

function GameScreen({ mode }) {
  const { status, retry } = useAgents();

  if (status === 'loading') return <StatusScreen message="Carregando agentes…" />;
  if (status === 'error') {
    return (
      <StatusScreen
        type="error"
        message="Não foi possível carregar os agentes. Verifique sua conexão."
        onRetry={retry}
      />
    );
  }

  const { Component } = mode;
  return <Component key={mode.path} />;
}

export default function App() {
  const route = useHashRoute();
  const mode = PLAYABLE_MODES.find((m) => m.path === route);

  return (
    <AgentsProvider>
      <div className="app">
        <header className="topbar">
          <a className="brand" href="#/" aria-label="Valorantdle, menu inicial">
            VALORANT<span>DLE</span>
          </a>
          <nav className="tabs" aria-label="Minigames">
            {PLAYABLE_MODES.map((m) => (
              <a
                key={m.path}
                href={`#/${m.path}`}
                className={`tabs__item ${m === mode ? 'is-active' : ''}`}
                aria-current={m === mode ? 'page' : undefined}
              >
                {m.label}
              </a>
            ))}
          </nav>
        </header>

        <main className={`main ${mode ? '' : 'main--wide'}`}>
          {mode ? <GameScreen mode={mode} /> : <Home />}
        </main>

        <footer className="footer">
          Projeto de fã, sem vínculo com a Riot Games. Dados de{' '}
          <a href="https://valorant-api.com" target="_blank" rel="noreferrer">
            valorant-api.com
          </a>
          .
        </footer>
      </div>
    </AgentsProvider>
  );
}
