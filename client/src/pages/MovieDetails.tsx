import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { movieAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { ArrowLeft, Heart, Bookmark, Star, Calendar, Clock, Film } from 'lucide-react'

interface MovieDetails {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: Array<{
    Source: string
    Value: string
  }>
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
  Response: string
}

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, updateFavorites, updateWatchlist } = useAuthStore()
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError('Movie ID is required')
      setLoading(false)
      return
    }

    const fetchMovieDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await movieAPI.getMovieDetails(id)
        
        if (response.success) {
          setMovie(response.data)
        } else {
          setError(response.message || 'Movie not found')
        }
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch movie details')
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
  }, [id])

  const handleToggleFavorite = async () => {
    if (!movie) return

    try {
      const response = await movieAPI.addToFavorites({
        imdbID: movie.imdbID,
        title: movie.Title,
        poster: movie.Poster,
        year: movie.Year
      })
      
      if (response.success) {
        updateFavorites(response.favorites)
        toast.success('Added to favorites')
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        try {
          const response = await movieAPI.removeFromFavorites(movie.imdbID)
          if (response.success) {
            updateFavorites(response.favorites)
            toast.success('Removed from favorites')
          }
        } catch (removeError) {
          toast.error('Failed to update favorites')
        }
      } else {
        toast.error('Failed to update favorites')
      }
    }
  }

  const handleToggleWatchlist = async () => {
    if (!movie) return

    try {
      const response = await movieAPI.addToWatchlist({
        imdbID: movie.imdbID,
        title: movie.Title,
        poster: movie.Poster,
        year: movie.Year
      })
      
      if (response.success) {
        updateWatchlist(response.watchlist)
        toast.success('Added to watchlist')
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        try {
          const response = await movieAPI.removeFromWatchlist(movie.imdbID)
          if (response.success) {
            updateWatchlist(response.watchlist)
            toast.success('Removed from watchlist')
          }
        } catch (removeError) {
          toast.error('Failed to update watchlist')
        }
      } else {
        toast.error('Failed to update watchlist')
      }
    }
  }

  const isFavorite = user?.favorites.some((fav: any) => fav.imdbID === movie?.imdbID)
  const isInWatchlist = user?.watchlist.some((item: any) => item.imdbID === movie?.imdbID)

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error || 'Movie not found'}</div>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      <div className="relative">
        {movie.Poster && movie.Poster !== 'N/A' && (
          <div className="absolute inset-0">
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-netflix-black to-netflix-black" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-white hover:text-netflix-red transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="sticky top-24">
                <img
                  src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}
                  alt={movie.Title}
                  className="w-full rounded-lg shadow-2xl"
                />
                
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={handleToggleFavorite}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                      isFavorite
                        ? 'bg-netflix-red text-white'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                    <span>{isFavorite ? 'Remove' : 'Favorite'}</span>
                  </button>
                  
                  <button
                    onClick={handleToggleWatchlist}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                      isInWatchlist
                        ? 'bg-netflix-red text-white'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    <Bookmark size={18} fill={isInWatchlist ? 'currentColor' : 'none'} />
                    <span>{isInWatchlist ? 'Remove' : 'Watchlist'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {movie.Title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-6">
                  <span className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>{movie.Year}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>{movie.Runtime}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Film size={16} />
                    <span>{movie.Type}</span>
                  </span>
                  {movie.Rated && movie.Rated !== 'N/A' && (
                    <span className="px-2 py-1 bg-gray-700 rounded text-sm">
                      {movie.Rated}
                    </span>
                  )}
                </div>

                {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="flex items-center space-x-1">
                      <Star size={20} className="text-yellow-500 fill-current" />
                      <span className="text-2xl font-bold text-white">{movie.imdbRating}</span>
                    </div>
                    <span className="text-gray-400">/10</span>
                    {movie.imdbVotes && movie.imdbVotes !== 'N/A' && (
                      <span className="text-gray-400">({movie.imdbVotes} votes)</span>
                    )}
                  </div>
                )}
              </div>

              {movie.Plot && movie.Plot !== 'N/A' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">Plot</h2>
                  <p className="text-gray-300 leading-relaxed">{movie.Plot}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {movie.Genre && movie.Genre !== 'N/A' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Genre</h3>
                    <p className="text-gray-300">{movie.Genre}</p>
                  </div>
                )}

                {movie.Director && movie.Director !== 'N/A' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Director</h3>
                    <p className="text-gray-300">{movie.Director}</p>
                  </div>
                )}

                {movie.Actors && movie.Actors !== 'N/A' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Cast</h3>
                    <p className="text-gray-300">{movie.Actors}</p>
                  </div>
                )}

                {movie.Writer && movie.Writer !== 'N/A' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Writer</h3>
                    <p className="text-gray-300">{movie.Writer}</p>
                  </div>
                )}

                {movie.Language && movie.Language !== 'N/A' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Language</h3>
                    <p className="text-gray-300">{movie.Language}</p>
                  </div>
                )}

                {movie.Country && movie.Country !== 'N/A' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Country</h3>
                    <p className="text-gray-300">{movie.Country}</p>
                  </div>
                )}
              </div>

              {movie.Ratings && movie.Ratings.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Ratings</h3>
                  <div className="space-y-2">
                    {movie.Ratings.map((rating, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded">
                        <span className="text-gray-300">{rating.Source}</span>
                        <span className="text-white font-medium">{rating.Value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {movie.Awards && movie.Awards !== 'N/A' && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Awards</h3>
                  <p className="text-gray-300">{movie.Awards}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
