# Informe Técnico - Sistema de Gestión de Inventario con Sincronización

**Fecha:** Noviembre 2025  
**Proyecto:** Sistema de Gestión de Inventario Node.js  
**Equipo:** [Nombres del equipo]

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Introducción](#introducción)
3. [Decisiones de Diseño](#decisiones-de-diseño)
4. [Arquitectura del Sistema](#arquitectura-del-sistema)
5. [Tecnologías Utilizadas](#tecnologías-utilizadas)
6. [Modelo de Datos](#modelo-de-datos)
7. [Implementación](#implementación)
8. [Despliegue con Docker](#despliegue-con-docker)
9. [Aprendizajes Obtenidos](#aprendizajes-obtenidos)
10. [Conclusiones](#conclusiones)
11. [Referencias](#referencias)

---

## 1. Resumen Ejecutivo

Este documento presenta el desarrollo completo de un sistema de gestión de inventarios con capacidades de sincronización automática con una API externa. El proyecto implementa una arquitectura de tres capas (Frontend, Backend, Base de Datos) desplegada mediante contenedores Docker, cumpliendo con los principios de separación de responsabilidades y escalabilidad.

El sistema permite realizar operaciones CRUD completas sobre productos, búsquedas avanzadas, filtrado por categorías y sincronización automática cada 30 minutos con FakeStore API para mantener el inventario actualizado.

**Características principales:**
- API REST completa con 10 endpoints
- Interfaz web responsiva e intuitiva
- Sincronización automática configurable
- Arquitectura basada en microservicios con Docker
- Persistencia dual: JSON (desarrollo) y MongoDB (producción)

---

## 2. Introducción

### 2.1 Contexto del Proyecto

En el contexto empresarial actual, la gestión eficiente de inventarios es crucial para el éxito operacional. Este proyecto aborda la necesidad de mantener un inventario local sincronizado con fuentes externas de datos, permitiendo actualizaciones automáticas de precios, descripciones y disponibilidad de productos.

### 2.2 Objetivos

**Objetivos Generales:**
- Desarrollar un sistema completo de gestión de inventarios
- Implementar sincronización automática con API externa
- Desplegar la aplicación usando contenedores Docker

**Objetivos Específicos:**
1. Crear una API REST robusta para gestión de productos
2. Desarrollar una interfaz web intuitiva y responsiva
3. Implementar sincronización automática mediante cron jobs
4. Dockerizar cada componente de forma independiente
5. Documentar completamente el sistema (UML, BPMN, API)

### 2.3 Alcance

**Incluido:**
- CRUD completo de productos
- Búsqueda y filtrado avanzado
- Sincronización automática con FakeStore API
- Persistencia en MongoDB
- Interfaz web completa
- Documentación técnica exhaustiva
- Despliegue con Docker Compose

**Excluido:**
- Autenticación de usuarios
- Sistema de roles y permisos
- Gestión de múltiples almacenes
- Reportes y análisis avanzados
- Notificaciones en tiempo real

---

## 3. Decisiones de Diseño

### 3.1 Arquitectura de Tres Capas

**Decisión:** Implementar una arquitectura de tres capas separadas físicamente.

**Justificación:**
- **Separación de responsabilidades:** Cada capa tiene un propósito específico
- **Escalabilidad:** Permite escalar componentes independientemente
- **Mantenibilidad:** Facilita actualizaciones sin afectar otras capas
- **Despliegue:** Optimiza el uso de recursos en contenedores

**Capas implementadas:**
1. **Presentación (Frontend):** Nginx + HTML/CSS/JavaScript
2. **Lógica de Negocio (Backend):** Node.js + Express
3. **Datos (Database):** MongoDB + File System

### 3.2 API RESTful

**Decisión:** Utilizar arquitectura REST para el backend.

**Justificación:**
- **Estándar de la industria:** Ampliamente adoptado y documentado
- **Stateless:** Cada petición es independiente, mejora escalabilidad
- **Cacheable:** Permite optimización de rendimiento
- **Uniform Interface:** Simplifica la integración con clientes

**Principios aplicados:**
- Uso de verbos HTTP correctos (GET, POST, PUT, DELETE)
- URIs descriptivas y jerárquicas
- Códigos de estado HTTP apropiados
- Respuestas en formato JSON

### 3.3 Persistencia Dual

**Decisión:** Implementar dos estrategias de persistencia.

**Justificación:**
- **Desarrollo rápido:** JSON file permite testing sin dependencias
- **Producción robusta:** MongoDB ofrece escalabilidad y características avanzadas
- **Flexibilidad:** Fácil cambio entre entornos

**Implementación:**
```javascript
// Desarrollo
Database -> File System (products.json)

// Producción
Database -> MongoDB (products collection)
```

### 3.4 Sincronización con Cron

**Decisión:** Usar node-cron para sincronización periódica.

**Justificación:**
- **Automatización:** No requiere intervención manual
- **Configurabilidad:** Patrón cron permite ajustes precisos
- **Ligero:** No requiere servicios externos adicionales
- **Confiable:** Ejecución garantizada según schedule

**Configuración:**
```bash
*/30 * * * *  # Cada 30 minutos
```

### 3.5 Contenedorización con Docker

**Decisión:** Separar frontend, backend y base de datos en contenedores independientes.

**Justificación:**
- **Aislamiento:** Cada servicio corre en su propio entorno
- **Portabilidad:** "Funciona en mi máquina" → "Funciona en cualquier máquina"
- **Escalabilidad:** Posibilidad de replicar servicios específicos
- **Orquestación:** Docker Compose simplifica el despliegue multi-contenedor

### 3.6 Gestión de Errores

**Decisión:** Implementar middleware centralizado de manejo de errores.

**Justificación:**
- **Consistencia:** Todas las respuestas de error siguen el mismo formato
- **Logging:** Centraliza el registro de errores
- **Seguridad:** Evita exposición de detalles internos en producción
- **Debugging:** Facilita la identificación de problemas

---

## 4. Arquitectura del Sistema

### 4.1 Vista General

El sistema sigue una arquitectura de microservicios con tres contenedores principales comunicándose a través de una red Docker interna.

```
┌─────────────────────────────────────────────────────────┐
│                    USUARIO FINAL                        │
│                   (Navegador Web)                       │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP (Puerto 8080)
                     ▼
┌─────────────────────────────────────────────────────────┐
│              FRONTEND CONTAINER (Nginx)                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │  • Archivos estáticos (HTML/CSS/JS)            │   │
│  │  • Proxy reverso para API                       │   │
│  │  • Cache de assets                              │   │
│  └─────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP (Red interna)
                     ▼
┌─────────────────────────────────────────────────────────┐
│            BACKEND CONTAINER (Node.js)                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Express Server (Puerto 3000)                   │   │
│  │  ├─ Routes                                       │   │
│  │  ├─ Controllers                                  │   │
│  │  ├─ Services                                     │   │
│  │  └─ Cron Job (Sincronización)                  │   │
│  └─────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │ MongoDB Protocol (Red interna)
                     ▼
┌─────────────────────────────────────────────────────────┐
│            DATABASE CONTAINER (MongoDB)                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │  • Products Collection                          │   │
│  │  • Índices para búsqueda rápida                │   │
│  │  • Volumen persistente                          │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Flujo de Datos

#### Flujo de Creación de Producto:
```
Usuario → Frontend → Backend → Validación → Database → Respuesta → Frontend → Usuario
```

#### Flujo de Sincronización:
```
Cron → Sync Service → FakeStore API → Procesamiento → Database → Logs
```

### 4.3 Componentes Principales

#### Frontend:
- **Tecnología:** HTML5, CSS3, JavaScript Vanilla
- **Servidor:** Nginx Alpine
- **Responsabilidades:**
  - Renderizado de UI
  - Validación de formularios
  - Comunicación con API
  - Gestión de estado local

#### Backend:
- **Framework:** Express.js sobre Node.js 18
- **Responsabilidades:**
  - Exposición de API REST
  - Lógica de negocio
  - Validación de datos
  - Sincronización con API externa
  - Persistencia de datos

#### Base de Datos:
- **Motor:** MongoDB 7
- **Responsabilidades:**
  - Almacenamiento persistente
  - Indexación para búsquedas rápidas
  - Respaldo automático via volúmenes

---

## 5. Tecnologías Utilizadas

### 5.1 Stack Tecnológico

| Capa | Tecnología | Versión | Justificación |
|------|-----------|---------|---------------|
| **Frontend** | HTML5 | - | Estándar web moderno |
| | CSS3 | - | Estilos responsivos |
| | JavaScript | ES6+ | Funcionalidades interactivas |
| | Nginx | Alpine | Servidor web ligero y eficiente |
| **Backend** | Node.js | 18 LTS | Runtime JavaScript estable |
| | Express.js | 4.18.2 | Framework minimalista y popular |
| | node-cron | 3.0.3 | Scheduling de tareas |
| | axios | 1.6.0 | Cliente HTTP para API externa |
| | cors | 2.8.5 | Habilitación de CORS |
| | dotenv | 16.3.1 | Gestión de variables de entorno |
| **Base de Datos** | MongoDB | 7 | Base de datos NoSQL escalable |
| **Infraestructura** | Docker | 20.10+ | Contenedorización |
| | Docker Compose | 2.0+ | Orquestación multi-contenedor |
| **API Externa** | FakeStore API | - | Fuente de datos de productos |

### 5.2 Dependencias de Desarrollo

```json
{
  "devDependencies": {
    "nodemon": "^3.0.1",
    "http-server": "^14.1.1"
  }
}
```

### 5.3 Herramientas de Desarrollo

- **IDE:** Visual Studio Code
- **Control de Versiones:** Git
- **Testing API:** cURL, Postman
- **Diagramas:** PlantUML
- **Documentación:** Markdown

---

## 6. Modelo de Datos

### 6.1 Entidad Product

```typescript
interface Product {
  id: string;              // ID único generado
  title: string;           // Nombre del producto
  price: number;           // Precio en USD
  description?: string;    // Descripción detallada
  category?: string;       // Categoría del producto
  image?: string;          // URL de imagen
  rating?: {
    rate: number;          // Calificación (0-5)
    count: number;         // Número de calificaciones
  };
  createdAt: string;       // Timestamp de creación
  updatedAt: string;       // Timestamp de última actualización
}
```

### 6.2 Esquema MongoDB

```javascript
{
  _id: ObjectId,
  id: String (indexed),
  title: String (indexed),
  price: Number,
  description: String,
  category: String (indexed),
  image: String,
  rating: {
    rate: Number,
    count: Number
  },
  createdAt: ISODate,
  updatedAt: ISODate
}
```

### 6.3 Índices

```javascript
// Índices para optimizar búsquedas
db.products.createIndex({ "id": 1 }, { unique: true })
db.products.createIndex({ "title": "text", "description": "text" })
db.products.createIndex({ "category": 1 })
db.products.createIndex({ "price": 1 })
```

### 6.4 Relaciones

El sistema actual no implementa relaciones complejas. Futuras expansiones podrían incluir:
- **Categorías:** Entidad separada con relación 1:N con productos
- **Proveedores:** Relación N:M con productos
- **Movimientos de Inventario:** Registro histórico de cambios

---

## 7. Implementación

### 7.1 Estructura del Proyecto

```
Sistema-de-gesti-n-de-inventario-Node.js-/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.js              # Variables de entorno
│   │   │   └── database.js         # Configuración DB
│   │   ├── controllers/
│   │   │   ├── productController.js
│   │   │   └── syncController.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   └── Product.js
│   │   ├── routes/
│   │   │   ├── productRoutes.js
│   │   │   └── syncRoutes.js
│   │   ├── services/
│   │   │   └── syncService.js
│   │   └── app.js
│   ├── data/                       # JSON storage (dev)
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── app.js
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf
│   └── package.json
├── docs/
│   ├── diagramas/
│   │   └── arquitectura_sistema.puml
│   ├── uml/
│   │   ├── diagrama_clases.puml
│   │   ├── diagrama_secuencia_crear.puml
│   │   └── diagrama_secuencia_sync.puml
│   ├── bpmn/
│   │   ├── bpmn_gestion_productos.puml
│   │   ├── bpmn_sincronizacion.puml
│   │   └── bpmn_despliegue.puml
│   ├── ESPECIFICACION_API.md
│   ├── GUIA_EJECUCION.md
│   └── INFORME_TECNICO.md
├── docker-compose.yml
├── .gitignore
└── README.md
```

### 7.2 Patrones de Diseño Implementados

#### 7.2.1 MVC (Model-View-Controller)

```
Model      → Database Layer (database.js)
View       → Frontend (HTML/CSS/JS)
Controller → Backend Controllers (productController.js)
```

#### 7.2.2 Singleton

```javascript
// database.js
class Database {
  constructor() { /* ... */ }
}
module.exports = new Database(); // Única instancia
```

#### 7.2.3 Middleware Pattern

```javascript
app.use(cors());
app.use(express.json());
app.use(loggingMiddleware);
app.use('/api/products', productRoutes);
app.use(errorHandler);
```

#### 7.2.4 Repository Pattern

```javascript
class Database {
  findAll() { /* ... */ }
  findById(id) { /* ... */ }
  create(data) { /* ... */ }
  update(id, data) { /* ... */ }
  delete(id) { /* ... */ }
}
```

### 7.3 Características Destacadas

#### 7.3.1 Sincronización Inteligente

El sistema implementa una lógica de sincronización que:
1. Evita duplicados mediante comparación de IDs externos
2. Solo actualiza si hay cambios reales en los datos
3. Registra estadísticas detalladas (añadidos, actualizados, errores)
4. Maneja errores sin interrumpir el servicio principal

```javascript
async function syncProducts() {
  const externalProducts = await fetchFromAPI();
  const localProducts = await db.findAll();
  
  for (const extProduct of externalProducts) {
    const local = localProducts.find(p => p.externalId === extProduct.id);
    
    if (!local) {
      await db.create(transformProduct(extProduct));
      stats.added++;
    } else if (hasChanges(local, extProduct)) {
      await db.update(local.id, transformProduct(extProduct));
      stats.updated++;
    }
  }
}
```

#### 7.3.2 Búsqueda y Filtrado

Implementa búsqueda en múltiples campos:
```javascript
function searchProducts(query) {
  return products.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.description?.toLowerCase().includes(query.toLowerCase()) ||
    p.category?.toLowerCase().includes(query.toLowerCase())
  );
}
```

#### 7.3.3 Validación de Datos

Validación en múltiples niveles:
- **Frontend:** Validación HTML5 + JavaScript
- **Backend:** Validación explícita en controladores
- **Base de Datos:** Constraints en MongoDB

```javascript
function validateProduct(data) {
  const errors = [];
  if (!data.title || data.title.trim() === '') {
    errors.push('El título es requerido');
  }
  if (!data.price || data.price <= 0) {
    errors.push('El precio debe ser mayor a 0');
  }
  return errors;
}
```

### 7.4 Seguridad Implementada

1. **CORS:** Configurado para permitir solo orígenes específicos en producción
2. **Validación de Entrada:** Sanitización de datos antes de persistir
3. **Error Handling:** No expone detalles internos en producción
4. **Usuarios No-Root:** Contenedores Docker corren con usuarios limitados
5. **Health Checks:** Monitoreo continuo de estado de servicios

---

## 8. Despliegue con Docker

### 8.1 Arquitectura de Contenedores

El sistema se despliega como tres contenedores independientes:

```yaml
services:
  db:          # MongoDB
  backend:     # Node.js + Express
  frontend:    # Nginx + Static Files
```

### 8.2 Configuración de Red

```yaml
networks:
  inventory-network:
    driver: bridge
```

**Ventajas:**
- Aislamiento de red
- Resolución DNS automática entre contenedores
- Seguridad mejorada

### 8.3 Volúmenes Persistentes

```yaml
volumes:
  mongodb-data:        # Datos de MongoDB
  backend-logs:        # Logs del backend
```

### 8.4 Health Checks

Cada servicio implementa health checks:

```yaml
healthcheck:
  test: ["CMD", "wget", "--spider", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

### 8.5 Proceso de Despliegue

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd Sistema-de-gesti-n-de-inventario-Node.js-

# 2. Construir imágenes
docker-compose build

# 3. Iniciar servicios
docker-compose up -d

# 4. Verificar estado
docker-compose ps

# 5. Ver logs
docker-compose logs -f

# 6. Acceder a la aplicación
# Frontend: http://localhost:8080
# Backend: http://localhost:3000
```

### 8.6 Estrategia de Actualización

```bash
# Actualización sin downtime
docker-compose pull
docker-compose up -d --no-deps --build backend
docker-compose up -d --no-deps --build frontend
```

---

## 9. Aprendizajes Obtenidos

### 9.1 Técnicos

#### 9.1.1 Node.js y Express
- **Aprendido:** Creación de APIs RESTful robustas con Express
- **Desafío:** Manejo adecuado de promesas y async/await
- **Solución:** Implementación de try-catch consistente y error handlers

#### 9.1.2 Docker y Contenedores
- **Aprendido:** Orquestación multi-contenedor con Docker Compose
- **Desafío:** Comunicación entre contenedores
- **Solución:** Uso de redes Docker y DNS interno

#### 9.1.3 MongoDB
- **Aprendido:** Base de datos NoSQL y su flexibilidad
- **Desafío:** Migración de JSON file a MongoDB
- **Solución:** Abstracción mediante capa de base de datos

#### 9.1.4 Cron Jobs
- **Aprendido:** Automatización de tareas con node-cron
- **Desafío:** Evitar ejecuciones concurrentes
- **Solución:** Flag isRunning y validación antes de ejecutar

### 9.2 Arquitectura

#### 9.2.1 Separación de Responsabilidades
La separación en capas facilitó:
- Testing independiente de componentes
- Escalabilidad horizontal
- Mantenimiento más sencillo

#### 9.2.2 Diseño de APIs
Lecciones sobre diseño de APIs RESTful:
- Usar verbos HTTP correctamente
- URIs descriptivas y consistentes
- Códigos de estado HTTP apropiados
- Respuestas JSON bien estructuradas

### 9.3 Mejores Prácticas

#### 9.3.1 Código Limpio
- Nombres descriptivos para variables y funciones
- Funciones pequeñas con responsabilidad única
- Comentarios solo donde añaden valor
- Consistencia en el estilo de código

#### 9.3.2 Control de Versiones
- Commits atómicos y descriptivos
- Uso de .gitignore apropiado
- Branches para features

#### 9.3.3 Documentación
- README con instrucciones claras
- Especificación de API detallada
- Diagramas UML y BPMN para visualización
- Comentarios en código complejo

### 9.4 Desafíos Superados

1. **Sincronización sin duplicados**
   - Problema: API externa usa IDs diferentes
   - Solución: Mapeo de IDs externos a internos

2. **CORS en Docker**
   - Problema: Frontend no podía acceder al backend
   - Solución: Proxy reverso en Nginx

3. **Persistencia de datos**
   - Problema: Pérdida de datos al reiniciar contenedor
   - Solución: Volúmenes Docker persistentes

4. **Health checks timing**
   - Problema: Contenedores marcados como unhealthy prematuramente
   - Solución: Ajuste de start_period y timeouts

---

## 10. Conclusiones

### 10.1 Objetivos Alcanzados

✅ **Sistema completo de gestión de inventarios**
- CRUD funcional con validación robusta
- Búsqueda y filtrado avanzado
- Interfaz intuitiva y responsiva

✅ **Sincronización automática**
- Integración exitosa con FakeStore API
- Ejecución periódica con node-cron
- Manejo inteligente de duplicados y actualizaciones

✅ **Arquitectura de microservicios**
- Separación clara de responsabilidades
- Contenedores independientes y escalables
- Comunicación eficiente entre servicios

✅ **Documentación completa**
- Diagramas UML (3): Clases, Secuencia x2
- Diagramas BPMN (3): Gestión, Sincronización, Despliegue
- Diagrama de arquitectura
- Especificación de API
- Guía de ejecución

✅ **Despliegue con Docker**
- Frontend, Backend y Base de Datos separados
- Orquestación con Docker Compose
- Persistencia de datos garantizada
- Health checks implementados

### 10.2 Fortalezas del Proyecto

1. **Arquitectura Sólida:** Separación clara de capas facilita mantenimiento
2. **Escalabilidad:** Diseño permite crecimiento horizontal
3. **Documentación:** Completa y bien estructurada
4. **Código Limpio:** Siguiendo mejores prácticas
5. **Automatización:** Sincronización sin intervención manual
6. **Portabilidad:** Docker garantiza "runs everywhere"

### 10.3 Áreas de Mejora

#### 10.3.1 Corto Plazo
- [ ] Implementar testing automatizado (Jest, Mocha)
- [ ] Añadir logging estructurado (Winston, Pino)
- [ ] Mejorar manejo de errores con códigos más específicos
- [ ] Implementar rate limiting en la API

#### 10.3.2 Mediano Plazo
- [ ] Sistema de autenticación (JWT)
- [ ] Roles y permisos
- [ ] Paginación en listados
- [ ] WebSockets para actualizaciones en tiempo real
- [ ] Dashboard con métricas

#### 10.3.3 Largo Plazo
- [ ] Migrar a TypeScript
- [ ] Implementar caché (Redis)
- [ ] CI/CD pipeline
- [ ] Monitoreo y observabilidad (Prometheus, Grafana)
- [ ] Kubernetes para orquestación avanzada

### 10.4 Lecciones Aprendidas

1. **Planificación es clave:** Diseño previo ahorra tiempo de desarrollo
2. **Documentación continua:** Documentar mientras se desarrolla es más eficiente
3. **Testing temprano:** Detectar errores pronto reduce costos
4. **Simplicidad primero:** Empezar simple y luego iterar
5. **Herramientas adecuadas:** Elegir tecnologías según necesidades reales

### 10.5 Impacto del Proyecto

Este proyecto ha demostrado:
- Capacidad de diseñar sistemas escalables
- Comprensión de arquitecturas de microservicios
- Habilidad para integrar múltiples tecnologías
- Competencia en DevOps con Docker
- Habilidad para documentar profesionalmente

### 10.6 Reflexión Final

El desarrollo de este sistema de gestión de inventarios ha sido una experiencia completa que abarcó desde el diseño arquitectónico hasta el despliegue en producción. El proyecto no solo cumplió con los requisitos técnicos establecidos, sino que también proporcionó un profundo aprendizaje en:

- **Desarrollo Full Stack:** Integración exitosa de frontend, backend y base de datos
- **DevOps:** Contenedorización y orquestación con Docker
- **Integración de Sistemas:** Sincronización con APIs externas
- **Documentación Profesional:** Creación de documentación técnica completa
- **Trabajo en Equipo:** (Si aplica) Colaboración efectiva entre miembros

El sistema resultante es funcional, mantenible y preparado para escalar según las necesidades futuras. La arquitectura implementada permite agregar nuevas funcionalidades sin comprometer la estabilidad del sistema existente.

---

## 11. Referencias

### 11.1 Documentación Oficial

1. **Node.js**
   - https://nodejs.org/docs/

2. **Express.js**
   - https://expressjs.com/

3. **MongoDB**
   - https://docs.mongodb.com/

4. **Docker**
   - https://docs.docker.com/

5. **Docker Compose**
   - https://docs.docker.com/compose/

6. **Nginx**
   - https://nginx.org/en/docs/

### 11.2 APIs Externas

1. **FakeStore API**
   - https://fakestoreapi.com/docs

### 11.3 Librerías Utilizadas

1. **node-cron**
   - https://www.npmjs.com/package/node-cron

2. **axios**
   - https://axios-http.com/docs/intro

3. **cors**
   - https://www.npmjs.com/package/cors

4. **dotenv**
   - https://www.npmjs.com/package/dotenv

### 11.4 Recursos de Aprendizaje

1. **MDN Web Docs**
   - https://developer.mozilla.org/

2. **REST API Tutorial**
   - https://restfulapi.net/

3. **Docker Tutorial**
   - https://docker-curriculum.com/

4. **MongoDB University**
   - https://university.mongodb.com/

### 11.5 Herramientas

1. **PlantUML**
   - https://plantuml.com/

2. **Postman**
   - https://www.postman.com/

3. **Visual Studio Code**
   - https://code.visualstudio.com/

---

## Anexos

### A. Instalación de Dependencias

Ver `docs/GUIA_EJECUCION.md`

### B. Especificación Completa de API

Ver `docs/ESPECIFICACION_API.md`

### C. Diagramas

Los diagramas en formato PlantUML se encuentran en:
- `docs/diagramas/` - Arquitectura
- `docs/uml/` - Diagramas UML
- `docs/bpmn/` - Diagramas BPMN

Para renderizar los diagramas:
```bash
# Instalar PlantUML
npm install -g node-plantuml

# Generar imágenes
plantuml docs/**/*.puml
```

### D. Variables de Entorno

```env
# Backend .env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb://db:27017/inventory
EXTERNAL_API_URL=https://fakestoreapi.com
SYNC_INTERVAL=*/30 * * * *
```

---

**Documento preparado por:** [Nombres del equipo]  
**Fecha:** Noviembre 2025  
**Versión:** 1.0
