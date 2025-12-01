# Sistema de Gestión de Inventario con Sincronización 📦

Sistema completo de gestión de inventarios con sincronización automática a API externa, desarrollado con Node.js, Express, MongoDB y Docker.

![Node.js](https://img.shields.io/badge/Node.js-18-green)
![Express](https://img.shields.io/badge/Express-4.18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-7-green)
![Docker](https://img.shields.io/badge/Docker-20.10+-blue)

## Características

-  **CRUD Completo** - Crear, leer, actualizar y eliminar productos
-  **Sincronización Automática** - Integración con FakeStore API cada 30 minutos
-  **Búsqueda Avanzada** - Búsqueda por título, descripción y categoría
-  **Filtrado por Categoría** - Organización intuitiva de productos
-  **Dashboard Intuitivo** - Interfaz web moderna y responsiva
-  **Docker Ready** - Despliegue con un solo comando
-  **API RESTful** - 10 endpoints bien documentados
-  **Validación Robusta** - Validación en múltiples capas
-  **Estadísticas de Sincronización** - Monitoreo en tiempo real

##  Arquitectura

El sistema utiliza una arquitectura de microservicios con tres contenedores:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Frontend   │────▶│   Backend   │────▶│  MongoDB    │
│   (Nginx)   │     │  (Node.js)  │     │             │
│   :8080     │     │    :3000    │     │   :27017    │
└─────────────┘     └─────────────┘     └─────────────┘
```

##  Inicio Rápido

### Opción 1: Docker (Recomendado)

```bash
# Clonar el repositorio
git clone <repo-url>
cd Sistema-de-gesti-n-de-inventario-Node.js-

# Iniciar con Docker Compose
docker-compose up -d

# Acceder a la aplicación
# Frontend: http://localhost:8080
# Backend: http://localhost:3000
```

### Opción 2: Local

```bash
# Backend
cd backend
npm install
npm start

# Frontend (en otra terminal)
cd frontend
npm install
npm start
```

## 📖 Documentación

### Documentos Principales

-  [**Guía de Ejecución**](docs/GUIA_EJECUCION.md) - Instrucciones detalladas de instalación y uso
-  [**Especificación de API**](docs/ESPECIFICACION_API.md) - Documentación completa de endpoints
-  [**Informe Técnico**](docs/INFORME_TECNICO.md) - Decisiones de diseño y aprendizajes

### Diagramas

#### UML (3 diagramas)
- [Diagrama de Clases](docs/uml/diagrama_clases.puml)
- [Diagrama de Secuencia - Crear Producto](docs/uml/diagrama_secuencia_crear.puml)
- [Diagrama de Secuencia - Sincronización](docs/uml/diagrama_secuencia_sync.puml)

#### BPMN (3 diagramas)
- [Proceso de Gestión de Productos](docs/bpmn/bpmn_gestion_productos.puml)
- [Proceso de Sincronización](docs/bpmn/bpmn_sincronizacion.puml)
- [Proceso de Despliegue](docs/bpmn/bpmn_despliegue.puml)

#### Arquitectura
- [Diagrama de Arquitectura del Sistema](docs/diagramas/arquitectura_sistema.puml)

## 🔌 API Endpoints

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Listar todos los productos |
| GET | `/api/products/:id` | Obtener producto por ID |
| POST | `/api/products` | Crear nuevo producto |
| PUT | `/api/products/:id` | Actualizar producto |
| DELETE | `/api/products/:id` | Eliminar producto |
| GET | `/api/products/search?q=...` | Buscar productos |
| GET | `/api/products/category/:category` | Filtrar por categoría |

### Sincronización

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/sync/status` | Estado de sincronización |
| POST | `/api/sync/now` | Sincronizar ahora |

### Sistema

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Health check |

## 🛠️ Stack Tecnológico

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Nginx Alpine

### Backend
- Node.js 18 LTS
- Express.js 4.18
- node-cron 3.0
- axios 1.6

### Base de Datos
- MongoDB 7

### DevOps
- Docker
- Docker Compose

##  Estructura del Proyecto

```
Sistema-de-gesti-n-de-inventario-Node.js-/
├── backend/              # Backend Node.js
│   ├── src/
│   │   ├── config/      # Configuración
│   │   ├── controllers/ # Controladores
│   │   ├── middleware/  # Middleware
│   │   ├── models/      # Modelos
│   │   ├── routes/      # Rutas
│   │   ├── services/    # Servicios
│   │   └── app.js       # App Express
│   ├── Dockerfile
│   └── server.js        # Entry point
├── frontend/            # Frontend estático
│   ├── public/
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── app.js
│   ├── Dockerfile
│   └── nginx.conf
├── docs/                # Documentación
│   ├── diagramas/       # Arquitectura
│   ├── uml/             # 3 Diagramas UML
│   ├── bpmn/            # 3 Diagramas BPMN
│   ├── GUIA_EJECUCION.md
│   ├── ESPECIFICACION_API.md
│   └── INFORME_TECNICO.md
└── docker-compose.yml   # Orquestación
```

##  Configuración

### Variables de Entorno (Backend)

```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb://db:27017/inventory
EXTERNAL_API_URL=https://fakestoreapi.com
SYNC_INTERVAL=*/30 * * * *
```

##  Testing

```bash
# Probar API con cURL
curl http://localhost:3000/health
curl http://localhost:3000/api/products

# Crear producto
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","price":9.99}'
```

##  Monitoreo

```bash
# Ver logs
docker-compose logs -f

# Ver logs específicos
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Estado de contenedores
docker-compose ps

# Estadísticas de recursos
docker stats
```

##  Comandos Útiles

```bash
# Detener servicios
docker-compose down

# Detener y limpiar volúmenes
docker-compose down -v

# Reconstruir imágenes
docker-compose build --no-cache

# Reiniciar servicio específico
docker-compose restart backend

# Entrar a un contenedor
docker exec -it inventory-backend sh
```

##  Solución de Problemas

### Puerto en uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Contenedor no inicia
```bash
docker-compose logs backend
docker-compose build --no-cache backend
docker-compose up backend
```

### Base de datos no conecta
```bash
docker-compose restart db
docker-compose logs db
```

##  Entregables Completados

 **Aplicación funcional**
- CRUD completo de productos
- Sincronización automática con FakeStore API
- Frontend interactivo

 **Documentación completa**
-  3 Diagramas UML (Clases, Secuencia x2)
-  3 Diagramas BPMN (Gestión, Sincronización, Despliegue)
-  1 Diagrama de Arquitectura
-  Especificación de API completa
-  Guía de ejecución detallada
-  Informe técnico completo

 **Docker**
-  Frontend en contenedor separado (Nginx)
-  Backend en contenedor separado (Node.js)
-  Base de datos en contenedor separado (MongoDB)
-  Docker Compose para orquestación

 **Informe técnico**
-  Decisiones de diseño justificadas
-  Tecnologías utilizadas documentadas
-  Aprendizajes obtenidos detallados

## 📝 Licencia

Este proyecto es de uso académico. ;)



**Desarrollado con ❤️ por:**
- Jean Pierre Perez (Backend y Frontend)
- Daniel V. (Docker y DB )

