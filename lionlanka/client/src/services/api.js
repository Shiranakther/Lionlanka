import axios from 'axios'

const API = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, ''),
})

// Request interceptor — attach Authorization Bearer token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor — handle 401 unauthorized
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Only redirect if not already on login/register page
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        window.location = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default API
