import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { movieAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'
import MovieCard from '../components/MovieCard'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

interface Movie {
  imdbID: string
  Title: string
  Year: string
  Poster: string
  Type: string
}

interface MovieResponse {
  success: boolean
  data: {
    movies: Movie[]
    totalResults: string
    currentPage: number
  }
}

const Home = () => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const { updateFavorites, updateWatchlist } = useAuthStore()

  const fetchMovies = async (search: string, page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      
      const response: MovieResponse = await movieAPI.searchMovies(search, page)
      
      if (response.success) {
        if (page === 1) {
          setMovies(response.data.movies)
        } else {
          setMovies(prev => [...prev, ...response.data.movies])
        }
        setTotalResults(parseInt(response.data.totalResults))
        setCurrentPage(response.data.currentPage)
      } else {
        setError('No movies found')
        setMovies([])
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch movies')
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies(searchQuery)
  }, [searchQuery])

  const handleLoadMore = () => {
    if (!loading && movies.length < totalResults) {
      fetchMovies(searchQuery, currentPage + 1)
    }
  }

  const handleToggleFavorite = async (movie: Movie) => {
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

  const handleToggleWatchlist = async (movie: Movie) => {
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

  return (
    <div className="min-h-screen bg-netflix-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Popular Movies'}
          </h1>
          {!searchQuery && (
            <p className="text-gray-400">Discover and explore amazing movies</p>
          )}
        </div>

        {loading && movies.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="large" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-red-500 text-xl mb-4">{error}</div>
            <button
              onClick={() => fetchMovies(searchQuery)}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-xl mb-4">
              {searchQuery ? 'No movies found for your search' : 'No movies available'}
            </div>
            {searchQuery && (
              <button
                onClick={() => fetchMovies('')}
                className="btn-primary"
              >
                Browse Popular Movies
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleWatchlist={handleToggleWatchlist}
                />
              ))}
            </div>

            {movies.length < totalResults && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <LoadingSpinner size="small" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Home
