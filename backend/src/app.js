const express = require('express');
const cors = require('cors');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const syncRoutes = require('./routes/syncRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rutas API
app.use('/api/products', productRoutes);
app.use('/api/sync', syncRoutes);

// Servir archivos estáticos del frontend
const frontendPath = path.join(__dirname, '../../frontend/public');
app.use(express.static(frontendPath));

// Ruta raíz - servir el frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Manejo de errores (debe ir al final)
app.use(notFound);
app.use(errorHandler);

module.exports = app;