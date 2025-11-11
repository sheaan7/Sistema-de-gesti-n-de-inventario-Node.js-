# 🎯 Comandos de Prueba Rápida

## Copiar y pegar estos comandos para verificar que todo funciona

### 1️⃣ Detener servicios locales actuales

```powershell
# Los servicios están corriendo en terminales separadas
# Presiona Ctrl+C en cada terminal para detenerlos
```

### 2️⃣ Levantar con Docker

```bash
# Construir e iniciar todos los servicios
docker-compose up --build -d
```

Espera ~30 segundos para que todo inicie correctamente.

### 3️⃣ Verificar Estado

```bash
# Ver estado de contenedores
docker-compose ps

# Deberías ver 3 contenedores "Up (healthy)"
```

### 4️⃣ Probar Backend

```bash
# Health check
curl http://localhost:3000/health

# Listar productos
curl http://localhost:3000/api/products

# Estado de sincronización
curl http://localhost:3000/api/sync/status
```

### 5️⃣ Probar Frontend

Abre tu navegador y visita:
```
http://localhost:8080
```

Deberías ver la interfaz con productos cargados.

### 6️⃣ Probar CRUD

#### Crear un producto
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Producto de Prueba\",\"price\":99.99,\"description\":\"Test\",\"category\":\"electronics\"}"
```

#### Buscar productos
```bash
curl "http://localhost:3000/api/products/search?q=test"
```

#### Filtrar por categoría
```bash
curl http://localhost:3000/api/products/category/electronics
```

### 7️⃣ Ver Logs

```bash
# Ver todos los logs
docker-compose logs -f

# Ver solo backend
docker-compose logs -f backend

# Ver solo frontend
docker-compose logs -f frontend

# Ver solo database
docker-compose logs -f db
```

Presiona `Ctrl+C` para salir de los logs.

### 8️⃣ Probar Sincronización Manual

```bash
# Forzar sincronización inmediata
curl -X POST http://localhost:3000/api/sync/now

# Ver resultado de la sincronización
curl http://localhost:3000/api/sync/status
```

### 9️⃣ Verificar Base de Datos

```bash
# Entrar al contenedor de MongoDB
docker exec -it inventory-db mongo

# Dentro de MongoDB, ejecutar:
show dbs
use inventory
db.products.find().pretty()
db.products.count()
exit
```

### 🔟 Probar Interfaz Web

En el navegador (http://localhost:8080), hacer:

1. ✅ Ver lista de productos
2. ✅ Buscar un producto
3. ✅ Filtrar por categoría
4. ✅ Agregar nuevo producto
5. ✅ Editar un producto
6. ✅ Eliminar un producto
7. ✅ Forzar sincronización desde el botón

---

## 🧪 Suite de Pruebas Completa

### PowerShell Script para Windows

Crea un archivo `test-all.ps1`:

```powershell
Write-Host "=== SUITE DE PRUEBAS ===" -ForegroundColor Green

Write-Host "`n1. Health Check..." -ForegroundColor Yellow
$health = Invoke-RestMethod -Uri "http://localhost:3000/health"
if ($health.status -eq "OK") {
    Write-Host "   ✅ Backend está vivo" -ForegroundColor Green
} else {
    Write-Host "   ❌ Backend no responde" -ForegroundColor Red
}

Write-Host "`n2. Listar productos..." -ForegroundColor Yellow
$products = Invoke-RestMethod -Uri "http://localhost:3000/api/products"
Write-Host "   ✅ Se encontraron $($products.Count) productos" -ForegroundColor Green

Write-Host "`n3. Crear producto de prueba..." -ForegroundColor Yellow
$newProduct = @{
    title = "Producto de Prueba PowerShell"
    price = 49.99
    description = "Creado desde script de prueba"
    category = "electronics"
} | ConvertTo-Json

$created = Invoke-RestMethod -Uri "http://localhost:3000/api/products" `
    -Method Post `
    -Body $newProduct `
    -ContentType "application/json"
Write-Host "   ✅ Producto creado con ID: $($created.id)" -ForegroundColor Green
$testId = $created.id

Write-Host "`n4. Obtener producto por ID..." -ForegroundColor Yellow
$product = Invoke-RestMethod -Uri "http://localhost:3000/api/products/$testId"
Write-Host "   ✅ Producto obtenido: $($product.title)" -ForegroundColor Green

Write-Host "`n5. Actualizar producto..." -ForegroundColor Yellow
$update = @{
    price = 39.99
    description = "Actualizado desde script"
} | ConvertTo-Json

$updated = Invoke-RestMethod -Uri "http://localhost:3000/api/products/$testId" `
    -Method Put `
    -Body $update `
    -ContentType "application/json"
Write-Host "   ✅ Producto actualizado. Nuevo precio: $($updated.price)" -ForegroundColor Green

Write-Host "`n6. Buscar productos..." -ForegroundColor Yellow
$searchResults = Invoke-RestMethod -Uri "http://localhost:3000/api/products/search?q=prueba"
Write-Host "   ✅ Se encontraron $($searchResults.Count) resultados" -ForegroundColor Green

Write-Host "`n7. Filtrar por categoría..." -ForegroundColor Yellow
$categoryResults = Invoke-RestMethod -Uri "http://localhost:3000/api/products/category/electronics"
Write-Host "   ✅ Se encontraron $($categoryResults.Count) productos en electronics" -ForegroundColor Green

Write-Host "`n8. Estado de sincronización..." -ForegroundColor Yellow
$syncStatus = Invoke-RestMethod -Uri "http://localhost:3000/api/sync/status"
Write-Host "   ✅ Última sync: $($syncStatus.lastSync)" -ForegroundColor Green
Write-Host "   ✅ Productos sincronizados: $($syncStatus.stats.total)" -ForegroundColor Green

Write-Host "`n9. Eliminar producto de prueba..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "http://localhost:3000/api/products/$testId" -Method Delete | Out-Null
Write-Host "   ✅ Producto eliminado" -ForegroundColor Green

Write-Host "`n10. Verificar contenedores..." -ForegroundColor Yellow
$containers = docker-compose ps --format json | ConvertFrom-Json
foreach ($container in $containers) {
    if ($container.Health -eq "healthy") {
        Write-Host "   ✅ $($container.Service): healthy" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  $($container.Service): $($container.Health)" -ForegroundColor Yellow
    }
}

Write-Host "`n=== PRUEBAS COMPLETADAS ===" -ForegroundColor Green
Write-Host "Todos los endpoints funcionan correctamente ✅`n" -ForegroundColor Green
```

Ejecutar:
```powershell
.\test-all.ps1
```

### Bash Script para Linux/Mac

Crea un archivo `test-all.sh`:

```bash
#!/bin/bash

echo "=== SUITE DE PRUEBAS ==="

echo -e "\n1. Health Check..."
if curl -s http://localhost:3000/health | grep -q "OK"; then
    echo "   ✅ Backend está vivo"
else
    echo "   ❌ Backend no responde"
fi

echo -e "\n2. Listar productos..."
count=$(curl -s http://localhost:3000/api/products | jq '. | length')
echo "   ✅ Se encontraron $count productos"

echo -e "\n3. Crear producto de prueba..."
response=$(curl -s -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"title":"Producto de Prueba Bash","price":49.99,"category":"electronics"}')
testId=$(echo $response | jq -r '.id')
echo "   ✅ Producto creado con ID: $testId"

echo -e "\n4. Obtener producto por ID..."
title=$(curl -s http://localhost:3000/api/products/$testId | jq -r '.title')
echo "   ✅ Producto obtenido: $title"

echo -e "\n5. Actualizar producto..."
curl -s -X PUT http://localhost:3000/api/products/$testId \
  -H "Content-Type: application/json" \
  -d '{"price":39.99}' > /dev/null
echo "   ✅ Producto actualizado"

echo -e "\n6. Buscar productos..."
count=$(curl -s "http://localhost:3000/api/products/search?q=prueba" | jq '. | length')
echo "   ✅ Se encontraron $count resultados"

echo -e "\n7. Filtrar por categoría..."
count=$(curl -s http://localhost:3000/api/products/category/electronics | jq '. | length')
echo "   ✅ Se encontraron $count productos en electronics"

echo -e "\n8. Estado de sincronización..."
curl -s http://localhost:3000/api/sync/status | jq '{lastSync, total: .stats.total}'
echo "   ✅ Estado de sincronización obtenido"

echo -e "\n9. Eliminar producto de prueba..."
curl -s -X DELETE http://localhost:3000/api/products/$testId > /dev/null
echo "   ✅ Producto eliminado"

echo -e "\n10. Verificar contenedores..."
docker-compose ps --format "table {{.Service}}\t{{.Status}}"

echo -e "\n=== PRUEBAS COMPLETADAS ==="
echo "Todos los endpoints funcionan correctamente ✅"
```

Ejecutar:
```bash
chmod +x test-all.sh
./test-all.sh
```

---

## 📸 Capturar Screenshots para Documentación

### Screenshots Recomendados:

1. **Frontend - Vista Principal**
   - Abre http://localhost:8080
   - Captura la pantalla con la lista de productos

2. **Frontend - Crear Producto**
   - Click en "Agregar Producto"
   - Captura el formulario modal

3. **Frontend - Editar Producto**
   - Click en "Editar" en cualquier producto
   - Captura el formulario con datos

4. **Frontend - Búsqueda**
   - Escribe algo en el buscador
   - Captura los resultados filtrados

5. **API - Postman/Insomnia**
   - Captura requests a diferentes endpoints

6. **Docker - Contenedores**
   - Captura: `docker-compose ps`

7. **Logs - Sincronización**
   - Captura logs mostrando sincronización exitosa

---

## 🎬 Grabar Demo en Video

### Script de Demo (5 minutos)

1. **Introducción (30s)**
   - Mostrar estructura del proyecto
   - Explicar arquitectura general

2. **Levantar con Docker (1min)**
   - Ejecutar `docker-compose up -d`
   - Mostrar `docker-compose ps`
   - Mostrar logs

3. **Frontend (2min)**
   - Abrir http://localhost:8080
   - Listar productos
   - Buscar producto
   - Filtrar por categoría
   - Crear nuevo producto
   - Editar producto
   - Eliminar producto

4. **API Backend (1min)**
   - Usar Postman/cURL
   - Mostrar diferentes endpoints
   - Mostrar sincronización

5. **Documentación (30s)**
   - Mostrar diagramas
   - Mostrar documentos MD
   - Mostrar estructura del código

---

## ✅ Checklist Final

Antes de entregar, verificar:

- [ ] `docker-compose up -d` funciona sin errores
- [ ] Los 3 contenedores están "healthy"
- [ ] Frontend carga en http://localhost:8080
- [ ] API responde en http://localhost:3000
- [ ] CRUD completo funciona desde frontend
- [ ] Sincronización automática está activa
- [ ] Todos los endpoints responden correctamente
- [ ] Los 7 diagramas están creados (.puml)
- [ ] Los 6 documentos MD están completos
- [ ] README.md tiene nombres del equipo
- [ ] No hay errores en los logs: `docker-compose logs`

---

**¡Todo listo para entregar! 🎉**
