import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },
  
  register: async (email: string, password: string) => {
    const response = await api.post('/auth/register', { email, password })
    return response.data
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  }
}

export const movieAPI = {
  searchMovies: async (search?: string, page?: number) => {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (page) params.append('page', page.toString())
    
    const response = await api.get(`/movies/search?${params}`)
    return response.data
  },
  
  getMovieDetails: async (id: string) => {
    const response = await api.get(`/movies/details/${id}`)
    return response.data
  },
  
  addToFavorites: async (movie: {
    imdbID: string
    title: string
    poster: string
    year: string
  }) => {
    const response = await api.post('/movies/favorites', movie)
    return response.data
  },
  
  removeFromFavorites: async (imdbID: string) => {
    const response = await api.delete(`/movies/favorites/${imdbID}`)
    return response.data
  },
  
  addToWatchlist: async (movie: {
    imdbID: string
    title: string
    poster: string
    year: string
  }) => {
    const response = await api.post('/movies/watchlist', movie)
    return response.data
  },
  
  removeFromWatchlist: async (imdbID: string) => {
    const response = await api.delete(`/movies/watchlist/${imdbID}`)
    return response.data
  },
  
  getUserLists: async () => {
    const response = await api.get('/movies/user-lists')
    return response.data
  }
}

export default api
