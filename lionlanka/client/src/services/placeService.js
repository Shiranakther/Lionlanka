import API from './api';

// Get all places (with optional search, category, etc.)
export const getPlacesAPI = (params) => {
  return API.get('/api/places', { params });
};

// Get a single place by slug
export const getPlaceAPI = (slug) => {
  return API.get(`/api/places/${slug}`);
};
