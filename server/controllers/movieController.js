const axios = require('axios');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const memoryStore = require('../utils/memoryStore');

const searchMovies = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { search, page = 1 } = req.query;
    const searchTerm = search || 'Avengers';

    try {
      const response = await axios.get(`${process.env.OMDB_BASE_URL}`, {
        params: {
          apikey: process.env.OMDB_API_KEY,
          s: searchTerm,
          page: page
        }
      });

      if (response.data.Response === 'False') {
        return res.status(404).json({
          success: false,
          message: response.data.Error || 'No movies found'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          movies: response.data.Search,
          totalResults: response.data.totalResults,
          currentPage: parseInt(page)
        }
      });
    } catch (apiError) {
      res.status(500).json({
        success: false,
        message: 'Error fetching movies from OMDb API'
      });
    }
  } catch (error) {
    next(error);
  }
};

const getMovieDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Movie ID is required'
      });
    }

    try {
      const response = await axios.get(`${process.env.OMDB_BASE_URL}`, {
        params: {
          apikey: process.env.OMDB_API_KEY,
          i: id,
          plot: 'full'
        }
      });

      if (response.data.Response === 'False') {
        return res.status(404).json({
          success: false,
          message: response.data.Error || 'Movie not found'
        });
      }

      res.status(200).json({
        success: true,
        data: response.data
      });
    } catch (apiError) {
      res.status(500).json({
        success: false,
        message: 'Error fetching movie details from OMDb API'
      });
    }
  } catch (error) {
    next(error);
  }
};

const addToFavorites = async (req, res, next) => {
  try {
    const { imdbID, title, poster, year } = req.body;

    if (!imdbID || !title) {
      return res.status(400).json({
        success: false,
        message: 'Movie ID and title are required'
      });
    }

    let user;
    try {
      user = await User.findById(req.user.id);
    } catch (dbError) {
      user = await memoryStore.findUserById(req.user.id);
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const existingFavorite = user.favorites.find(fav => fav.imdbID === imdbID);
    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Movie already in favorites'
      });
    }

    const newFavorite = {
      imdbID,
      title,
      poster: poster || '',
      year: year || '',
      addedAt: new Date()
    };

    user.favorites.push(newFavorite);

    try {
      await user.save();
    } catch (dbError) {
      await memoryStore.updateUserFavorites(req.user.id, user.favorites);
    }

    res.status(200).json({
      success: true,
      message: 'Movie added to favorites',
      favorites: user.favorites
    });
  } catch (error) {
    next(error);
  }
};

const removeFromFavorites = async (req, res, next) => {
  try {
    const { imdbID } = req.params;

    if (!imdbID) {
      return res.status(400).json({
        success: false,
        message: 'Movie ID is required'
      });
    }

    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(fav => fav.imdbID !== imdbID);
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Movie removed from favorites',
      favorites: user.favorites
    });
  } catch (error) {
    next(error);
  }
};

const addToWatchlist = async (req, res, next) => {
  try {
    const { imdbID, title, poster, year } = req.body;

    if (!imdbID || !title) {
      return res.status(400).json({
        success: false,
        message: 'Movie ID and title are required'
      });
    }

    const user = await User.findById(req.user.id);
    
    const existingWatchlist = user.watchlist.find(item => item.imdbID === imdbID);
    if (existingWatchlist) {
      return res.status(400).json({
        success: false,
        message: 'Movie already in watchlist'
      });
    }

    user.watchlist.push({
      imdbID,
      title,
      poster: poster || '',
      year: year || ''
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Movie added to watchlist',
      watchlist: user.watchlist
    });
  } catch (error) {
    next(error);
  }
};

const removeFromWatchlist = async (req, res, next) => {
  try {
    const { imdbID } = req.params;

    if (!imdbID) {
      return res.status(400).json({
        success: false,
        message: 'Movie ID is required'
      });
    }

    const user = await User.findById(req.user.id);
    user.watchlist = user.watchlist.filter(item => item.imdbID !== imdbID);
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Movie removed from watchlist',
      watchlist: user.watchlist
    });
  } catch (error) {
    next(error);
  }
};

const getUserLists = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        favorites: user.favorites,
        watchlist: user.watchlist
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchMovies,
  getMovieDetails,
  addToFavorites,
  removeFromFavorites,
  addToWatchlist,
  removeFromWatchlist,
  getUserLists
};
