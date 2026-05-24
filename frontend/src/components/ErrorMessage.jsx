function ErrorMessage({ title = 'Error', message = '' }) {
  return (
    <div className="alert alert-error">
      <span className="alert-icon">❌</span>
      <div>
        <strong>{title}</strong>
        {message && <><br />{message}</>}
      </div>
    </div>
  );
}

export default ErrorMessage;
