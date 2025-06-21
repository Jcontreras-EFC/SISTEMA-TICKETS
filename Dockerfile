# ========================================
# DOCKERFILE PARA SISTEMA DE TICKETS
# ========================================

# Etapa 1: Construcción del Frontend (React)
FROM node:18-alpine AS frontend-builder

# Establecer directorio de trabajo
WORKDIR /app/frontend

# Copiar archivos de dependencias del frontend
COPY frontend/package*.json ./

# Instalar dependencias del frontend
RUN npm ci --only=production

# Copiar código fuente del frontend
COPY frontend/ ./

# Construir la aplicación React para producción
RUN npm run build

# ========================================
# Etapa 2: Construcción del Backend (Node.js)
FROM node:18-alpine AS backend-builder

# Establecer directorio de trabajo
WORKDIR /app/backend

# Copiar archivos de dependencias del backend
COPY backend/package*.json ./
RUN npm ci || (ls -l /root/.npm/_logs/ && cat /root/.npm/_logs/*.log ; exit 1)

# Instalar dependencias del backend
RUN npm ci
# Copiar código fuente del backend
COPY backend/ ./

# ========================================
# Etapa 3: Imagen final con Nginx y Node.js
FROM nginx:alpine

# Instalar Node.js en la imagen de Nginx
RUN apk add --no-cache nodejs npm

# Crear directorio para la aplicación
WORKDIR /app

# Copiar el backend construido desde la etapa anterior
COPY --from=backend-builder /app/backend ./backend

# Copiar el frontend construido desde la etapa anterior
COPY --from=frontend-builder /app/frontend/build /usr/share/nginx/html

# Copiar configuración de Nginx
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Crear directorio para usuarios y copiar archivos estáticos
RUN mkdir -p /usr/share/nginx/html/Usuarios
COPY frontend/public/Usuarios/ /usr/share/nginx/html/Usuarios/

# Exponer puertos
EXPOSE 80 3001

# Script de inicio que ejecuta tanto Nginx como el backend
COPY scripts/start.sh /start.sh
RUN chmod +x /start.sh
RUN npm ci || (cat /root/.npm/_logs/* && false)

# Comando de inicio
CMD ["/start.sh"] 
