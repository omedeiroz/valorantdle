import { useId, useMemo, useRef, useState } from 'react';
import { normalize } from '../utils/compare';

const MAX_SUGGESTIONS = 8;

export default function SearchBar({ agents, excludeIds, onSelect, disabled }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listId = useId();

  const suggestions = useMemo(() => {
    const q = normalize(query);
    if (!q) return [];
    return agents
      .filter((a) => !excludeIds.includes(a.id))
      .map((a) => ({ agent: a, pos: normalize(a.name).indexOf(q) }))
      .filter((s) => s.pos !== -1)
      // Quem começa com o texto digitado aparece primeiro.
      .sort((a, b) => a.pos - b.pos || a.agent.name.localeCompare(b.agent.name))
      .slice(0, MAX_SUGGESTIONS)
      .map((s) => s.agent);
  }, [agents, excludeIds, query]);

  const choose = (agent) => {
    if (!agent) return;
    onSelect(agent);
    setQuery('');
    setOpen(false);
    setActive(0);
    inputRef.current?.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(suggestions[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const showList = open && suggestions.length > 0;

  return (
    <div className="search">
      <div className="search__field">
        <input
          ref={inputRef}
          type="text"
          className="search__input"
          placeholder={disabled ? 'Rodada concluída' : 'Digite o nome de um agente…'}
          value={query}
          disabled={disabled}
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-activedescendant={showList ? `${listId}-${active}` : undefined}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
        />
        <button
          type="button"
          className="search__submit"
          disabled={disabled || suggestions.length === 0}
          onClick={() => choose(suggestions[active])}
          aria-label="Enviar palpite"
        >
          ➤
        </button>
      </div>

      {showList && (
        <ul className="search__list" id={listId} role="listbox">
          {suggestions.map((agent, i) => (
            <li
              key={agent.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              className={`search__option ${i === active ? 'is-active' : ''}`}
              // mousedown evita que o blur do input feche a lista antes do clique.
              onMouseDown={(e) => {
                e.preventDefault();
                choose(agent);
              }}
              onMouseEnter={() => setActive(i)}
            >
              <img src={agent.icon} alt="" loading="lazy" />
              <span>{agent.name}</span>
              <small>{agent.role}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
