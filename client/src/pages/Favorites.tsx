import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { movieAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'
import MovieCard from '../components/MovieCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { Heart } from 'lucide-react'

interface FavoriteMovie {
  imdbID: string
  title: string
  poster: string
  year: string
  addedAt: string
}

const Favorites = () => {
  const navigate = useNavigate()
  const { user, updateFavorites } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([])

  useEffect(() => {
    setFavorites(user?.favorites || [])
  }, [user])

  const handleToggleFavorite = async (movie: any) => {
    try {
      const response = await movieAPI.removeFromFavorites(movie.imdbID)
      if (response.success) {
        updateFavorites(response.favorites)
        setFavorites(response.favorites)
      }
    } catch (error) {
      console.error('Failed to remove from favorites:', error)
    }
  }

  const handleToggleWatchlist = async (movie: any) => {
    try {
      const response = await movieAPI.addToWatchlist({
        imdbID: movie.imdbID,
        title: movie.title,
        poster: movie.poster,
        year: movie.year
      })
      
      if (response.success) {
        updateFavorites(response.watchlist)
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        try {
          const response = await movieAPI.removeFromWatchlist(movie.imdbID)
          if (response.success) {
            updateFavorites(response.watchlist)
          }
        } catch (removeError) {
          console.error('Failed to update watchlist:', removeError)
        }
      }
    }
  }

  const convertToMovieCardFormat = (favorite: FavoriteMovie): any => {
    return {
      imdbID: favorite.imdbID,
      Title: favorite.title,
      Year: favorite.year,
      Poster: favorite.poster,
      Type: 'movie'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Heart className="text-netflix-red" size={32} />
            <h1 className="text-3xl md:text-4xl font-bold text-white">My Favorites</h1>
          </div>
          <p className="text-gray-400">
            {favorites.length === 0 
              ? 'You haven\'t added any movies to your favorites yet' 
              : `You have ${favorites.length} favorite movie${favorites.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={64} className="text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-4">No favorites yet</h2>
            <p className="text-gray-400 mb-8">
              Start adding movies to your favorites to see them here
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favorites.map((favorite) => (
              <MovieCard
                key={favorite.imdbID}
                movie={convertToMovieCardFormat(favorite)}
                onToggleFavorite={handleToggleFavorite}
                onToggleWatchlist={handleToggleWatchlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorites
