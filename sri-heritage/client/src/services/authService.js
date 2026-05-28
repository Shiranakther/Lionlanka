import API from './api'

export const loginAPI = (data) => API.post('/api/auth/login', data)

export const registerAPI = (data) => API.post('/api/auth/register', data)

export const googleAuthAPI = (data) => API.post('/api/auth/google', data)

export const getMeAPI = () => API.get('/api/auth/me')

export const forgotPasswordAPI = (data) => API.post('/api/auth/forgot-password', data)

export const resetPasswordAPI = (token, data) =>
  API.post(`/api/auth/reset-password/${token}`, data)

export const updateProfileAPI = (data) => API.put('/api/auth/profile', data)

export const changePasswordAPI = (data) => API.put('/api/auth/change-password', data)
