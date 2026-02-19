const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const memoryStore = require('../utils/memoryStore');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Try MongoDB first, fallback to memory store
    let existingUser;
    try {
      existingUser = await User.findOne({ email });
    } catch (dbError) {
      // MongoDB not available, use memory store
      existingUser = await memoryStore.findUserByEmail(email);
    }
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    let user;
    try {
      // Try MongoDB first
      user = await User.create({
        email,
        password,
      });
    } catch (dbError) {
      // MongoDB not available, use memory store
      user = await memoryStore.createUser({
        email,
        password, // In production, hash this
      });
    }

    const token = generateToken(user.id || user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id || user._id,
        email: user.email,
        favorites: user.favorites || [],
        watchlist: user.watchlist || []
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    let user;
    try {
      // Try MongoDB first
      user = await User.findOne({ email }).select('+password');
      
      if (user && !(await user.comparePassword(password))) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
    } catch (dbError) {
      // MongoDB not available, use memory store
      user = await memoryStore.findUserByEmail(email);
      
      if (user && user.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user.id || user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id || user._id,
        email: user.email,
        favorites: user.favorites || [],
        watchlist: user.watchlist || []
      }
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    let user;
    try {
      user = await User.findById(req.user.id);
    } catch (dbError) {
      user = await memoryStore.findUserById(req.user.id);
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: user.id || user._id,
        email: user.email,
        favorites: user.favorites || [],
        watchlist: user.watchlist || []
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile
};
