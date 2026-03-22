import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/incidents';

const idsEqual = (a, b) => String(a) === String(b);

export const formatIncidentApiError = (err) => {
  if (err.response) {
    const status = err.response.status;
    switch (status) {
      case 400:
        return 'Некорректный запрос. Проверьте введенные данные.';
      case 404:
        return 'Запрашиваемый ресурс не найден.';
      case 500:
        return 'Внутренняя ошибка сервера. Попробуйте позже.';
      default:
        return `Ошибка сервера: ${status}`;
    }
  }
  if (err.request) {
    return 'Не удалось связаться с сервером. Проверьте подключение.';
  }
  return 'Произошла ошибка при отправке запроса.';
};

const IncidentsContext = createContext();

export const useIncidents = () => {
  const context = useContext(IncidentsContext);
  if (!context) {
    throw new Error('useIncidents должен использоваться внутри IncidentsProvider');
  }
  return context;
};

export const IncidentsProvider = ({ children }) => {
  const [incidents, setIncidents] = useState([]);
  const [currentIncident, setCurrentIncident] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setIncidents(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = formatIncidentApiError(err);
      setError(errorMessage);
      console.error('Ошибка загрузки:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchIncidentById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      setCurrentIncident(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = formatIncidentApiError(err);
      setError(errorMessage);
      console.error('Ошибка загрузки:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addIncident = useCallback(async (incidentData) => {
    setError(null);
    try {
      const response = await axios.post(API_URL, incidentData, {
        headers: { 'Content-Type': 'application/json' }
      });
      setIncidents(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      const errorMessage = formatIncidentApiError(err);
      setError(errorMessage);
      console.error('Ошибка создания:', err);
      throw err;
    }
  }, []);

  const updateIncident = useCallback(async (id, incidentData) => {
    setError(null);
    try {
      const response = await axios.put(`${API_URL}/${id}`, incidentData, {
        headers: { 'Content-Type': 'application/json' }
      });
      setIncidents(prev => prev.map(item =>
        idsEqual(item.id, id) ? response.data : item
      ));
      setCurrentIncident(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = formatIncidentApiError(err);
      setError(errorMessage);
      console.error('Ошибка обновления:', err);
      throw err;
    }
  }, []);

  const deleteIncident = useCallback(async (id) => {
    setError(null);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setIncidents(prev => prev.filter(item => !idsEqual(item.id, id)));
      setCurrentIncident((cur) => (cur && idsEqual(cur.id, id) ? null : cur));
      return true;
    } catch (err) {
      const errorMessage = formatIncidentApiError(err);
      setError(errorMessage);
      console.error('Ошибка удаления:', err);
      throw err;
    }
  }, []);

  const value = {
    incidents,
    currentIncident,
    loading,
    error,
    fetchIncidents,
    fetchIncidentById,
    addIncident,
    updateIncident,
    deleteIncident,
    clearError,
    setCurrentIncident
  };

  return (
    <IncidentsContext.Provider value={value}>
      {children}
    </IncidentsContext.Provider>
  );
};

export default IncidentsContext;