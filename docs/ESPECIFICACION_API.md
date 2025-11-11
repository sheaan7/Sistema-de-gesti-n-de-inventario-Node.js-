# Especificación de API REST - Sistema de Gestión de Inventario

## Información General

- **Base URL**: `http://localhost:3000`
- **Versión**: 1.0.0
- **Formato**: JSON
- **Autenticación**: No requerida (versión actual)

---

## Endpoints

### 1. Health Check

#### GET /health

Verificar estado del servidor.

**Request:**
```http
GET /health HTTP/1.1
Host: localhost:3000
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-11-11T05:00:00.000Z"
}
```

**Códigos de Estado:**
- `200 OK`: Servidor funcionando correctamente

---

## Gestión de Productos

### 2. Listar Todos los Productos

#### GET /api/products

Obtener listado completo de productos en el inventario.

**Request:**
```http
GET /api/products HTTP/1.1
Host: localhost:3000
```

**Response:**
```json
[
  {
    "id": "1",
    "title": "Laptop HP",
    "price": 599.99,
    "description": "Laptop para trabajo y estudio",
    "category": "electronics",
    "image": "https://example.com/laptop.jpg",
    "rating": {
      "rate": 4.5,
      "count": 120
    },
    "createdAt": "2025-11-10T10:00:00.000Z",
    "updatedAt": "2025-11-10T10:00:00.000Z"
  },
  {
    "id": "2",
    "title": "Mouse Inalámbrico",
    "price": 25.99,
    "description": "Mouse ergonómico inalámbrico",
    "category": "electronics",
    "image": "https://example.com/mouse.jpg",
    "rating": {
      "rate": 4.2,
      "count": 85
    },
    "createdAt": "2025-11-10T11:00:00.000Z",
    "updatedAt": "2025-11-10T11:00:00.000Z"
  }
]
```

**Códigos de Estado:**
- `200 OK`: Listado exitoso
- `500 Internal Server Error`: Error en el servidor

---

### 3. Obtener Producto por ID

#### GET /api/products/:id

Obtener detalles de un producto específico.

**Parámetros de URL:**
- `id` (string, requerido): ID del producto

**Request:**
```http
GET /api/products/1 HTTP/1.1
Host: localhost:3000
```

**Response:**
```json
{
  "id": "1",
  "title": "Laptop HP",
  "price": 599.99,
  "description": "Laptop para trabajo y estudio",
  "category": "electronics",
  "image": "https://example.com/laptop.jpg",
  "rating": {
    "rate": 4.5,
    "count": 120
  },
  "createdAt": "2025-11-10T10:00:00.000Z",
  "updatedAt": "2025-11-10T10:00:00.000Z"
}
```

**Códigos de Estado:**
- `200 OK`: Producto encontrado
- `404 Not Found`: Producto no existe
- `500 Internal Server Error`: Error en el servidor

**Error Response:**
```json
{
  "error": "Producto no encontrado"
}
```

---

### 4. Crear Nuevo Producto

#### POST /api/products

Crear un nuevo producto en el inventario.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Teclado Mecánico",
  "price": 89.99,
  "description": "Teclado mecánico RGB para gaming",
  "category": "electronics",
  "image": "https://example.com/keyboard.jpg"
}
```

**Campos:**
- `title` (string, requerido): Nombre del producto
- `price` (number, requerido): Precio del producto
- `description` (string, opcional): Descripción detallada
- `category` (string, opcional): Categoría del producto
- `image` (string, opcional): URL de la imagen
- `rating` (object, opcional): Objeto con rate y count

**Request:**
```http
POST /api/products HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "title": "Teclado Mecánico",
  "price": 89.99,
  "description": "Teclado mecánico RGB para gaming",
  "category": "electronics",
  "image": "https://example.com/keyboard.jpg"
}
```

**Response:**
```json
{
  "id": "1731299400123abc",
  "title": "Teclado Mecánico",
  "price": 89.99,
  "description": "Teclado mecánico RGB para gaming",
  "category": "electronics",
  "image": "https://example.com/keyboard.jpg",
  "createdAt": "2025-11-11T05:10:00.000Z",
  "updatedAt": "2025-11-11T05:10:00.000Z"
}
```

**Códigos de Estado:**
- `201 Created`: Producto creado exitosamente
- `400 Bad Request`: Datos inválidos
- `500 Internal Server Error`: Error en el servidor

**Error Response:**
```json
{
  "error": "Datos inválidos",
  "details": ["El campo title es requerido", "El precio debe ser mayor a 0"]
}
```

---

### 5. Actualizar Producto

#### PUT /api/products/:id

Actualizar información de un producto existente.

**Parámetros de URL:**
- `id` (string, requerido): ID del producto

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "price": 79.99,
  "description": "Teclado mecánico RGB para gaming - OFERTA"
}
```

**Campos (todos opcionales):**
- `title` (string): Nombre del producto
- `price` (number): Precio del producto
- `description` (string): Descripción detallada
- `category` (string): Categoría del producto
- `image` (string): URL de la imagen
- `rating` (object): Objeto con rate y count

**Request:**
```http
PUT /api/products/1731299400123abc HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "price": 79.99,
  "description": "Teclado mecánico RGB para gaming - OFERTA"
}
```

**Response:**
```json
{
  "id": "1731299400123abc",
  "title": "Teclado Mecánico",
  "price": 79.99,
  "description": "Teclado mecánico RGB para gaming - OFERTA",
  "category": "electronics",
  "image": "https://example.com/keyboard.jpg",
  "createdAt": "2025-11-11T05:10:00.000Z",
  "updatedAt": "2025-11-11T05:15:00.000Z"
}
```

**Códigos de Estado:**
- `200 OK`: Producto actualizado exitosamente
- `404 Not Found`: Producto no existe
- `400 Bad Request`: Datos inválidos
- `500 Internal Server Error`: Error en el servidor

---

### 6. Eliminar Producto

#### DELETE /api/products/:id

Eliminar un producto del inventario.

**Parámetros de URL:**
- `id` (string, requerido): ID del producto

**Request:**
```http
DELETE /api/products/1731299400123abc HTTP/1.1
Host: localhost:3000
```

**Response:**
```json
{
  "message": "Producto eliminado exitosamente"
}
```

**Códigos de Estado:**
- `200 OK`: Producto eliminado exitosamente
- `404 Not Found`: Producto no existe
- `500 Internal Server Error`: Error en el servidor

---

### 7. Buscar Productos

#### GET /api/products/search

Buscar productos por término de búsqueda.

**Query Parameters:**
- `q` (string, requerido): Término de búsqueda

**Request:**
```http
GET /api/products/search?q=laptop HTTP/1.1
Host: localhost:3000
```

**Response:**
```json
[
  {
    "id": "1",
    "title": "Laptop HP",
    "price": 599.99,
    "description": "Laptop para trabajo y estudio",
    "category": "electronics",
    "image": "https://example.com/laptop.jpg",
    "rating": {
      "rate": 4.5,
      "count": 120
    },
    "createdAt": "2025-11-10T10:00:00.000Z",
    "updatedAt": "2025-11-10T10:00:00.000Z"
  }
]
```

**Códigos de Estado:**
- `200 OK`: Búsqueda exitosa (puede retornar array vacío)
- `400 Bad Request`: Parámetro de búsqueda faltante
- `500 Internal Server Error`: Error en el servidor

---

### 8. Filtrar por Categoría

#### GET /api/products/category/:category

Obtener productos de una categoría específica.

**Parámetros de URL:**
- `category` (string, requerido): Nombre de la categoría

**Categorías disponibles:**
- electronics
- jewelery
- men's clothing
- women's clothing

**Request:**
```http
GET /api/products/category/electronics HTTP/1.1
Host: localhost:3000
```

**Response:**
```json
[
  {
    "id": "1",
    "title": "Laptop HP",
    "price": 599.99,
    "category": "electronics",
    "image": "https://example.com/laptop.jpg",
    "rating": {
      "rate": 4.5,
      "count": 120
    }
  },
  {
    "id": "2",
    "title": "Mouse Inalámbrico",
    "price": 25.99,
    "category": "electronics",
    "image": "https://example.com/mouse.jpg",
    "rating": {
      "rate": 4.2,
      "count": 85
    }
  }
]
```

**Códigos de Estado:**
- `200 OK`: Filtrado exitoso
- `500 Internal Server Error`: Error en el servidor

---

## Sincronización

### 9. Estado de Sincronización

#### GET /api/sync/status

Obtener información sobre el estado de la sincronización con la API externa.

**Request:**
```http
GET /api/sync/status HTTP/1.1
Host: localhost:3000
```

**Response:**
```json
{
  "isRunning": false,
  "lastSync": "2025-11-11T05:00:00.000Z",
  "nextSync": "2025-11-11T05:30:00.000Z",
  "stats": {
    "total": 20,
    "added": 15,
    "updated": 5,
    "errors": 0
  },
  "schedule": "*/30 * * * *"
}
```

**Campos:**
- `isRunning` (boolean): Si hay una sincronización en progreso
- `lastSync` (string): Timestamp de la última sincronización
- `nextSync` (string): Timestamp de la próxima sincronización
- `stats` (object): Estadísticas de la última sincronización
- `schedule` (string): Patrón cron de sincronización

**Códigos de Estado:**
- `200 OK`: Estado obtenido exitosamente
- `500 Internal Server Error`: Error en el servidor

---

### 10. Sincronizar Ahora

#### POST /api/sync/now

Ejecutar sincronización inmediata con la API externa.

**Request:**
```http
POST /api/sync/now HTTP/1.1
Host: localhost:3000
```

**Response:**
```json
{
  "message": "Sincronización completada",
  "duration": "1.23s",
  "stats": {
    "total": 20,
    "added": 3,
    "updated": 17,
    "errors": 0
  }
}
```

**Códigos de Estado:**
- `200 OK`: Sincronización exitosa
- `409 Conflict`: Ya hay una sincronización en progreso
- `500 Internal Server Error`: Error en el servidor

**Error Response (sincronización en progreso):**
```json
{
  "error": "Ya hay una sincronización en progreso"
}
```

---

## Modelos de Datos

### Producto

```typescript
{
  id: string;              // ID único del producto
  title: string;           // Nombre del producto
  price: number;           // Precio en USD
  description?: string;    // Descripción detallada
  category?: string;       // Categoría del producto
  image?: string;          // URL de la imagen
  rating?: {
    rate: number;          // Calificación (0-5)
    count: number;         // Número de calificaciones
  };
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

---

## Códigos de Error Comunes

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Datos inválidos |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Conflicto (ej: sincronización en progreso) |
| 500 | Internal Server Error - Error del servidor |

---

## Ejemplos de Uso

### Ejemplo con cURL

```bash
# Listar productos
curl http://localhost:3000/api/products

# Crear producto
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nuevo Producto",
    "price": 49.99,
    "category": "electronics"
  }'

# Actualizar producto
curl -X PUT http://localhost:3000/api/products/123 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 39.99
  }'

# Eliminar producto
curl -X DELETE http://localhost:3000/api/products/123

# Buscar productos
curl "http://localhost:3000/api/products/search?q=laptop"

# Sincronizar ahora
curl -X POST http://localhost:3000/api/sync/now
```

### Ejemplo con JavaScript (Fetch)

```javascript
// Listar productos
fetch('http://localhost:3000/api/products')
  .then(res => res.json())
  .then(products => console.log(products));

// Crear producto
fetch('http://localhost:3000/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Nuevo Producto',
    price: 49.99,
    category: 'electronics'
  })
})
  .then(res => res.json())
  .then(product => console.log(product));

// Actualizar producto
fetch('http://localhost:3000/api/products/123', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    price: 39.99
  })
})
  .then(res => res.json())
  .then(product => console.log(product));
```

---

## Notas Adicionales

1. **Formato de Fecha**: Todas las fechas están en formato ISO 8601
2. **Codificación**: UTF-8
3. **CORS**: Habilitado para todos los orígenes en desarrollo
4. **Rate Limiting**: No implementado en versión actual
5. **Paginación**: No implementada en versión actual
6. **API Externa**: FakeStore API (https://fakestoreapi.com)
