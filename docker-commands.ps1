# ========================================
# SCRIPT POWERSHELL - SISTEMA DE TICKETS
# ========================================
# Comandos útiles para gestionar la aplicación Docker en Windows

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

# Variables
$COMPOSE_PROD = "docker-compose.yml"
$COMPOSE_DEV = "docker-compose.dev.yml"

# Función para mostrar ayuda
function Show-Help {
    Write-Host "🚀 Sistema de Tickets - Comandos disponibles:" -ForegroundColor Green
    Write-Host ""
    Write-Host "📦 PRODUCCIÓN:" -ForegroundColor Yellow
    Write-Host "  .\docker-commands.ps1 build    - Construir imágenes de producción"
    Write-Host "  .\docker-commands.ps1 up       - Iniciar servicios de producción"
    Write-Host "  .\docker-commands.ps1 down     - Detener servicios de producción"
    Write-Host "  .\docker-commands.ps1 restart  - Reiniciar servicios de producción"
    Write-Host ""
    Write-Host "🔧 DESARROLLO:" -ForegroundColor Yellow
    Write-Host "  .\docker-commands.ps1 dev      - Iniciar servicios de desarrollo (hot-reload)"
    Write-Host "  .\docker-commands.ps1 dev-down - Detener servicios de desarrollo"
    Write-Host ""
    Write-Host "📊 MONITOREO:" -ForegroundColor Yellow
    Write-Host "  .\docker-commands.ps1 logs     - Ver logs de producción"
    Write-Host "  .\docker-commands.ps1 status   - Ver estado de contenedores"
    Write-Host ""
    Write-Host "🧹 LIMPIEZA:" -ForegroundColor Yellow
    Write-Host "  .\docker-commands.ps1 clean    - Limpiar contenedores, imágenes y volúmenes"
    Write-Host ""
    Write-Host "🛠️ UTILIDADES:" -ForegroundColor Yellow
    Write-Host "  .\docker-commands.ps1 shell    - Acceder al shell de la aplicación"
    Write-Host "  .\docker-commands.ps1 db-shell - Acceder a la base de datos"
    Write-Host "  .\docker-commands.ps1 backup   - Crear backup de la BD"
    Write-Host ""
    Write-Host "🎯 EJEMPLO DE USO:" -ForegroundColor Cyan
    Write-Host "  .\docker-commands.ps1 build && .\docker-commands.ps1 up"
}

# Función para construir imágenes
function Build-Images {
    Write-Host "🔨 Construyendo imágenes de producción..." -ForegroundColor Green
    docker-compose -f $COMPOSE_PROD build --no-cache
}

# Función para iniciar producción
function Start-Production {
    Write-Host "🚀 Iniciando servicios de producción..." -ForegroundColor Green
    docker-compose -f $COMPOSE_PROD up -d
}

# Función para detener producción
function Stop-Production {
    Write-Host "🛑 Deteniendo servicios de producción..." -ForegroundColor Yellow
    docker-compose -f $COMPOSE_PROD down
}

# Función para reiniciar producción
function Restart-Production {
    Write-Host "🔄 Reiniciando servicios de producción..." -ForegroundColor Green
    docker-compose -f $COMPOSE_PROD restart
}

# Función para iniciar desarrollo
function Start-Development {
    Write-Host "🔧 Iniciando servicios de desarrollo..." -ForegroundColor Green
    docker-compose -f $COMPOSE_DEV up --build
}

# Función para detener desarrollo
function Stop-Development {
    Write-Host "🛑 Deteniendo servicios de desarrollo..." -ForegroundColor Yellow
    docker-compose -f $COMPOSE_DEV down
}

# Función para ver logs
function Show-Logs {
    Write-Host "📊 Mostrando logs de producción..." -ForegroundColor Green
    docker-compose -f $COMPOSE_PROD logs -f
}

# Función para ver logs de desarrollo
function Show-DevLogs {
    Write-Host "📊 Mostrando logs de desarrollo..." -ForegroundColor Green
    docker-compose -f $COMPOSE_DEV logs -f
}

# Función para ver estado
function Show-Status {
    Write-Host "📈 Estado de contenedores de producción:" -ForegroundColor Green
    docker-compose -f $COMPOSE_PROD ps
    Write-Host ""
    Write-Host "📈 Estado de contenedores de desarrollo:" -ForegroundColor Green
    docker-compose -f $COMPOSE_DEV ps
}

# Función para limpiar
function Clean-All {
    Write-Host "🧹 Limpiando contenedores, imágenes y volúmenes..." -ForegroundColor Yellow
    docker-compose -f $COMPOSE_PROD down -v
    docker-compose -f $COMPOSE_DEV down -v
    docker system prune -a -f
    docker volume prune -f
}

# Función para acceder al shell
function Enter-Shell {
    Write-Host "🐚 Accediendo al shell del contenedor de la aplicación..." -ForegroundColor Green
    docker-compose -f $COMPOSE_PROD exec app sh
}

# Función para acceder a la base de datos
function Enter-Database {
    Write-Host "🗄️ Accediendo al shell de la base de datos..." -ForegroundColor Green
    docker-compose -f $COMPOSE_PROD exec postgres psql -U postgres -d Tickets
}

# Función para crear backup
function Create-Backup {
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $filename = "backup_$timestamp.sql"
    Write-Host "💾 Creando backup de la base de datos: $filename" -ForegroundColor Green
    docker-compose -f $COMPOSE_PROD exec postgres pg_dump -U postgres Tickets > $filename
    Write-Host "✅ Backup creado: $filename" -ForegroundColor Green
}

# Función para restaurar backup
function Restore-Backup {
    $filename = Read-Host "Ingrese el nombre del archivo de backup"
    if (Test-Path $filename) {
        Write-Host "📥 Restaurando backup: $filename" -ForegroundColor Green
        Get-Content $filename | docker-compose -f $COMPOSE_PROD exec -T postgres psql -U postgres -d Tickets
        Write-Host "✅ Backup restaurado" -ForegroundColor Green
    } else {
        Write-Host "❌ Archivo no encontrado: $filename" -ForegroundColor Red
    }
}

# Switch principal
switch ($Command.ToLower()) {
    "help" { Show-Help }
    "build" { Build-Images }
    "up" { Start-Production }
    "down" { Stop-Production }
    "restart" { Restart-Production }
    "dev" { Start-Development }
    "dev-down" { Stop-Development }
    "logs" { Show-Logs }
    "dev-logs" { Show-DevLogs }
    "status" { Show-Status }
    "clean" { Clean-All }
    "shell" { Enter-Shell }
    "db-shell" { Enter-Database }
    "backup" { Create-Backup }
    "restore" { Restore-Backup }
    default {
        Write-Host "❌ Comando no reconocido: $Command" -ForegroundColor Red
        Write-Host "Ejecuta .\docker-commands.ps1 help para ver los comandos disponibles" -ForegroundColor Yellow
    }
} 