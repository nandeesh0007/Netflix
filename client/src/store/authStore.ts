import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  favorites: Array<{
    imdbID: string
    title: string
    poster: string
    year: string
    addedAt: string
  }>
  watchlist: Array<{
    imdbID: string
    title: string
    poster: string
    year: string
    addedAt: string
  }>
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  initializeAuth: () => void
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  updateFavorites: (favorites: User['favorites']) => void
  updateWatchlist: (watchlist: User['watchlist']) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      initializeAuth: () => {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        
        if (token && user) {
          set({
            token,
            user: JSON.parse(user),
            isAuthenticated: true,
            isLoading: false
          })
        } else {
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      },

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true })
          const response = await authAPI.login(email, password)
          
          if (response.success) {
            const { token, user } = response
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false
            })
            
            toast.success('Login successful!')
          } else {
            throw new Error(response.message || 'Login failed')
          }
        } catch (error: any) {
          set({ isLoading: false })
          toast.error(error.response?.data?.message || error.message || 'Login failed')
          throw error
        }
      },

      register: async (email: string, password: string) => {
        try {
          set({ isLoading: true })
          const response = await authAPI.register(email, password)
          
          if (response.success) {
            const { token, user } = response
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false
            })
            
            toast.success('Registration successful!')
          } else {
            throw new Error(response.message || 'Registration failed')
          }
        } catch (error: any) {
          set({ isLoading: false })
          toast.error(error.response?.data?.message || error.message || 'Registration failed')
          throw error
        }
      },

      logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        })
        toast.success('Logged out successfully')
      },

      updateFavorites: (favorites) => {
        const currentUser = get().user
        if (currentUser) {
          const updatedUser = { ...currentUser, favorites }
          localStorage.setItem('user', JSON.stringify(updatedUser))
          set({ user: updatedUser })
        }
      },

      updateWatchlist: (watchlist) => {
        const currentUser = get().user
        if (currentUser) {
          const updatedUser = { ...currentUser, watchlist }
          localStorage.setItem('user', JSON.stringify(updatedUser))
          set({ user: updatedUser })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
