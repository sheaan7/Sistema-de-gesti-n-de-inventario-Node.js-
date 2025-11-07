const express = require('express');
const router = express.Router();
const syncController = require('../controllers/syncController');

// Rutas de sincronización
router.get('/status', syncController.getStatus.bind(syncController));
router.post('/now', syncController.syncNow.bind(syncController));
router.post('/product/:externalId', syncController.syncProduct.bind(syncController));

module.exports = router;