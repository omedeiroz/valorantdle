const OPTIONS = [
  { value: 'daily', label: 'Diário' },
  { value: 'endless', label: 'Infinito' },
];

export default function VariantToggle({ value, onChange }) {
  return (
    <div className="toggle" role="radiogroup" aria-label="Tipo de partida">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          className={`toggle__option ${value === o.value ? 'is-active' : ''}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
