import { useEffect, useRef } from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { useDailyProgress } from '../hooks/useDailyProgress';
import { MODES } from '../modes/registry';

/** Menu lateral com todos os minigames, acessível de qualquer tela. */
export default function SideMenu({ open, onClose, currentPath }) {
  const panelRef = useRef(null);
  const countdown = useCountdown(open);
  const { progress, done, total } = useDailyProgress();

  // Esc fecha; o foco vai para o painel ao abrir.
  useEffect(() => {
    if (!open) return undefined;
    panelRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <div className={`drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="drawer__backdrop" onClick={onClose} />
      <aside
        ref={panelRef}
        className="drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        tabIndex={-1}
      >
        <div className="drawer__head">
          <span className="brand">
            VALORANT<span>DLE</span>
          </span>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar menu">
            ✕
          </button>
        </div>

        <nav className="drawer__nav" aria-label="Minigames">
          <a
            href="#/"
            className={`drawer__link ${currentPath === '' ? 'is-active' : ''}`}
            onClick={onClose}
            tabIndex={open ? 0 : -1}
          >
            <span className="drawer__num">00</span>
            <span className="drawer__label">Início</span>
          </a>

          <p className="drawer__section">Minigames</p>

          {MODES.map((m, i) => {
            const soon = !m.Component;
            const attempts = progress[m.id];
            const content = (
              <>
                <span className="drawer__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="drawer__label">{m.label}</span>
                {soon ? (
                  <span className="drawer__status is-soon">Em breve</span>
                ) : attempts != null ? (
                  <span className="drawer__status is-done" title={`Feito em ${attempts}`}>
                    ✓
                  </span>
                ) : (
                  <span className="drawer__status is-todo" title="Desafio de hoje pendente" />
                )}
              </>
            );

            return soon ? (
              <div key={m.path} className="drawer__link is-soon">
                {content}
              </div>
            ) : (
              <a
                key={m.path}
                href={`#/${m.path}`}
                className={`drawer__link ${currentPath === m.path ? 'is-active' : ''}`}
                onClick={onClose}
                tabIndex={open ? 0 : -1}
              >
                {content}
              </a>
            );
          })}
        </nav>

        <div className="drawer__foot">
          <p>
            Hoje: <strong>{done}/{total}</strong> desafios
          </p>
          <p>
            Novos em <time>{countdown}</time>
          </p>
        </div>
      </aside>
    </div>
  );
}
