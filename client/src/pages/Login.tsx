import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import LoadingSpinner from '../components/LoadingSpinner'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      return
    }

    try {
      await login(email, password)
      navigate('/')
    } catch (error) {
      // Error is handled in the store
    }
  }

  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://assets.nflxext.com/ffe/siteui/vlv3/6e32b96a-d4be-4e44-a19b-1cd2d1a80c7f/web/IN-en-20231113-TRIFECTA-perspective_38272412-5327-4ad9-bf32-4bbf4b1d8c1e_large.jpg)',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-black bg-opacity-75 p-8 rounded-lg">
          <h1 className="text-3xl font-bold text-white mb-8">Sign In</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Email address"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-12"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {isLoading ? (
                <LoadingSpinner size="small" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              New to Netflix?{' '}
              <Link to="/register" className="text-white hover:underline">
                Sign up now
              </Link>
            </p>
          </div>

          <div className="mt-4 text-xs text-gray-400">
            <p>
              This page is protected by Google reCAPTCHA to ensure you're not a bot.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
