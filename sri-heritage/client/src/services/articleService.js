import API from './api'

export const getArticlesAPI = (params) => API.get('/api/articles', { params })

export const getArticleAPI = (slug) => API.get(`/api/articles/${slug}`)

export const createArticleAPI = (data) => API.post('/api/articles', data)

export const updateArticleAPI = (id, data) => API.put(`/api/articles/${id}`, data)

export const deleteArticleAPI = (id) => API.delete(`/api/articles/${id}`)

export const toggleLikeAPI = (id) => API.post(`/api/articles/${id}/like`)

export const getMyArticlesAPI = () => API.get('/api/articles/user/mine')

export const getSavedArticlesAPI = () => API.get('/api/saved/articles')

export const saveArticleAPI = (id) => API.post(`/api/saved/articles/${id}`)

export const removeSavedArticleAPI = (id) => API.delete(`/api/saved/articles/${id}`)

export const searchArticlesAPI = (query) =>
  API.get('/api/articles', { params: { search: query } })
