import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    severity: 'средний',
    date: '',
    measures: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/incidents/${id}`);
        setFormData(response.data);
      } catch (err) {
        setError(err.message || 'Не удалось загрузить инцидент');
      } finally {
        setLoading(false);
      }
    };
    fetchIncident();
  }, [id]);

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
      errors.location = 'Место проведения обязательно';
    }
    
    if (!formData.date) {
      errors.date = 'Дата проведения обязательна';
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
    
    setSaving(true);
    setError(null);
    
    try {
      await axios.put(`http://localhost:5000/incidents/${id}`, formData);
      alert('Инцидент успешно обновлен!');
      navigate(`/detail/${id}`);
    } catch (err) {
      setError(err.message || 'Не удалось сохранить изменения');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <Link to={`/detail/${id}`}>
        <button style={{
          padding: '8px 16px',
          backgroundColor: '#666',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}>
          ← Назад к инциденту
        </button>
      </Link>

      <h1>✏ Редактирование инцидента</h1>

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
            Место проведения *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
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
            Дата проведения *
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
              fontSize: '16px'
            }}
          >
            <option value="низкий">🟢 Низкий</option>
            <option value="средний">🟡 Средний</option>
            <option value="высокий">🟠 Высокий</option>
            <option value="критический">🔴 Критический</option>
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
            disabled={saving}
            style={{
              padding: '12px 24px',
              backgroundColor: saving ? '#ccc' : '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {saving ? 'Сохранение...' : '💾 Сохранить изменения'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/detail/${id}`)}
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

export default Edit;
