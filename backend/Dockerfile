# Usa la imagen oficial de Node.js 18
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia package.json y package-lock.json primero
COPY package*.json ./

# Instala las dependencias (mejor práctica: para docker cache)
RUN npm install --production

# Ahora copia el resto del código fuente
COPY . .

# Expone el puerto (ajústalo si usas otro puerto en Express)
EXPOSE 3000

# Comando para arrancar la app (ajusta si el archivo de inicio no es app.js)
CMD ["node", "index.js"]
