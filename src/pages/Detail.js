import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvent = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/events/${id}`);
      setEvent(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Мероприятие не найдено');
      } else {
        setError(err.message || 'Не удалось загрузить мероприятие');
      }
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Вы уверены, что хотите удалить мероприятие "${event?.name}"?`)) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:5000/events/${id}`);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Не удалось удалить мероприятие');
      console.error('Ошибка удаления:', err);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <ErrorMessage message={error} onRetry={fetchEvent} />
        <Link to="/">
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}>
            ← На главную
          </button>
        </Link>
      </div>
    );
  }

  const getSecurityLevelText = (level) => {
    switch(level) {
      case 'high': return '🔴 Высокий';
      case 'medium': return '🟡 Средний';
      case 'low': return '🟢 Низкий';
      default: return level;
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Link to="/">
        <button style={{
          padding: '8px 16px',
          backgroundColor: '#666',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}>
          ← Назад к списку
        </button>
      </Link>

      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        <h1>{event.name}</h1>
        
        <div style={{ marginTop: '20px' }}>
          <p><strong>📅 Дата проведения:</strong> {event.date}</p>
          <p><strong>📍 Место проведения:</strong> {event.place}</p>
          <p><strong>👥 Количество участников:</strong> {event.participants.toLocaleString()} чел.</p>
          <p><strong>🛡️ Уровень безопасности:</strong> {getSecurityLevelText(event.securityLevel)}</p>
          <p><strong>👤 Ответственный за безопасность:</strong> {event.responsible}</p>
        </div>

        <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate(`/edit/${id}`)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ✏ Редактировать
          </button>
          <button
            onClick={handleDelete}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🗑 Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default Detail;