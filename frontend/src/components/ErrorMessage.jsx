import React from 'react';

function ErrorMessage({ title = 'Error', message = '' }) {
  return (
    <div className="alert alert-error">
      <h4 style={{ marginBottom: '0.5rem' }}>{title}</h4>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ErrorMessage;
