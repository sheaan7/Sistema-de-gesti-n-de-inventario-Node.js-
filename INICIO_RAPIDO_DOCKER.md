# 🚀 Inicio Rápido con Docker

## Levantar el proyecto completo en 3 pasos

### Paso 1: Detener los servicios locales actuales

```bash
# Detener backend y frontend que están corriendo localmente
# Presionar Ctrl+C en las terminales donde están corriendo
```

### Paso 2: Construir e iniciar con Docker

```bash
# Desde la raíz del proyecto
docker-compose up --build -d
```

Esto hará:
- ✅ Construir imagen del backend
- ✅ Construir imagen del frontend  
- ✅ Descargar imagen de MongoDB
- ✅ Crear red Docker
- ✅ Crear volúmenes persistentes
- ✅ Iniciar los 3 contenedores

### Paso 3: Verificar que todo está corriendo

```bash
# Ver estado de los contenedores
docker-compose ps

# Deberías ver algo como:
# NAME                 STATUS           PORTS
# inventory-backend    Up (healthy)     0.0.0.0:3000->3000/tcp
# inventory-frontend   Up (healthy)     0.0.0.0:8080->80/tcp
# inventory-db         Up (healthy)     0.0.0.0:27017->27017/tcp
```

---

## 🌐 Acceder a la Aplicación

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3000
- **Health Check:** http://localhost:3000/health
- **Productos:** http://localhost:3000/api/products

---

## 📊 Ver Logs en Tiempo Real

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

---

## 🔧 Comandos Útiles

### Reiniciar un servicio
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Detener todo
```bash
docker-compose down
```

### Detener y limpiar volúmenes (elimina datos)
```bash
docker-compose down -v
```

### Reconstruir sin cache
```bash
docker-compose build --no-cache
docker-compose up -d
```

### Entrar a un contenedor
```bash
# Backend
docker exec -it inventory-backend sh

# Frontend
docker exec -it inventory-frontend sh

# Base de datos
docker exec -it inventory-db mongo
```

---

## 🧪 Probar la API

### Con cURL
```bash
# Health check
curl http://localhost:3000/health

# Listar productos
curl http://localhost:3000/api/products

# Crear producto
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Producto de Prueba",
    "price": 99.99,
    "description": "Este es un producto de prueba",
    "category": "electronics"
  }'

# Buscar productos
curl "http://localhost:3000/api/products/search?q=laptop"

# Estado de sincronización
curl http://localhost:3000/api/sync/status

# Forzar sincronización
curl -X POST http://localhost:3000/api/sync/now
```

### Con el navegador
Abre http://localhost:8080 y usa la interfaz gráfica para:
- Ver todos los productos
- Buscar productos
- Filtrar por categoría
- Agregar nuevo producto
- Editar productos
- Eliminar productos

---

## 🔍 Verificar Health Checks

```bash
# Ver health status de los contenedores
docker ps --format "table {{.Names}}\t{{.Status}}"

# Inspeccionar health check de un contenedor
docker inspect inventory-backend | grep -A 10 Health
```

---

## 📈 Monitorear Recursos

```bash
# Ver uso de CPU, memoria, red
docker stats

# Ver solo contenedores del proyecto
docker stats inventory-backend inventory-frontend inventory-db
```

---

## 🗄️ Gestión de Base de Datos

### Backup de MongoDB
```bash
# Crear backup
docker exec inventory-db mongodump --out /dump

# Copiar backup al host
docker cp inventory-db:/dump ./backup-$(date +%Y%m%d)
```

### Restaurar MongoDB
```bash
# Copiar backup al contenedor
docker cp ./backup-20251111 inventory-db:/restore

# Restaurar
docker exec inventory-db mongorestore /restore
```

### Acceder a MongoDB shell
```bash
docker exec -it inventory-db mongo

# Dentro del shell de Mongo:
show dbs
use inventory
db.products.find().pretty()
db.products.count()
exit
```

---

## 🐛 Solución de Problemas Comunes

### Problema: Puerto ya en uso
```bash
# Verificar qué proceso usa el puerto
netstat -ano | findstr :3000

# Detener el proceso (Windows)
taskkill /PID <PID> /F

# O cambiar el puerto en docker-compose.yml
```

### Problema: Contenedor no inicia
```bash
# Ver logs detallados
docker-compose logs backend

# Reconstruir
docker-compose down
docker-compose build --no-cache backend
docker-compose up backend
```

### Problema: MongoDB no conecta
```bash
# Verificar que MongoDB está corriendo
docker-compose ps db

# Ver logs de MongoDB
docker-compose logs db

# Reiniciar MongoDB
docker-compose restart db
```

### Problema: Frontend no muestra datos
```bash
# Verificar que backend responde
curl http://localhost:3000/api/products

# Ver logs del frontend
docker-compose logs frontend

# Verificar configuración de Nginx
docker exec inventory-frontend cat /etc/nginx/conf.d/default.conf
```

### Problema: Cambios en código no se reflejan
```bash
# Los contenedores usan código compilado
# Necesitas reconstruir:
docker-compose down
docker-compose build
docker-compose up -d
```

---

## 🔄 Workflow de Desarrollo

### Para desarrollo activo

Si estás haciendo cambios frecuentes, mejor usa modo local:
```bash
# Terminal 1: Backend con hot reload
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start
```

### Para testing/producción
```bash
# Usar Docker
docker-compose up -d
```

---

## 🎯 Checklist de Verificación

Después de `docker-compose up`, verifica:

- [ ] `docker-compose ps` muestra 3 contenedores "Up (healthy)"
- [ ] http://localhost:8080 carga la interfaz web
- [ ] http://localhost:3000/health retorna `{"status":"OK"}`
- [ ] http://localhost:3000/api/products retorna array de productos
- [ ] Frontend muestra productos sincronizados de FakeStore API
- [ ] Puedes crear, editar y eliminar productos desde la interfaz
- [ ] La búsqueda funciona correctamente
- [ ] El filtro por categoría funciona
- [ ] Los logs no muestran errores críticos: `docker-compose logs`

---

## 📦 Crear Backup Completo del Proyecto

```bash
# Exportar imágenes Docker
docker save inventory-backend -o backend-image.tar
docker save inventory-frontend -o frontend-image.tar

# Backup de datos
docker exec inventory-db mongodump --out /dump
docker cp inventory-db:/dump ./mongodb-backup

# Comprimir todo
zip -r proyecto-backup.zip \
  backend-image.tar \
  frontend-image.tar \
  mongodb-backup/ \
  docker-compose.yml
```

---

## 🚀 Deploy en Servidor

### Preparar servidor
```bash
# Instalar Docker y Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Copiar proyecto al servidor
```bash
# Comprimir proyecto (excluyendo node_modules)
tar -czf proyecto.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=backend/data \
  .

# Copiar al servidor
scp proyecto.tar.gz user@server:/home/user/

# En el servidor
ssh user@server
cd /home/user
tar -xzf proyecto.tar.gz
docker-compose up -d
```

---

## 📞 Ayuda Adicional

- **Documentación completa:** `docs/GUIA_EJECUCION.md`
- **Especificación de API:** `docs/ESPECIFICACION_API.md`
- **Informe técnico:** `docs/INFORME_TECNICO.md`
- **Resumen de entregables:** `docs/RESUMEN_ENTREGABLES.md`

---

**¡Listo! Tu aplicación de gestión de inventarios está corriendo con Docker! 🎉**
