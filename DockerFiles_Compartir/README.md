# 🐳 Sistema de Tickets - Archivos Docker

Te comparto los archivos de configuración Docker para el sistema de tickets.

📁 Contenido:
• Dockerfile (configuración principal)
• docker-compose.yml (orquestación)
• Scripts de inicio
• Configuración de Nginx
• Instrucciones de uso

🚀 Para usar:
1. Descomprime en una carpeta
2. Asegúrate de tener Docker instalado
3. Ejecuta: docker-compose up --build
4. Accede a: http://localhost:80

⚠️ Nota: Necesitas el código fuente completo del proyecto para que funcione.

¿Necesitas ayuda con la instalación?

## 📋 Contenido del paquete

Este paquete contiene todos los archivos necesarios para ejecutar el Sistema de Tickets usando Docker:

- `Dockerfile` - Configuración principal de Docker
- `docker-compose.yml` - Orquestación de servicios
- `.dockerignore` - Archivos a excluir
- `scripts/start.sh` - Script de inicio
- `frontend/nginx.conf` - Configuración de Nginx

## 🚀 Instrucciones de instalación

### 1. Requisitos previos
- Docker Desktop instalado
- Docker Compose instalado

### 2. Preparar el proyecto
```bash
# Crear carpeta del proyecto
mkdir mi-sistema-tickets
cd mi-sistema-tickets

# Copiar estos archivos a la carpeta
# (Los archivos que tienes en este paquete)
```

### 3. Estructura necesaria
```
mi-sistema-tickets/
├── Dockerfile
├── .dockerignore
├── docker-compose.yml
├── scripts/
│   └── start.sh
├── frontend/
│   └── nginx.conf
├── backend/
│   ├── package.json
│   └── index.js
└── frontend/
    ├── package.json
    ├── public/
    └── src/
```

### 4. Ejecutar el sistema
```bash
# Construir y ejecutar
docker-compose up --build

# O en segundo plano
docker-compose up -d --build
```

### 5. Acceder a la aplicación
- 🌐 **Frontend**: http://localhost:80
- 🔧 **Backend API**: http://localhost:3001
- 🗄️ **Base de datos**: localhost:5432

## 🛠️ Comandos útiles

```bash
# Ver logs
docker-compose logs

# Detener servicios
docker-compose down

# Reconstruir sin caché
docker-compose build --no-cache

# Ver estado de contenedores
docker-compose ps
```

## 📞 Soporte

Si tienes problemas:
1. Verifica que Docker esté ejecutándose
2. Revisa los logs con `docker-compose logs`
3. Asegúrate de tener todos los archivos del proyecto original

---
**Nota**: Este paquete solo contiene los archivos de configuración Docker. Necesitas el código fuente completo del proyecto para que funcione. 