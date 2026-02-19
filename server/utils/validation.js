const { body } = require('express-validator');

const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const validateMovieSearch = [
  body('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters')
];

const validateMovieAction = [
  body('imdbID')
    .notEmpty()
    .withMessage('Movie ID is required'),
  body('title')
    .notEmpty()
    .withMessage('Movie title is required'),
  body('poster')
    .optional(),
  body('year')
    .optional()
];

module.exports = {
  validateRegister,
  validateLogin,
  validateMovieSearch,
  validateMovieAction
};
