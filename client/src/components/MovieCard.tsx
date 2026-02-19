import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Bookmark, Play, Star } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import LoadingSpinner from './LoadingSpinner'

interface Movie {
  imdbID: string
  Title: string
  Year: string
  Poster: string
  Type: string
}

interface MovieCardProps {
  movie: Movie
  onToggleFavorite: (movie: Movie) => void
  onToggleWatchlist: (movie: Movie) => void
}

const MovieCard = ({ movie, onToggleFavorite, onToggleWatchlist }: MovieCardProps) => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const isFavorite = user?.favorites.some(fav => fav.imdbID === movie.imdbID)
  const isInWatchlist = user?.watchlist.some(item => item.imdbID === movie.imdbID)

  const handleCardClick = () => {
    navigate(`/movie/${movie.imdbID}`)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleFavorite(movie)
  }

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleWatchlist(movie)
  }

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/movie/${movie.imdbID}`)
  }

  return (
    <div className="movie-card group">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-netflix-dark">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size="small" />
          </div>
        )}
        
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="text-center p-4">
              <div className="text-gray-400 text-sm mb-2">No Poster</div>
              <div className="text-white text-xs font-medium">{movie.Title}</div>
            </div>
          </div>
        ) : (
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false)
              setImageError(true)
            }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
              {movie.Title}
            </h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-300 text-xs">{movie.Year}</span>
              <span className="text-gray-300 text-xs capitalize">{movie.Type}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePlayClick}
                className="flex-1 bg-netflix-red hover:bg-red-700 text-white py-2 px-3 rounded flex items-center justify-center transition-colors duration-200"
              >
                <Play size={14} className="mr-1" />
                <span className="text-xs">Play</span>
              </button>
              
              <button
                onClick={handleFavoriteClick}
                className={`p-2 rounded transition-colors duration-200 ${
                  isFavorite 
                    ? 'bg-netflix-red text-white' 
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
              
              <button
                onClick={handleWatchlistClick}
                className={`p-2 rounded transition-colors duration-200 ${
                  isInWatchlist 
                    ? 'bg-netflix-red text-white' 
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
                title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                <Bookmark size={14} fill={isInWatchlist ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
