const cron = require('node-cron');
const externalApiService = require('./externalApiService');
const database = require('../config/database');
const Product = require('../models/Product');
const config = require('../config/env');

class SyncService {
  constructor() {
    this.isRunning = false;
    this.lastSync = null;
    this.syncStats = {
      total: 0,
      added: 0,
      updated: 0,
      errors: 0
    };
  }

  start() {
    console.log(`[SYNC] Servicio de sincronización iniciado`);
    console.log(`[SYNC] Patrón cron: ${config.SYNC_INTERVAL}`);
    
    // Sincronización inicial
    this.syncNow();

    // Programar sincronización periódica
    cron.schedule(config.SYNC_INTERVAL, () => {
      this.syncNow();
    });
  }

  async syncNow() {
    if (this.isRunning) {
      console.log('[SYNC] Sincronización ya en proceso, omitiendo...');
      return;
    }

    this.isRunning = true;
    console.log('[SYNC] Iniciando sincronización...');
    const startTime = Date.now();

    try {
      const result = await externalApiService.getAllProducts();
      
      if (!result.success) {
        throw new Error(result.error);
      }

      const externalProducts = result.data;
      const localProducts = database.findAll();
      
      this.syncStats = {
        total: externalProducts.length,
        added: 0,
        updated: 0,
        errors: 0
      };

      for (const extProduct of externalProducts) {
        try {
          await this.syncProduct(extProduct, localProducts);
        } catch (error) {
          console.error(`[SYNC] Error sincronizando producto ${extProduct.id}:`, error.message);
          this.syncStats.errors++;
        }
      }

      this.lastSync = new Date();
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      
      console.log('[SYNC] Sincronización completada');
      console.log(`[SYNC] Duración: ${duration}s`);
      console.log(`[SYNC] Estadísticas:`, this.syncStats);

    } catch (error) {
      console.error('[SYNC] Error en sincronización:', error.message);
    } finally {
      this.isRunning = false;
    }
  }

  async syncProduct(externalProduct, localProducts) {
    // Buscar si el producto ya existe (por externalId)
    const existing = localProducts.find(p => p.externalId === externalProduct.id);

    if (existing) {
      // Actualizar producto existente
      const updates = {
        title: externalProduct.title,
        price: externalProduct.price,
        description: externalProduct.description,
        category: externalProduct.category,
        image: externalProduct.image,
        synced: true
      };
      
      database.update(existing.id, updates);
      this.syncStats.updated++;
    } else {
      // Crear nuevo producto
      const newProduct = Product.fromExternal(externalProduct);
      database.create(newProduct);
      this.syncStats.added++;
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      lastSync: this.lastSync,
      stats: this.syncStats
    };
  }

  async forceSyncById(externalId) {
    try {
      const result = await externalApiService.getProductById(externalId);
      
      if (!result.success) {
        return { success: false, error: result.error };
      }

      const localProducts = database.findAll();
      await this.syncProduct(result.data, localProducts);

      return { success: true, message: 'Producto sincronizado correctamente' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new SyncService();