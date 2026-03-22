import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Form = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    severity: 'средний',
    date: new Date().toISOString().split('T')[0],
    measures: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Название инцидента обязательно';
    } else if (formData.name.length < 3) {
      errors.name = 'Название должно содержать минимум 3 символа';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Описание инцидента обязательно';
    } else if (formData.description.length < 10) {
      errors.description = 'Описание должно содержать минимум 10 символов';
    }
    
    if (!formData.location.trim()) {
      errors.location = 'Место проведения мероприятия обязательно';
    }
    
    if (!formData.date) {
      errors.date = 'Дата проведения обязательна';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        errors.date = 'Дата не может быть в будущем';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await axios.post('http://localhost:5000/incidents', formData);
      alert('Инцидент успешно зарегистрирован!');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Не удалось добавить инцидент');
      console.error('Ошибка отправки:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
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

      <h1>➕ Регистрация инцидента</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Заполните информацию о произошедшем инциденте на мероприятии
      </p>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Название инцидента *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Например: Драка между участниками"
            style={{
              width: '100%',
              padding: '10px',
              border: validationErrors.name ? '2px solid #f44336' : '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          />
          {validationErrors.name && (
            <p style={{ color: '#f44336', fontSize: '14px', marginTop: '5px' }}>{validationErrors.name}</p>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Описание инцидента *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Подробное описание произошедшего..."
            rows="4"
            style={{
              width: '100%',
              padding: '10px',
              border: validationErrors.description ? '2px solid #f44336' : '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
              resize: 'vertical'
            }}
          />
          {validationErrors.description && (
            <p style={{ color: '#f44336', fontSize: '14px', marginTop: '5px' }}>{validationErrors.description}</p>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Место проведения мероприятия *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Например: Стадион 'Лужники', сектор А"
            style={{
              width: '100%',
              padding: '10px',
              border: validationErrors.location ? '2px solid #f44336' : '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          />
          {validationErrors.location && (
            <p style={{ color: '#f44336', fontSize: '14px', marginTop: '5px' }}>{validationErrors.location}</p>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Дата проведения мероприятия *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: validationErrors.date ? '2px solid #f44336' : '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          />
          {validationErrors.date && (
            <p style={{ color: '#f44336', fontSize: '14px', marginTop: '5px' }}>{validationErrors.date}</p>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Уровень опасности *
          </label>
          <select
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
              backgroundColor: 'white'
            }}
          >
            <option value="низкий">🟢 Низкий - незначительные нарушения</option>
            <option value="средний">🟡 Средний - требуется вмешательство служб</option>
            <option value="высокий">🟠 Высокий - угроза безопасности</option>
            <option value="критический">🔴 Критический - эвакуация, пострадавшие</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Принятые меры
          </label>
          <textarea
            name="measures"
            value={formData.measures}
            onChange={handleChange}
            placeholder="Опишите, какие меры были приняты для устранения инцидента..."
            rows="3"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: loading ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {loading ? 'Сохранение...' : '➕ Зарегистрировать инцидент'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ❌ Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;