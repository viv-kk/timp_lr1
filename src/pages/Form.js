import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useIncidents } from '../context/IncidentsContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const initialForm = () => ({
  name: '',
  description: '',
  location: '',
  severity: 'средний',
  date: new Date().toISOString().split('T')[0],
  measures: ''
});

const Form = () => {
  const navigate = useNavigate();
  const { addIncident, error, clearError } = useIncidents();
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    clearError();
  }, [clearError]);

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Название инцидента обязательно';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Название должно содержать минимум 3 символа';
    }

    if (!formData.description.trim()) {
      errors.description = 'Описание инцидента обязательно';
    } else if (formData.description.trim().length < 10) {
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

    if (!['низкий', 'средний', 'высокий', 'критический'].includes(formData.severity)) {
      errors.severity = 'Выберите уровень опасности';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    clearError();
    setSubmitting(true);
    try {
      await addIncident(formData);
      navigate('/');
    } catch {
      /* ошибка уже в контексте */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-narrow form-page">
      {submitting && (
        <div className="form-overlay" aria-busy="true">
          <LoadingSpinner label="Сохранение…" />
        </div>
      )}

      <div className="page-toolbar">
        <Link to="/" className="btn btn--ghost">← К списку</Link>
      </div>

      <h1 className="page-title">Новый инцидент</h1>
      <p className="page-lead">
        Заполните данные о произошедшем на мероприятии
      </p>

      {error && (
        <ErrorMessage message={error} onClose={clearError} />
      )}

      <form className="card form-card" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field-label" htmlFor="f-name">Название *</label>
          <input
            id="f-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`field-input${validationErrors.name ? ' field-input--invalid' : ''}`}
            placeholder="Например: конфликт на трибунах"
            autoComplete="off"
          />
          {validationErrors.name && <p className="field-error">{validationErrors.name}</p>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="f-desc">Описание *</label>
          <textarea
            id="f-desc"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`field-input field-input--area${validationErrors.description ? ' field-input--invalid' : ''}`}
            placeholder="Что произошло, последствия, кто участвовал…"
            rows={4}
          />
          {validationErrors.description && <p className="field-error">{validationErrors.description}</p>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="f-loc">Место *</label>
          <input
            id="f-loc"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`field-input${validationErrors.location ? ' field-input--invalid' : ''}`}
            placeholder="Площадка, сектор, зона"
          />
          {validationErrors.location && <p className="field-error">{validationErrors.location}</p>}
        </div>

        <div className="field-row">
          <div className="field field--grow">
            <label className="field-label" htmlFor="f-date">Дата *</label>
            <input
              id="f-date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`field-input${validationErrors.date ? ' field-input--invalid' : ''}`}
            />
            {validationErrors.date && <p className="field-error">{validationErrors.date}</p>}
          </div>
          <div className="field field--grow">
            <label className="field-label" htmlFor="f-sev">Уровень *</label>
            <select
              id="f-sev"
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className={`field-input${validationErrors.severity ? ' field-input--invalid' : ''}`}
            >
              <option value="низкий">Низкий</option>
              <option value="средний">Средний</option>
              <option value="высокий">Высокий</option>
              <option value="критический">Критический</option>
            </select>
            {validationErrors.severity && <p className="field-error">{validationErrors.severity}</p>}
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="f-measures">Принятые меры</label>
          <textarea
            id="f-measures"
            name="measures"
            value={formData.measures}
            onChange={handleChange}
            className="field-input field-input--area"
            placeholder="Что сделали службы, полиция, медики…"
            rows={3}
          />
        </div>

        <div className="btn-row">
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            Зарегистрировать
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => navigate('/')} disabled={submitting}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
