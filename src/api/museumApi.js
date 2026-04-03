import axios from 'axios';

// Base URL API backend — sesuaikan dengan environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Ambil semua museum dengan filter, search, dan pagination
 */
export const getMuseums = async (params = {}) => {
  const { data } = await api.get('/museums', { params });
  return data;
};

/**
 * Ambil detail museum berdasarkan ID
 */
export const getMuseumById = async (id) => {
  const { data } = await api.get(`/museums/${id}`);
  return data;
};

/**
 * Ambil museum terdekat berdasarkan lokasi
 */
export const getNearbyMuseums = async (lat, lng, radius = 50) => {
  const { data } = await api.get('/museums/nearby', {
    params: { lat, lng, radius },
  });
  return data;
};

/**
 * Ambil semua provinsi
 */
export const getProvinces = async () => {
  const { data } = await api.get('/provinces');
  return data;
};

/**
 * Ambil kabupaten, opsional filter by provinsi_id
 */
export const getRegencies = async (provinsiId = null) => {
  const params = provinsiId ? { provinsi_id: provinsiId } : {};
  const { data } = await api.get('/regencies', { params });
  return data;
};

/**
 * Ambil semua kategori
 */
export const getCategories = async () => {
  const { data } = await api.get('/categories');
  return data;
};

/**
 * Interactions (Unified Reviews & Photos)
 */
export const getMuseumInteractions = async (museumId) => {
  const { data } = await api.get(`/interactions/museums/${museumId}`);
  return data;
};

export const postMuseumReview = async (reviewData) => {
  const { data } = await api.post('/interactions/reviews', reviewData);
  return data;
};

export const postMuseumPhoto = async (formData) => {
  const { data } = await api.post('/interactions/photos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const reactToInteraction = async (interactionId, type) => {
  const { data } = await api.post(`/interactions/${interactionId}/react`, { type });
  return data;
};

export default api;
