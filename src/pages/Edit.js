import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useIncidents } from '../context/IncidentsContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const emptyForm = {
  name: '',
  description: '',
  location: '',
  severity: 'средний',
  date: '',
  measures: ''
};

const toFormState = (data) => ({
  name: data.name ?? '',
  description: data.description ?? '',
  location: data.location ?? '',
  severity: data.severity || 'средний',
  date: data.date ?? '',
  measures: data.measures ?? ''
});

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchIncidentById, updateIncident, error, clearError } = useIncidents();
  const [formData, setFormData] = useState(emptyForm);
  const [pageReady, setPageReady] = useState(false);
  const [loadOk, setLoadOk] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const load = useCallback(async () => {
    clearError();
    setPageReady(false);
    setLoadOk(false);
    try {
      const data = await fetchIncidentById(id);
      setFormData(toFormState(data));
      setLoadOk(true);
    } catch {
      setLoadOk(false);
    } finally {
      setPageReady(true);
    }
  }, [id, fetchIncidentById, clearError]);

  useEffect(() => {
    load();
  }, [load]);

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
      errors.location = 'Место проведения обязательно';
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
      await updateIncident(id, formData);
      navigate(`/detail/${id}`);
    } catch {
      /* ошибка в контексте */
    } finally {
      setSubmitting(false);
    }
  };

  if (!pageReady) {
    return <LoadingSpinner fullPage label="Загрузка инцидента…" />;
  }

  if (!loadOk) {
    return (
      <div className="page-narrow">
        <ErrorMessage
          message={error || 'Не удалось загрузить инцидент'}
          onRetry={load}
          onClose={clearError}
        />
        <Link to="/" className="btn btn--secondary">← На главную</Link>
      </div>
    );
  }

  return (
    <div className="page-narrow form-page">
      {submitting && (
        <div className="form-overlay" aria-busy="true">
          <LoadingSpinner label="Сохранение…" />
        </div>
      )}

      <div className="page-toolbar">
        <Link to={`/detail/${id}`} className="btn btn--ghost">← К карточке</Link>
      </div>

      <h1 className="page-title">Редактирование</h1>
      <p className="page-lead">Измените поля и сохраните</p>

      {error && (
        <ErrorMessage message={error} onClose={clearError} />
      )}

      <form className="card form-card" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field-label" htmlFor="e-name">Название *</label>
          <input
            id="e-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`field-input${validationErrors.name ? ' field-input--invalid' : ''}`}
          />
          {validationErrors.name && <p className="field-error">{validationErrors.name}</p>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="e-desc">Описание *</label>
          <textarea
            id="e-desc"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`field-input field-input--area${validationErrors.description ? ' field-input--invalid' : ''}`}
          />
          {validationErrors.description && <p className="field-error">{validationErrors.description}</p>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="e-loc">Место *</label>
          <input
            id="e-loc"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`field-input${validationErrors.location ? ' field-input--invalid' : ''}`}
          />
          {validationErrors.location && <p className="field-error">{validationErrors.location}</p>}
        </div>

        <div className="field-row">
          <div className="field field--grow">
            <label className="field-label" htmlFor="e-date">Дата *</label>
            <input
              id="e-date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`field-input${validationErrors.date ? ' field-input--invalid' : ''}`}
            />
            {validationErrors.date && <p className="field-error">{validationErrors.date}</p>}
          </div>
          <div className="field field--grow">
            <label className="field-label" htmlFor="e-sev">Уровень *</label>
            <select
              id="e-sev"
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
          <label className="field-label" htmlFor="e-measures">Принятые меры</label>
          <textarea
            id="e-measures"
            name="measures"
            value={formData.measures}
            onChange={handleChange}
            rows={3}
            className="field-input field-input--area"
          />
        </div>

        <div className="btn-row">
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            Сохранить
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => navigate(`/detail/${id}`)} disabled={submitting}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit;
