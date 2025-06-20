# ========================================
# SCRIPT DE INICIO COMPLETO - SISTEMA DE TICKETS
# ========================================
# Este script verifica Docker Desktop y ejecuta todo automáticamente

Write-Host "🚀 INICIANDO SISTEMA DE TICKETS AUTOMÁTICAMENTE..." -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Función para verificar si Docker Desktop está ejecutándose
function Test-DockerDesktop {
    try {
        docker ps > $null 2>&1
        return $true
    } catch {
        return $false
    }
}

# Función para iniciar Docker Desktop
function Start-DockerDesktop {
    Write-Host "🔧 Iniciando Docker Desktop..." -ForegroundColor Yellow
    
    # Intentar iniciar Docker Desktop
    try {
        Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe" -WindowStyle Minimized
        Write-Host "✅ Docker Desktop iniciado" -ForegroundColor Green
    } catch {
        Write-Host "❌ No se pudo iniciar Docker Desktop automáticamente" -ForegroundColor Red
        Write-Host "   Por favor, inicia Docker Desktop manualmente y ejecuta este script nuevamente" -ForegroundColor Yellow
        return $false
    }
    
    # Esperar a que Docker Desktop esté listo
    Write-Host "⏳ Esperando a que Docker Desktop esté listo..." -ForegroundColor Yellow
    $attempts = 0
    $maxAttempts = 30
    
    while ($attempts -lt $maxAttempts) {
        if (Test-DockerDesktop) {
            Write-Host "✅ Docker Desktop está listo!" -ForegroundColor Green
            return $true
        }
        
        $attempts++
        Write-Host "   Intento $attempts/$maxAttempts..." -ForegroundColor Gray
        Start-Sleep -Seconds 2
    }
    
    Write-Host "❌ Docker Desktop no se pudo iniciar en el tiempo esperado" -ForegroundColor Red
    return $false
}

# Función para construir e iniciar el sistema
function Start-System {
    Write-Host "🔨 Construyendo imágenes..." -ForegroundColor Green
    docker-compose build --no-cache
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Imágenes construidas correctamente" -ForegroundColor Green
        
        Write-Host "🚀 Iniciando servicios..." -ForegroundColor Green
        docker-compose up -d
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Servicios iniciados correctamente" -ForegroundColor Green
            
            # Esperar un momento para que los servicios estén listos
            Start-Sleep -Seconds 5
            
            Write-Host "📊 Verificando estado de los servicios..." -ForegroundColor Green
            docker-compose ps
            
            Write-Host ""
            Write-Host "🎉 ¡SISTEMA INICIADO EXITOSAMENTE!" -ForegroundColor Green
            Write-Host "==================================================" -ForegroundColor Green
            Write-Host "📱 Frontend: http://localhost:80" -ForegroundColor Cyan
            Write-Host "🔧 Backend API: http://localhost:3001" -ForegroundColor Cyan
            Write-Host "🗄️ Base de datos: localhost:5432" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "👤 Usuario por defecto:" -ForegroundColor Yellow
            Write-Host "   Usuario: admin" -ForegroundColor White
            Write-Host "   Contraseña: admin123" -ForegroundColor White
            Write-Host ""
            Write-Host "📚 Comandos útiles:" -ForegroundColor Yellow
            Write-Host "   Ver logs: docker-compose logs -f" -ForegroundColor White
            Write-Host "   Detener: docker-compose down" -ForegroundColor White
            Write-Host "   Estado: docker-compose ps" -ForegroundColor White
            Write-Host ""
            Write-Host "🔧 Para desarrollo con hot-reload:" -ForegroundColor Yellow
            Write-Host "   docker-compose -f docker-compose.dev.yml up --build" -ForegroundColor White
            
        } else {
            Write-Host "❌ Error al iniciar servicios" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Error al construir imágenes" -ForegroundColor Red
    }
}

# Función para mostrar ayuda
function Show-Help {
    Write-Host "🚀 SISTEMA DE TICKETS - SCRIPT DE INICIO" -ForegroundColor Green
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Este script automatiza completamente el inicio del sistema:" -ForegroundColor White
    Write-Host ""
    Write-Host "1. ✅ Verifica que Docker Desktop esté ejecutándose" -ForegroundColor Green
    Write-Host "2. 🔨 Construye las imágenes Docker" -ForegroundColor Green
    Write-Host "3. 🚀 Inicia todos los servicios" -ForegroundColor Green
    Write-Host "4. 📊 Verifica que todo esté funcionando" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 REQUISITOS:" -ForegroundColor Yellow
    Write-Host "   - Docker Desktop instalado" -ForegroundColor White
    Write-Host "   - Al menos 4GB de RAM disponible" -ForegroundColor White
    Write-Host ""
    Write-Host "🎯 USO:" -ForegroundColor Yellow
    Write-Host "   .\iniciar-sistema.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 COMANDOS ADICIONALES:" -ForegroundColor Yellow
    Write-Host "   .\iniciar-sistema.ps1 help    - Mostrar esta ayuda" -ForegroundColor White
    Write-Host "   .\iniciar-sistema.ps1 status - Ver estado actual" -ForegroundColor White
    Write-Host "   .\iniciar-sistema.ps1 stop   - Detener sistema" -ForegroundColor White
}

# Función para mostrar estado
function Show-Status {
    if (Test-DockerDesktop) {
        Write-Host "✅ Docker Desktop está ejecutándose" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Estado de contenedores:" -ForegroundColor Yellow
        docker-compose ps
    } else {
        Write-Host "❌ Docker Desktop no está ejecutándose" -ForegroundColor Red
        Write-Host "   Ejecuta este script para iniciarlo automáticamente" -ForegroundColor Yellow
    }
}

# Función para detener sistema
function Stop-System {
    Write-Host "🛑 Deteniendo sistema..." -ForegroundColor Yellow
    docker-compose down
    Write-Host "✅ Sistema detenido" -ForegroundColor Green
}

# Verificar argumentos
if ($args.Count -gt 0) {
    switch ($args[0].ToLower()) {
        "help" { Show-Help; exit }
        "status" { Show-Status; exit }
        "stop" { Stop-System; exit }
        default {
            Write-Host "❌ Argumento no reconocido: $($args[0])" -ForegroundColor Red
            Write-Host "   Ejecuta .\iniciar-sistema.ps1 help para ver las opciones" -ForegroundColor Yellow
            exit
        }
    }
}

# Verificar si Docker Desktop está ejecutándose
Write-Host "🔍 Verificando Docker Desktop..." -ForegroundColor Yellow

if (Test-DockerDesktop) {
    Write-Host "✅ Docker Desktop está ejecutándose" -ForegroundColor Green
    Start-System
} else {
    Write-Host "❌ Docker Desktop no está ejecutándose" -ForegroundColor Red
    
    $response = Read-Host "¿Deseas que inicie Docker Desktop automáticamente? (s/n)"
    
    if ($response -eq "s" -or $response -eq "S" -or $response -eq "si" -or $response -eq "SI") {
        if (Start-DockerDesktop) {
            Start-System
        } else {
            Write-Host ""
            Write-Host "💡 SOLUCIÓN MANUAL:" -ForegroundColor Yellow
            Write-Host "1. Abre Docker Desktop manualmente" -ForegroundColor White
            Write-Host "2. Espera a que esté completamente iniciado" -ForegroundColor White
            Write-Host "3. Ejecuta este script nuevamente" -ForegroundColor White
        }
    } else {
        Write-Host ""
        Write-Host "💡 Para continuar:" -ForegroundColor Yellow
        Write-Host "1. Inicia Docker Desktop manualmente" -ForegroundColor White
        Write-Host "2. Ejecuta este script nuevamente" -ForegroundColor White
    }
} 