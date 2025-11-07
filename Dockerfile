# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar sólo package files e instalar los núcleos de los paquetes (dependencias)
COPY package*.json ./
RUN npm ci --only=production --no-audit --no-fund
RUN npm install --all --no-audit --no-fund
# Copiar el resto de la aplicación (node_modules debe estar en .dockerignore)
COPY . .

# Si hay paso de build, descomentar:
# RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]