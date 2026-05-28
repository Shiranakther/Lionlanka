import API from './api';

const adminService = {
  // Stats
  getDashboardStats: async () => {
    const response = await API.get('/api/admin/stats');
    return response.data.stats;
  },

  // Users
  getAllUsers: async () => {
    const response = await API.get('/api/admin/users');
    return response.data.users;
  },
  updateUserRole: async (id, role) => {
    const response = await API.put(`/api/admin/users/${id}/role`, { role });
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await API.delete(`/api/admin/users/${id}`);
    return response.data;
  },

  // Articles
  getAllArticles: async () => {
    const response = await API.get('/api/admin/articles');
    return response.data.articles;
  },
  approveArticleAPI: async (id) => {
    const response = await API.put(`/api/admin/articles/${id}/approve`);
    return response.data;
  },
  deleteArticle: async (id) => {
    const response = await API.delete(`/api/admin/articles/${id}`);
    return response.data;
  },

  // Places
  getAllPlaces: async () => {
    const response = await API.get('/api/admin/places');
    return response.data.places;
  },
  createPlace: async (placeData) => {
    const response = await API.post('/api/admin/places', placeData);
    return response.data;
  },
  updatePlace: async (id, placeData) => {
    const response = await API.put(`/api/admin/places/${id}`, placeData);
    return response.data;
  },
  deletePlace: async (id) => {
    const response = await API.delete(`/api/admin/places/${id}`);
    return response.data;
  },

  // Chats
  getAllChats: async () => {
    const response = await API.get('/api/admin/chats');
    return response.data.chats;
  },

  // Homepage Config
  getSiteConfig: async () => {
    const response = await API.get('/api/admin/site-config');
    return response.data.config;
  },
  updateSiteConfig: async (configData) => {
    const response = await API.put('/api/admin/site-config', configData);
    return response.data.config;
  }
};

export default adminService;
