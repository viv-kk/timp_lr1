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

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'критический': return '#ff4444';
      case 'высокий': return '#ff8800';
      case 'средний': return '#ffcc00';
      case 'низкий': return '#44bb44';
      default: return '#888888';
    }
  };

  const getSeverityText = (severity) => {
    switch (severity) {
      case 'критический': return '🔴 Критический';
      case 'высокий': return '🟠 Высокий';
      case 'средний': return '🟡 Средний';
      case 'низкий': return '🟢 Низкий';
      default: return severity;
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Вы уверены, что хотите удалить инцидент "${name}"?`)) {
      try {
        await deleteIncident(id);
      } catch (err) {
        console.error('Ошибка удаления:', err);
      }
    }
  };

  if (loading && incidents.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && incidents.length === 0) {
    return (
      <ErrorMessage
        message={error}
        onRetry={fetchIncidents}
        onClose={clearError}
      />
    );
  }

  const stats = {
    total: incidents.length,
    critical: incidents.filter(i => i.severity === 'критический').length,
    high: incidents.filter(i => i.severity === 'высокий').length,
    medium: incidents.filter(i => i.severity === 'средний').length,
    low: incidents.filter(i => i.severity === 'низкий').length
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🛡️ Безопасность массовых мероприятий</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Система учета инцидентов на внутренних и внешних массовых мероприятиях
      </p>

      <Link to="/add">
        <button style={{
          padding: '12px 24px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '25px',
          fontSize: '16px'
        }}>
          ➕ Зарегистрировать инцидент
        </button>
      </Link>

      {/* Статистика */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 15px 0', fontSize: '20px' }}>📊 Статистика инцидентов</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px'
        }}>
          <div style={{ background: '#1a237e', padding: '15px', borderRadius: '8px', textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.total}</div>
            <div>Всего</div>
          </div>
          <div style={{ background: '#c62828', padding: '15px', borderRadius: '8px', textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.critical}</div>
            <div>Критических</div>
          </div>
          <div style={{ background: '#ff8800', padding: '15px', borderRadius: '8px', textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.high}</div>
            <div>Высоких</div>
          </div>
          <div style={{ background: '#ffcc00', padding: '15px', borderRadius: '8px', textAlign: 'center', color: '#333' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.medium}</div>
            <div>Средних</div>
          </div>
          <div style={{ background: '#44bb44', padding: '15px', borderRadius: '8px', textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.low}</div>
            <div>Низких</div>
          </div>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          ⚠️ {error}
          <button onClick={clearError} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✖</button>
        </div>
      )}

      {incidents.length === 0 && !error ? (
        <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Нет зарегистрированных инцидентов. Добавьте первый инцидент!
        </p>
      ) : (
        <>
          <h2 style={{ marginBottom: '15px' }}>📋 Список инцидентов</h2>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr',
              background: '#f5f5f5',
              padding: '12px 15px',
              fontWeight: 'bold',
              borderBottom: '2px solid #ddd'
            }}>
              <span>Название</span>
              <span>Дата</span>
              <span>Место</span>
              <span>Уровень</span>
              <span>Действия</span>
            </div>
            {incidents.map(incident => (
              <div key={incident.id} style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr',
                padding: '12px 15px',
                borderBottom: '1px solid #f0f0f0',
                alignItems: 'center'
              }}>
                <Link to={`/detail/${incident.id}`} style={{ textDecoration: 'none', color: '#2196F3', fontWeight: '500' }}>
                  {incident.name}
                </Link>
                <span>{incident.date}</span>
                <span style={{ color: '#666' }}>{incident.location}</span>
                <span>
                  <span style={{
                    backgroundColor: getSeverityColor(incident.severity),
                    padding: '4px 10px',
                    borderRadius: '20px',
                    color: incident.severity === 'средний' ? '#333' : 'white',
                    fontSize: '12px'
                  }}>
                    {getSeverityText(incident.severity)}
                  </span>
                </span>
                <span>
                  <button
                    onClick={() => handleDelete(incident.id, incident.name)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    🗑 Удалить
                  </button>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;