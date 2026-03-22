import React from 'react';

const LoadingSpinner = ({ fullPage, label = 'Загрузка…' }) => {
  const wrapClass = fullPage ? 'spinner-wrap spinner-wrap--full' : 'spinner-wrap';

  return (
    <div className={wrapClass} role="status" aria-live="polite">
      <div className="spinner" aria-hidden />
      <span className="spinner-label">{label}</span>
    </div>
  );
};

export default LoadingSpinner;
