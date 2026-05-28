import API from './api';

export const getSiteConfigAPI = async () => {
  return await API.get('/api/site-config');
};
