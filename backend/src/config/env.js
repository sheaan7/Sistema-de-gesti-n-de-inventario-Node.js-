require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  EXTERNAL_API_URL: process.env.EXTERNAL_API_URL || 'https://fakestoreapi.com',
  SYNC_INTERVAL: process.env.SYNC_INTERVAL || '*/30 * * * *', // Cada 30 minutos
  NODE_ENV: process.env.NODE_ENV || 'development'
};