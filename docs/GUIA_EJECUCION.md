# Guía de Ejecución - Sistema de Gestión de Inventario

## Requisitos Previos

### Software Necesario
- **Node.js**: v18 o superior
- **npm**: v9 o superior
- **Docker**: v20.10 o superior
- **Docker Compose**: v2.0 o superior
- **Git**: Para clonar el repositorio

### Verificar Instalaciones
```bash
node --version
npm --version
docker --version
docker-compose --version
```

---

## Opción 1: Ejecución Local (Desarrollo)

### 1. Clonar el Repositorio
```bash
git clone <URL_REPOSITORIO>
cd Sistema-de-gesti-n-de-inventario-Node.js-
```

### 2. Configurar Variables de Entorno

Crear archivo `.env` en la carpeta `backend/`:
```env
PORT=3000
EXTERNAL_API_URL=https://fakestoreapi.com
SYNC_INTERVAL=*/30 * * * *
NODE_ENV=development
```

### 3. Instalar Dependencias

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### 4. Iniciar el Proyecto

**Opción A - Terminales Separadas:**

Terminal 1 (Backend):
```bash
cd backend
npm start
# o para modo desarrollo:
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

**Opción B - Script Único:**
```bash
# Desde la raíz del proyecto
npm run start:all
```

### 5. Acceder a la Aplicación

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

---

## Opción 2: Ejecución con Docker (Producción)

### 1. Construcción de Imágenes

**Construir todas las imágenes:**
```bash
docker-compose build
```

**Construir imagen específica:**
```bash
docker-compose build backend
docker-compose build frontend
```

### 2. Iniciar Contenedores

**Iniciar todos los servicios:**
```bash
docker-compose up
```

**Iniciar en modo detached (segundo plano):**
```bash
docker-compose up -d
```

**Ver logs en tiempo real:**
```bash
docker-compose logs -f
```

**Ver logs de un servicio específico:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### 3. Detener Contenedores

**Detener servicios:**
```bash
docker-compose down
```

**Detener y eliminar volúmenes (datos):**
```bash
docker-compose down -v
```

### 4. Acceder a la Aplicación

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **MongoDB**: localhost:27017 (solo accesible internamente)

---

## Estructura de Puertos

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Backend  | 3000   | API REST    |
| Frontend | 8080   | Interfaz Web |
| MongoDB  | 27017  | Base de Datos |

---

## Endpoints de la API

### Productos

#### Listar todos los productos
```bash
GET http://localhost:3000/api/products
```

#### Obtener producto por ID
```bash
GET http://localhost:3000/api/products/:id
```

#### Crear nuevo producto
```bash
POST http://localhost:3000/api/products
Content-Type: application/json

{
  "title": "Producto Ejemplo",
  "price": 99.99,
  "description": "Descripción del producto",
  "category": "electronics",
  "image": "https://example.com/image.jpg"
}
```

#### Actualizar producto
```bash
PUT http://localhost:3000/api/products/:id
Content-Type: application/json

{
  "price": 89.99,
  "description": "Nueva descripción"
}
```

#### Eliminar producto
```bash
DELETE http://localhost:3000/api/products/:id
```

#### Buscar productos
```bash
GET http://localhost:3000/api/products/search?q=laptop
```

#### Filtrar por categoría
```bash
GET http://localhost:3000/api/products/category/electronics
```

### Sincronización

#### Estado de sincronización
```bash
GET http://localhost:3000/api/sync/status
```

#### Sincronizar ahora
```bash
POST http://localhost:3000/api/sync/now
```

### Health Check

```bash
GET http://localhost:3000/health
```

---

## Comandos Útiles Docker

### Gestión de Contenedores

```bash
# Ver contenedores en ejecución
docker ps

# Ver todos los contenedores
docker ps -a

# Entrar a un contenedor
docker exec -it inventory-backend sh
docker exec -it inventory-frontend sh
docker exec -it inventory-db mongo

# Reiniciar un servicio específico
docker-compose restart backend

# Ver uso de recursos
docker stats
```

### Gestión de Volúmenes

```bash
# Listar volúmenes
docker volume ls

# Inspeccionar volumen
docker volume inspect inventory_mongodb-data

# Backup de la base de datos
docker exec inventory-db mongodump --out /dump
docker cp inventory-db:/dump ./backup
```

### Limpieza

```bash
# Limpiar contenedores detenidos
docker container prune

# Limpiar imágenes sin usar
docker image prune

# Limpiar todo (cuidado!)
docker system prune -a
```

---

## Solución de Problemas

### Puerto ya en uso

**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solución:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Error de permisos Docker

**Windows**: Asegurarse de que Docker Desktop está ejecutándose como administrador.

**Linux**:
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Contenedor no inicia

```bash
# Ver logs detallados
docker-compose logs --tail=100 backend

# Reconstruir imagen
docker-compose build --no-cache backend
docker-compose up backend
```

### Base de datos no conecta

```bash
# Verificar que MongoDB está corriendo
docker-compose ps

# Reiniciar servicio de base de datos
docker-compose restart db

# Verificar logs de MongoDB
docker-compose logs db
```

### Sincronización no funciona

1. Verificar conexión a internet
2. Revisar logs del backend:
   ```bash
   docker-compose logs -f backend | grep SYNC
   ```
3. Forzar sincronización manual:
   ```bash
   curl -X POST http://localhost:3000/api/sync/now
   ```

---

## Testing

### Probar API con curl

```bash
# Health check
curl http://localhost:3000/health

# Listar productos
curl http://localhost:3000/api/products

# Crear producto
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Product","price":9.99,"category":"test"}'
```

### Probar con Postman

Importar la colección de Postman incluida en `docs/postman_collection.json`

---

## Variables de Entorno

### Backend (.env)

```env
# Puerto del servidor
PORT=3000

# URL de la API externa
EXTERNAL_API_URL=https://fakestoreapi.com

# Intervalo de sincronización (formato cron)
# */30 * * * * = cada 30 minutos
SYNC_INTERVAL=*/30 * * * *

# Ambiente
NODE_ENV=production

# MongoDB (solo para Docker)
MONGODB_URI=mongodb://db:27017/inventory
```

---

## Notas Importantes

1. **Datos persistentes**: En Docker, los datos de MongoDB se guardan en un volumen persistente
2. **Sincronización automática**: Por defecto cada 30 minutos desde FakeStore API
3. **CORS**: Habilitado para desarrollo local
4. **Base de datos local**: En modo desarrollo usa JSON file, en Docker usa MongoDB
5. **Hot reload**: Usar `npm run dev` para desarrollo con nodemon

---

## Contacto y Soporte

Para reportar problemas o contribuir, crear un issue en el repositorio del proyecto.
