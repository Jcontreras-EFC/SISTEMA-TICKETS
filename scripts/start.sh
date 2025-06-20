#!/bin/sh

# ========================================
# SCRIPT DE INICIO PARA SISTEMA DE TICKETS
# ========================================

echo "🚀 Iniciando Sistema de Tickets..."

# Función para manejar la terminación del script
cleanup() {
    echo "🛑 Deteniendo servicios..."
    kill $NGINX_PID $NODE_PID 2>/dev/null
    exit 0
}

# Configurar trap para manejar señales de terminación
trap cleanup SIGTERM SIGINT

# Iniciar Nginx en segundo plano
echo "📡 Iniciando Nginx..."
nginx -g "daemon off;" &
NGINX_PID=$!

# Esperar un momento para que Nginx se inicie
sleep 2

# Cambiar al directorio del backend
cd /app/backend

# Iniciar el servidor Node.js
echo "⚙️  Iniciando servidor backend..."
node index.js &
NODE_PID=$!

echo "✅ Sistema iniciado correctamente!"
echo "🌐 Frontend disponible en: http://localhost:80"
echo "🔧 Backend disponible en: http://localhost:3001"

# Esperar a que cualquiera de los procesos termine
wait $NGINX_PID $NODE_PID 