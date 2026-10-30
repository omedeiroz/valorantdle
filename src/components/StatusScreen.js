export default function StatusScreen({ type = 'loading', message, onRetry }) {
  return (
    <div className={`status status--${type}`} role={type === 'error' ? 'alert' : 'status'}>
      {type === 'loading' && <span className="status__spinner" aria-hidden="true" />}
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
