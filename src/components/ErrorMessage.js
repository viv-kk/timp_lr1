import React from 'react';

const ErrorMessage = ({ message, onRetry, onClose }) => {
  return (
    <div className="error-box" role="alert">
      <div className="error-box-inner">
        <p className="error-box-text">{message}</p>
        <div className="error-box-actions">
          {onRetry && (
            <button type="button" className="btn btn--danger btn--sm" onClick={onRetry}>
              Повторить
            </button>
          )}
          {onClose && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={onClose}>
              Закрыть
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
