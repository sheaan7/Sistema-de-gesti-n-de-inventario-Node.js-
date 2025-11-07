const syncService = require('../services/syncService');

class SyncController {
  // GET /api/sync/status
  getStatus(req, res) {
    try {
      const status = syncService.getStatus();
      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener estado de sincronización',
        message: error.message
      });
    }
  }

  // POST /api/sync/now
  async syncNow(req, res) {
    try {
      // Ejecutar sincronización en segundo plano
      syncService.syncNow().catch(error => {
        console.error('[SYNC] Error en sincronización manual:', error);
      });

      res.json({
        success: true,
        message: 'Sincronización iniciada'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al iniciar sincronización',
        message: error.message
      });
    }
  }

  // POST /api/sync/product/:externalId
  async syncProduct(req, res) {
    try {
      const { externalId } = req.params;
      const result = await syncService.forceSyncById(externalId);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al sincronizar producto',
        message: error.message
      });
    }
  }
}

module.exports = new SyncController();