const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const decisionRoutes = require('./routes/decisionRoutes');
const outcomeRoutes = require('./routes/outcomeRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

connectDB();
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const isConfiguredOrigin = origin === FRONTEND_URL;
    const isLocalhostFrontend = /^https?:\/\/localhost:\d+$/.test(origin);

    if (isConfiguredOrigin || isLocalhostFrontend) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
}));
app.use(express.json());
app.use('/decisions', decisionRoutes);
app.use('/outcomes', outcomeRoutes);
app.use('/analytics', analyticsRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'Decision Journal API is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
