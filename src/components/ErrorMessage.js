import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div style={{
      backgroundColor: '#ffebee',
      color: '#c62828',
      padding: '15px',
      borderRadius: '8px',
      margin: '20px 0',
      border: '1px solid #ef9a9a',
      textAlign: 'center'
    }}>
      <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
        ❌ Ошибка: {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '8px 16px',
            backgroundColor: '#c62828',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Повторить
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
