const express = require('express');
const cors = require('cors');
const connectDB = require('../server/config/database');
const errorHandler = require('../server/middleware/errorHandler');

const authRoutes = require('../server/routes/auth');
const movieRoutes = require('../server/routes/movies');

const app = express();

connectDB();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://netflix-project-two-pi.vercel.app', 'https://netflix-project-5c0778chx-nandeesh0007s-projects.vercel.app']
    : 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ 
    message: 'Netflix Clone API is running',
    version: '1.0.0',
    status: 'active'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

app.use(errorHandler);

module.exports = app;
