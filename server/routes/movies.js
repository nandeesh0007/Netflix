const express = require('express');
const {
  searchMovies,
  getMovieDetails,
  addToFavorites,
  removeFromFavorites,
  addToWatchlist,
  removeFromWatchlist,
  getUserLists
} = require('../controllers/movieController');
const { protect } = require('../middleware/auth');
const { validateMovieAction } = require('../utils/validation');

const router = express.Router();

router.get('/search', protect, searchMovies);
router.get('/details/:id', protect, getMovieDetails);
router.post('/favorites', protect, validateMovieAction, addToFavorites);
router.delete('/favorites/:imdbID', protect, removeFromFavorites);
router.post('/watchlist', protect, validateMovieAction, addToWatchlist);
router.delete('/watchlist/:imdbID', protect, removeFromWatchlist);
router.get('/user-lists', protect, getUserLists);

module.exports = router;
