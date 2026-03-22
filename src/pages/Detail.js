import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useIncidents } from '../context/IncidentsContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentIncident,
    loading,
    error,
    fetchIncidentById,
    deleteIncident,
    clearError,
    setCurrentIncident
  } = useIncidents();

  useEffect(() => {
    clearError();
    setCurrentIncident(null);
    fetchIncidentById(id).catch(() => {});
  }, [id, fetchIncidentById, clearError, setCurrentIncident]);

  const handleDelete = async () => {
    if (!window.confirm(`Удалить инцидент «${currentIncident?.name}»?`)) {
      return;
    }
    try {
      await deleteIncident(id);
      navigate('/');
    } catch {
      /* сообщение в контексте */
    }
  };

  const getSeverityText = (severity) => {
    switch (severity) {
      case 'критический': return 'Критический';
      case 'высокий': return 'Высокий';
      case 'средний': return 'Средний';
      case 'низкий': return 'Низкий';
      default: return severity || '—';
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'критический': return 'severity-pill severity-pill--critical';
      case 'высокий': return 'severity-pill severity-pill--high';
      case 'средний': return 'severity-pill severity-pill--medium';
      case 'низкий': return 'severity-pill severity-pill--low';
      default: return 'severity-pill';
    }
  };

  if (loading && !currentIncident) {
    return <LoadingSpinner fullPage label="Загрузка инцидента…" />;
  }

  if (error && !currentIncident) {
    return (
      <div className="page-narrow">
        <ErrorMessage
          message={error}
          onRetry={() => fetchIncidentById(id)}
          onClose={clearError}
        />
        <Link to="/" className="btn btn--secondary">← На главную</Link>
      </div>
    );
  }

  if (!currentIncident) {
    return null;
  }

  const inc = currentIncident;

  return (
    <div className="page-narrow">
      <div className="page-toolbar">
        <Link to="/" className="btn btn--ghost">← К списку</Link>
      </div>

      {error && (
        <div className="banner banner--error">
          <span>{error}</span>
          <button type="button" className="banner-dismiss" onClick={clearError} aria-label="Закрыть">×</button>
        </div>
      )}

      <article className="card card--detail">
        <div className="card-detail-head">
          <h1 className="card-detail-title">{inc.name}</h1>
          <span className={getSeverityClass(inc.severity)}>{getSeverityText(inc.severity)}</span>
        </div>

        <dl className="detail-grid">
          <div>
            <dt>Дата</dt>
            <dd>{inc.date}</dd>
          </div>
          <div>
            <dt>Место</dt>
            <dd>{inc.location}</dd>
          </div>
        </dl>

        <section className="detail-section">
          <h2>Описание</h2>
          <p className="detail-text">{inc.description}</p>
        </section>

        {inc.measures ? (
          <section className="detail-section">
            <h2>Принятые меры</h2>
            <p className="detail-text">{inc.measures}</p>
          </section>
        ) : null}

        <div className="btn-row">
          <Link to={`/edit/${id}`} className="btn btn--primary">Редактировать</Link>
          <button type="button" className="btn btn--danger" onClick={handleDelete}>
            Удалить
          </button>
        </div>
      </article>
    </div>
  );
};

export default Detail;
