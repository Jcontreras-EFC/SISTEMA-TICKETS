# 🚀 Sistema de Tickets - Dockerizado

Sistema completo de gestión de tickets con **Frontend React**, **Backend Node.js** y **Base de datos PostgreSQL**, completamente dockerizado y automatizado.

## 🎯 Características

- ✅ **Frontend**: React con interfaz moderna
- ✅ **Backend**: Node.js + Express + PostgreSQL
- ✅ **Docker**: Configuración completa multi-etapa
- ✅ **Desarrollo**: Hot-reload automático
- ✅ **Producción**: Optimizado y listo para deploy
- ✅ **Base de datos**: PostgreSQL con inicialización automática
- ✅ **Scripts**: Automatización completa para Windows

## ⚡ Inicio Rápido

### **🚀 Opción 1: Script Automático (Recomendado)**

```powershell
# Ejecutar el script de inicio automático
.\iniciar-sistema.ps1
```

### **🔧 Opción 2: Comandos Manuales**

```powershell
# Construir e iniciar producción
docker-compose build --no-cache
docker-compose up -d

# Desarrollo con hot-reload
docker-compose -f docker-compose.dev.yml up --build
```

## 🌐 URLs de Acceso

### **Producción**
- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432

### **Desarrollo**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 👤 Usuario por Defecto

- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Permisos**: `["tickets", "usuarios", "reportes"]`

## 📁 Estructura del Proyecto

```
📦 Sistema de Tickets/
├── 🚀 PRODUCCIÓN
│   ├── docker-compose.yml          # Configuración principal
│   ├── Dockerfile                  # Multi-etapa (Frontend + Backend + Nginx)
│   └── scripts/start.sh           # Script de inicio
│
├── 🔧 DESARROLLO
│   ├── docker-compose.dev.yml      # Configuración de desarrollo
│   ├── Dockerfile.dev             # Backend desarrollo
│   └── frontend/Dockerfile.dev    # Frontend desarrollo
│
├── ⚙️ CONFIGURACIÓN
│   ├── frontend/nginx.conf        # Configuración Nginx
│   ├── init-db.sql               # Script de inicialización DB
│   ├── .dockerignore             # Archivos a ignorar
│   ├── Makefile                  # Comandos para Linux/Mac
│   ├── docker-commands.ps1       # Comandos para Windows
│   └── iniciar-sistema.ps1       # Script de inicio automático
│
├── 📱 FRONTEND
│   ├── src/                      # Código fuente React
│   ├── public/                   # Archivos públicos
│   └── package.json             # Dependencias frontend
│
├── 🔧 BACKEND
│   ├── index.js                 # Servidor Express
│   └── package.json             # Dependencias backend
│
└── 📚 DOCUMENTACIÓN
    ├── README.md                # Este archivo
    └── README-Docker.md         # Documentación Docker detallada
```

## 🛠️ Comandos Útiles

### **Script de Inicio Automático**
```powershell
.\iniciar-sistema.ps1          # Iniciar todo automáticamente
.\iniciar-sistema.ps1 help     # Ver ayuda
.\iniciar-sistema.ps1 status   # Ver estado
.\iniciar-sistema.ps1 stop     # Detener sistema
```

### **Comandos Docker Directos**
```powershell
# Producción
docker-compose up -d           # Iniciar en segundo plano
docker-compose down            # Detener
docker-compose logs -f         # Ver logs
docker-compose ps              # Ver estado

# Desarrollo
docker-compose -f docker-compose.dev.yml up --build
docker-compose -f docker-compose.dev.yml down
```

### **Utilidades**
```powershell
# Acceder a contenedores
docker-compose exec app sh     # Shell de la aplicación
docker-compose exec postgres psql -U postgres -d Tickets  # Base de datos

# Backup y restore
docker-compose exec postgres pg_dump -U postgres Tickets > backup.sql
docker-compose exec -T postgres psql -U postgres -d Tickets < backup.sql
```

## 🔧 Configuración

### **Variables de Entorno**
- `NODE_ENV`: production/development
- `PGHOST`: postgres
- `PGUSER`: postgres
- `PGPASSWORD`: 123456
- `PGDATABASE`: Tickets
- `PGPORT`: 5432

### **Puertos**
- **80**: Frontend (producción)
- **3000**: Frontend (desarrollo)
- **3001**: Backend API
- **5432**: PostgreSQL

## 🎯 Características Técnicas

### **Docker**
- ✅ Multi-etapa builds para optimización
- ✅ Imágenes Alpine para menor tamaño
- ✅ Health checks para monitoreo
- ✅ Volúmenes persistentes
- ✅ Red personalizada

### **Frontend**
- ✅ React 19 con hooks
- ✅ Nginx para servir archivos estáticos
- ✅ Compresión gzip
- ✅ Headers de seguridad
- ✅ Hot-reload en desarrollo

### **Backend**
- ✅ Node.js 18 con Express
- ✅ PostgreSQL con pool de conexiones
- ✅ Multer para subida de archivos
- ✅ ExcelJS para exportación
- ✅ Nodemon para desarrollo

### **Base de Datos**
- ✅ PostgreSQL 15
- ✅ Inicialización automática
- ✅ Índices optimizados
- ✅ Triggers para auditoría
- ✅ Usuario admin por defecto

## 🚀 Despliegue

### **Desarrollo Local**
```powershell
.\iniciar-sistema.ps1
```

### **Producción**
```powershell
docker-compose up -d
```

### **Servidor Remoto**
```bash
# Clonar repositorio
git clone <url-del-repositorio>
cd sistema-tickets

# Construir e iniciar
docker-compose up -d --build
```

## 🔍 Solución de Problemas

### **Docker Desktop no inicia**
```powershell
# Ejecutar como administrador
Start-Process PowerShell -Verb RunAs
.\iniciar-sistema.ps1
```

### **Puertos ocupados**
```powershell
# Ver qué usa los puertos
netstat -ano | findstr :80
netstat -ano | findstr :3001

# Cambiar puertos en docker-compose.yml
```

### **Error de permisos**
```powershell
# Ejecutar PowerShell como administrador
# O configurar Docker Desktop para compartir unidades
```

### **Limpiar todo**
```powershell
docker-compose down -v
docker system prune -a -f
docker volume prune -f
```

## 📊 Monitoreo

### **Logs en tiempo real**
```powershell
docker-compose logs -f
```

### **Uso de recursos**
```powershell
docker stats
```

### **Estado de servicios**
```powershell
docker-compose ps
```

## 🔒 Seguridad

- ✅ Headers de seguridad en Nginx
- ✅ Validación de entrada en backend
- ✅ Autenticación de usuarios
- ✅ Permisos granulares
- ✅ Conexiones seguras a BD

## 📈 Rendimiento

- ✅ Compresión gzip
- ✅ Cache de archivos estáticos
- ✅ Pool de conexiones a BD
- ✅ Índices optimizados
- ✅ Imágenes optimizadas

## 🎉 ¡Listo!

Tu sistema de tickets está completamente dockerizado y listo para usar. Solo ejecuta:

```powershell
.\iniciar-sistema.ps1
```

¡Y disfruta de tu aplicación funcionando automáticamente! 🚀

---

**Desarrollado con ❤️ usando Docker, Node.js, React y PostgreSQL** 