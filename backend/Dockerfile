# Backend Dockerfile
FROM node:18-alpine

# Instalar wget para healthcheck
RUN apk add --no-cache wget

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production --no-audit --no-fund

# Copiar el código fuente
COPY . .

# Crear directorio para datos y logs
RUN mkdir -p /app/data /app/logs && \
    chown -R nodejs:nodejs /app

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production \
    PORT=3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

# Comando de inicio
CMD ["node", "server.js"]
