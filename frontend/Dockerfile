# Construcción de la app
FROM node:18-alpine as build

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Servir la app con nginx
FROM nginx:alpine

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar la aplicación construida
COPY --from=build /app/build /usr/share/nginx/html

# Crear directorio para las imágenes de usuarios
RUN mkdir -p /usr/share/nginx/html/Usuarios

# Exponer puerto 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"] 