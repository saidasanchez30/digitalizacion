function Loading({ message = 'Cargando...' }) {
  return (
    <div className="spinner-wrapper">
      <div className="spinner" />
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>{message}</p>
    </div>
  );
}

export default Loading;
