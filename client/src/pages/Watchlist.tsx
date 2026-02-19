import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { movieAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'
import MovieCard from '../components/MovieCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { Bookmark } from 'lucide-react'

interface WatchlistMovie {
  imdbID: string
  title: string
  poster: string
  year: string
  addedAt: string
}

const Watchlist = () => {
  const navigate = useNavigate()
  const { user, updateWatchlist } = useAuthStore()
  const [loading] = useState(false)
  const [watchlist, setWatchlist] = useState<WatchlistMovie[]>([])

  useEffect(() => {
    setWatchlist(user?.watchlist || [])
  }, [user])

  const handleToggleFavorite = async (movie: any) => {
    try {
      const response = await movieAPI.addToFavorites({
        imdbID: movie.imdbID,
        title: movie.title,
        poster: movie.poster,
        year: movie.year
      })
      
      if (response.success) {
        updateWatchlist(response.favorites)
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        try {
          const response = await movieAPI.removeFromFavorites(movie.imdbID)
          if (response.success) {
            updateWatchlist(response.favorites)
          }
        } catch (removeError) {
          console.error('Failed to update favorites:', removeError)
        }
      }
    }
  }

  const handleToggleWatchlist = async (movie: any) => {
    try {
      const response = await movieAPI.removeFromWatchlist(movie.imdbID)
      if (response.success) {
        updateWatchlist(response.watchlist)
        setWatchlist(response.watchlist)
      }
    } catch (error) {
      console.error('Failed to remove from watchlist:', error)
    }
  }

  const convertToMovieCardFormat = (watchlistMovie: WatchlistMovie): any => {
    return {
      imdbID: watchlistMovie.imdbID,
      Title: watchlistMovie.title,
      Year: watchlistMovie.year,
      Poster: watchlistMovie.poster,
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
            <Bookmark className="text-netflix-red" size={32} />
            <h1 className="text-3xl md:text-4xl font-bold text-white">My Watchlist</h1>
          </div>
          <p className="text-gray-400">
            {watchlist.length === 0 
              ? 'You haven\'t added any movies to your watchlist yet' 
              : `You have ${watchlist.length} movie${watchlist.length !== 1 ? 's' : ''} in your watchlist`
            }
          </p>
        </div>

        {watchlist.length === 0 ? (
          <div className="text-center py-16">
            <Bookmark size={64} className="text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-4">Your watchlist is empty</h2>
            <p className="text-gray-400 mb-8">
              Add movies to your watchlist to keep track of what you want to watch later
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
            {watchlist.map((watchlistMovie) => (
              <MovieCard
                key={watchlistMovie.imdbID}
                movie={convertToMovieCardFormat(watchlistMovie)}
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

export default Watchlist
