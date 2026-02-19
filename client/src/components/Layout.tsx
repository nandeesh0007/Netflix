import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Search, LogOut, Heart, Bookmark, Home } from 'lucide-react'

const Layout = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-netflix-black">
      <nav className="bg-netflix-dark bg-opacity-95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 
                className="text-2xl font-bold text-netflix-red cursor-pointer"
                onClick={() => navigate('/')}
              >
                NETFLIX
              </h1>
              
              <div className="hidden md:flex items-center space-x-6">
                <button
                  onClick={() => navigate('/')}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                    isActive('/') ? 'text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Home size={18} />
                  <span>Home</span>
                </button>
                
                <button
                  onClick={() => navigate('/favorites')}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                    isActive('/favorites') ? 'text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Heart size={18} />
                  <span>Favorites</span>
                </button>
                
                <button
                  onClick={() => navigate('/watchlist')}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                    isActive('/watchlist') ? 'text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Bookmark size={18} />
                  <span>Watchlist</span>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search movies..."
                    className="pl-10 pr-4 py-2 bg-netflix-black border border-gray-600 rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:border-netflix-red focus:ring-1 focus:ring-netflix-red w-64"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        navigate(`/?search=${encodeURIComponent(e.currentTarget.value.trim())}`)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-300 hidden sm:block">
                  {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden border-t border-gray-700">
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search movies..."
                className="pl-10 pr-4 py-2 bg-netflix-black border border-gray-600 rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:border-netflix-red focus:ring-1 focus:ring-netflix-red w-full"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    navigate(`/?search=${encodeURIComponent(e.currentTarget.value.trim())}`)
                    e.currentTarget.value = ''
                  }
                }}
              />
            </div>
          </div>
          
          <div className="flex justify-around px-4 py-2">
            <button
              onClick={() => navigate('/')}
              className={`flex flex-col items-center space-y-1 p-2 rounded ${
                isActive('/') ? 'text-white' : 'text-gray-300'
              }`}
            >
              <Home size={20} />
              <span className="text-xs">Home</span>
            </button>
            
            <button
              onClick={() => navigate('/favorites')}
              className={`flex flex-col items-center space-y-1 p-2 rounded ${
                isActive('/favorites') ? 'text-white' : 'text-gray-300'
              }`}
            >
              <Heart size={20} />
              <span className="text-xs">Favorites</span>
            </button>
            
            <button
              onClick={() => navigate('/watchlist')}
              className={`flex flex-col items-center space-y-1 p-2 rounded ${
                isActive('/watchlist') ? 'text-white' : 'text-gray-300'
              }`}
            >
              <Bookmark size={20} />
              <span className="text-xs">Watchlist</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-16 md:pt-16">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
