# 🚀 Sistema de Tickets - Docker

Este documento explica cómo ejecutar el sistema de tickets usando Docker de forma completamente automática.

## 📋 Requisitos Previos

- Docker Desktop instalado
- Docker Compose instalado
- Al menos 4GB de RAM disponible

## ⚡ Configuración Automática

### 🎯 **Opción 1: Usando Makefile (Recomendado)**

```bash
# Ver todos los comandos disponibles
make help

# 🚀 INICIAR PRODUCCIÓN (Todo automático)
make build && make up

# 🔧 INICIAR DESARROLLO (Hot-reload)
make dev
```

### 🎯 **Opción 2: Comandos Docker Directos**

```bash
# 🚀 PRODUCCIÓN
docker-compose up --build -d

# 🔧 DESARROLLO
docker-compose -f docker-compose.dev.yml up --build
```

## 🏗️ Arquitectura del Sistema

### **📦 Servicios de Producción**
- **`app`**: Aplicación completa (Frontend + Backend + Nginx)
- **`postgres`**: Base de datos PostgreSQL

### **🔧 Servicios de Desarrollo**
- **`frontend`**: React con hot-reload
- **`backend`**: Node.js con nodemon
- **`postgres`**: Base de datos PostgreSQL

## 🌐 URLs de Acceso

### **Producción**
- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432

### **Desarrollo**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432

## 📚 Comandos del Makefile

### **🚀 Producción**
```bash
make build    # Construir imágenes
make up       # Iniciar servicios
make down     # Detener servicios
make restart  # Reiniciar servicios
```

### **🔧 Desarrollo**
```bash
make dev      # Iniciar desarrollo (hot-reload)
make dev-down # Detener desarrollo
```

### **📊 Monitoreo**
```bash
make logs     # Ver logs de producción
make dev-logs # Ver logs de desarrollo
make status   # Ver estado de contenedores
```

### **🧹 Limpieza**
```bash
make clean    # Limpiar todo (contenedores, imágenes, volúmenes)
```

### **🛠️ Utilidades**
```bash
make shell    # Acceder al shell de la aplicación
make db-shell # Acceder a la base de datos
make backup   # Crear backup de la BD
make restore  # Restaurar backup de la BD
```

## 🔧 Configuración Automática

### **Base de Datos**
- **Usuario**: postgres
- **Contraseña**: 123456
- **Base de datos**: Tickets
- **Inicialización automática**: Sí (tablas y usuario admin)

### **Usuario por Defecto**
- **Usuario**: admin
- **Contraseña**: admin123
- **Permisos**: ["tickets", "usuarios", "reportes"]

## 📁 Estructura de Archivos

```
├── 📦 PRODUCCIÓN
│   ├── docker-compose.yml      # Configuración principal
│   ├── Dockerfile              # Multi-etapa (Frontend + Backend + Nginx)
│   └── scripts/start.sh        # Script de inicio
│
├── 🔧 DESARROLLO
│   ├── docker-compose.dev.yml  # Configuración de desarrollo
│   ├── Dockerfile.dev          # Backend desarrollo
│   └── frontend/Dockerfile.dev # Frontend desarrollo
│
├── ⚙️ CONFIGURACIÓN
│   ├── frontend/nginx.conf     # Configuración Nginx
│   ├── init-db.sql            # Script de inicialización DB
│   ├── .dockerignore          # Archivos a ignorar
│   └── Makefile               # Comandos automatizados
│
└── 📚 DOCUMENTACIÓN
    └── README-Docker.md        # Este archivo
```

## 🚀 Inicio Rápido

### **1. Primera vez**
```bash
# Construir e iniciar todo automáticamente
make build && make up

# Verificar que todo esté funcionando
make status
```

### **2. Desarrollo diario**
```bash
# Iniciar modo desarrollo
make dev

# En otra terminal, ver logs
make dev-logs
```

### **3. Producción**
```bash
# Detener desarrollo
make dev-down

# Iniciar producción
make up
```

## 🔍 Solución de Problemas

### **Error de puertos ocupados**
```bash
# Ver qué está usando los puertos
netstat -ano | findstr :80
netstat -ano | findstr :3001

# Detener servicios que usen esos puertos
# O cambiar puertos en docker-compose.yml
```

### **Error de permisos en Windows**
```bash
# Ejecutar PowerShell como administrador
# O configurar Docker Desktop para compartir unidades
```

### **Limpiar todo y empezar de nuevo**
```bash
make clean
make build && make up
```

### **Ver logs detallados**
```bash
# Producción
make logs

# Desarrollo
make dev-logs

# Servicio específico
docker-compose logs -f app
```

## 🔧 Variables de Entorno

### **Backend**
- `NODE_ENV`: production/development
- `PGHOST`: postgres
- `PGUSER`: postgres
- `PGPASSWORD`: 123456
- `PGDATABASE`: Tickets
- `PGPORT`: 5432

### **Frontend**
- `REACT_APP_API_URL`: http://localhost:3001

## 📊 Monitoreo y Mantenimiento

### **Ver uso de recursos**
```bash
docker stats
```

### **Backup automático**
```bash
make backup
```

### **Restaurar backup**
```bash
make restore
```

### **Acceder a la base de datos**
```bash
make db-shell
```

## 🎯 Características Implementadas

✅ **Multi-etapa builds** para optimización  
✅ **Hot-reload** en desarrollo  
✅ **Base de datos PostgreSQL** con inicialización automática  
✅ **Nginx** configurado para React  
✅ **Volúmenes persistentes** para datos  
✅ **Red personalizada** entre servicios  
✅ **Usuario administrador** creado automáticamente  
✅ **Optimización de imágenes** con Alpine  
✅ **Headers de seguridad** en Nginx  
✅ **Compresión gzip** habilitada  
✅ **Health checks** para monitoreo  
✅ **Scripts automatizados** con Makefile  
✅ **Backup y restore** de base de datos  

## 🎉 ¡Listo!

Tu sistema de tickets está completamente dockerizado y listo para usar. Solo ejecuta:

```bash
make build && make up
```

¡Y disfruta de tu aplicación funcionando automáticamente! 🚀 