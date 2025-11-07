const app = require('./src/app');
const config = require('./src/config/env');
const syncService = require('./src/services/syncService');

const PORT = config.PORT;

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('SISTEMA DE INVENTARIO - SERVIDOR INICIADO');
  console.log('='.repeat(60));
  console.log('');
  console.log(`Puerto:          ${PORT}`);
  console.log(` URL:             http://localhost:${PORT}`);
  console.log(`Ambiente:        ${config.NODE_ENV}`);
  console.log(` API Externa:     ${config.EXTERNAL_API_URL}`);
  console.log(` Sincronización:  ${config.SYNC_INTERVAL}`);
  console.log('');
  console.log(' Endpoints disponibles:');
  console.log('   GET    /health');
  console.log('   GET    /api/products');
  console.log('   GET    /api/products/:id');
  console.log('   POST   /api/products');
  console.log('   PUT    /api/products/:id');
  console.log('   DELETE /api/products/:id');
  console.log('   GET    /api/products/search?q=...');
  console.log('   GET    /api/products/category/:category');
  console.log('   GET    /api/sync/status');
  console.log('   POST   /api/sync/now');
  console.log('');
  console.log('='.repeat(60));
  console.log('Servidor listo para recibir peticiones');
  console.log('Presiona Ctrl+C para detener');
  console.log('='.repeat(60));
  console.log('');
  
  // Iniciar servicio de sincronización
  console.log('[SYNC] Iniciando servicio de sincronización...');
  syncService.start();
});

// Manejo de errores del servidor
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Error: El puerto ${PORT} ya está en uso`);
    console.error('Soluciones:');
    console.error('1. Cambia el puerto en el archivo .env');
    console.error('2. Detén el proceso que usa el puerto:');
    console.error(`lsof -i :${PORT}`);
    console.error(`kill -9 <PID>`);
  } else {
    console.error('Error en el servidor:', error.message);
  }
  process.exit(1);
});

// Manejo de cierre graceful
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

function shutdown() {
  console.log('');
  console.log(' Señal de cierre recibida');
  console.log('Cerrando servidor gracefully...');
  
  server.close(() => {
    console.log('Servidor cerrado correctamente');
    console.log('gubai! ');
    process.exit(0);
  });
  
  // Forzar cierre después de 10 segundos
  setTimeout(() => {
    console.error('Forzando cierre del servidor...');
    process.exit(1);
  }, 10000);
}

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Excepción no capturada:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promise rechazada no manejada:', reason);
  process.exit(1);
});