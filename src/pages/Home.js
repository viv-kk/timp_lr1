import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useIncidents } from '../context/IncidentsContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Home = () => {
  const {
    incidents,
    loading,
    error,
    fetchIncidents,
    deleteIncident,
    clearError
  } = useIncidents();

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'критический': return 'severity-pill severity-pill--critical';
      case 'высокий': return 'severity-pill severity-pill--high';
      case 'средний': return 'severity-pill severity-pill--medium';
      case 'низкий': return 'severity-pill severity-pill--low';
      default: return 'severity-pill';
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

  const handleDelete = async (incidentId, name) => {
    if (!window.confirm(`Удалить инцидент «${name}»?`)) {
      return;
    }
    clearError();
    try {
      await deleteIncident(incidentId);
    } catch {
      /* сообщение в контексте */
    }
  };

  if (loading && incidents.length === 0) {
    return <LoadingSpinner fullPage label="Загрузка списка…" />;
  }

  if (error && incidents.length === 0) {
    return (
      <div className="page-wide">
        <ErrorMessage
          message={error}
          onRetry={fetchIncidents}
          onClose={clearError}
        />
      </div>
    );
  }

  const stats = {
    total: incidents.length,
    critical: incidents.filter((i) => i.severity === 'критический').length,
    high: incidents.filter((i) => i.severity === 'высокий').length,
    medium: incidents.filter((i) => i.severity === 'средний').length,
    low: incidents.filter((i) => i.severity === 'низкий').length
  };

  return (
    <div className="page-wide home-page">
      <header className="home-hero">
        <h1 className="home-title">Инциденты на мероприятиях</h1>
        <p className="home-subtitle">
          Реестр случаев для планирования мер безопасности
        </p>
        <Link to="/add" className="btn btn--primary btn--lg">
          Зарегистрировать инцидент
        </Link>
      </header>

      <section className="stats-grid" aria-label="Сводка">
        <div className="stat-card stat-card--total">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Всего</span>
        </div>
        <div className="stat-card stat-card--critical">
          <span className="stat-value">{stats.critical}</span>
          <span className="stat-label">Критические</span>
        </div>
        <div className="stat-card stat-card--high">
          <span className="stat-value">{stats.high}</span>
          <span className="stat-label">Высокие</span>
        </div>
        <div className="stat-card stat-card--medium">
          <span className="stat-value">{stats.medium}</span>
          <span className="stat-label">Средние</span>
        </div>
        <div className="stat-card stat-card--low">
          <span className="stat-value">{stats.low}</span>
          <span className="stat-label">Низкие</span>
        </div>
      </section>

      {error && (
        <div className="banner banner--error">
          <span>{error}</span>
          <button type="button" className="banner-dismiss" onClick={clearError} aria-label="Закрыть">×</button>
        </div>
      )}

      {incidents.length === 0 && !error ? (
        <div className="empty-state card">
          <p>Пока нет записей. Добавьте первый инцидент.</p>
          <Link to="/add" className="btn btn--primary">Добавить</Link>
        </div>
      ) : (
        <section className="card table-card" aria-label="Список инцидентов">
          <h2 className="table-card-title">Список</h2>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Дата</th>
                  <th>Место</th>
                  <th>Уровень</th>
                  <th className="data-table-actions">Действия</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident.id}>
                    <td>
                      <Link to={`/detail/${incident.id}`} className="table-link">
                        {incident.name}
                      </Link>
                    </td>
                    <td>{incident.date}</td>
                    <td className="cell-muted">{incident.location}</td>
                    <td>
                      <span className={getSeverityClass(incident.severity)}>
                        {getSeverityText(incident.severity)}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/edit/${incident.id}`} className="btn btn--sm btn--ghost">
                          Изменить
                        </Link>
                        <button
                          type="button"
                          className="btn btn--sm btn--danger"
                          onClick={() => handleDelete(incident.id, incident.name)}
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
