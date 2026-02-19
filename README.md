# Netflix Clone - Movie Streaming Application

A full-stack Netflix-style movie web application built with React, Node.js, Express, MongoDB, and the OMDb API.

## 🎬 Features

### Authentication
- User registration and login
- JWT token-based authentication
- Protected routes
- Secure password hashing with bcrypt

### Movie Features
- Search movies using OMDb API
- Browse popular movies
- Detailed movie information
- Add to favorites
- Add to watchlist
- Responsive grid layout

### UI/UX
- Netflix-inspired dark theme
- Responsive design for all devices
- Smooth animations and transitions
- Loading states and error handling
- Modern, clean interface

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Express Validator** - Input validation

### External APIs
- **OMDb API** - Movie data

## 📁 Project Structure

```
netflix-clone/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand state management
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   ├── App.tsx         # Main App component
│   │   └── main.tsx        # Entry point
│   ├── public/             # Static assets
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Backend Node.js application
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── config/            # Configuration files
│   ├── utils/             # Utility functions
│   ├── server.js          # Server entry point
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd netflix-clone
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Environment Setup

1. **Backend Environment Variables**
   Create a `.env` file in the `server` directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/netflix-clone

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d

   # OMDb API Configuration
   OMDB_API_KEY=9932b779
   OMDB_BASE_URL=https://www.omdbapi.com/
   ```

2. **Frontend Environment Variables**
   Create a `.env` file in the `client` directory:
   ```env
   # API Configuration
   VITE_API_URL=http://localhost:5000/api

   # OMDb API Key (if needed for direct client calls)
   VITE_OMDB_API_KEY=9932b779
   ```

### Running the Application

1. **Start MongoDB**
   - If using local MongoDB: `mongod`
   - If using MongoDB Atlas: Ensure your connection string is correct in `.env`

2. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   The server will run on `http://localhost:5000`

3. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## 📱 Usage

1. **Register a new account** or **login** with existing credentials
2. **Browse movies** on the home page (defaults to "Avengers" search)
3. **Search for movies** using the search bar
4. **Click on any movie** to view detailed information
5. **Add movies to favorites** or **watchlist** for later viewing
6. **Navigate** between Home, Favorites, and Watchlist using the navigation menu

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Movies
- `GET /api/movies/search?search=<query>&page=<page>` - Search movies
- `GET /api/movies/details/:id` - Get movie details
- `POST /api/movies/favorites` - Add to favorites
- `DELETE /api/movies/favorites/:imdbID` - Remove from favorites
- `POST /api/movies/watchlist` - Add to watchlist
- `DELETE /api/movies/watchlist/:imdbID` - Remove from watchlist
- `GET /api/movies/user-lists` - Get user's favorites and watchlist

## 🎨 Design Features

- **Netflix-inspired UI** with dark theme
- **Responsive design** for mobile, tablet, and desktop
- **Smooth animations** and hover effects
- **Loading states** with skeleton loaders
- **Toast notifications** for user feedback
- **Modern card-based layout** for movies

## 🔒 Security Features

- **JWT authentication** with expiration
- **Password hashing** with bcrypt
- **Input validation** and sanitization
- **CORS configuration**
- **Environment variables** for sensitive data
- **Protected routes** for authenticated users

## 📦 Deployment

### Backend Deployment
1. Set production environment variables
2. Build and deploy to your preferred platform (Heroku, AWS, etc.)
3. Ensure MongoDB is accessible in production

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)
3. Update the `VITE_API_URL` environment variable for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- OMDb API for providing movie data
- Netflix for design inspiration
- React, Node.js, and MongoDB communities

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env` file

2. **CORS Error**
   - Ensure frontend URL is in CORS whitelist
   - Check API URL in frontend environment variables

3. **OMDb API Error**
   - Verify API key is correct
   - Check API rate limits

4. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT secret in backend

### Development Tips

- Use `npm run dev` for both frontend and backend during development
- Check browser console for detailed error messages
- Use MongoDB Compass for database management
- Test API endpoints with Postman or similar tools

## 📞 Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.
