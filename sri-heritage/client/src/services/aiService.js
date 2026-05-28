import API from './api';

export const generateImageAPI = (prompt) => API.post('/api/ai/generate-image', { prompt });
