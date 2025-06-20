# ========================================
# MAKEFILE - SISTEMA DE TICKETS
# ========================================
# Comandos útiles para gestionar la aplicación Docker

.PHONY: help build up down dev logs clean restart status

# Variables
COMPOSE_PROD = docker-compose.yml
COMPOSE_DEV = docker-compose.dev.yml

# Comando por defecto
help:
	@echo "🚀 Sistema de Tickets - Comandos disponibles:"
	@echo ""
	@echo "📦 PRODUCCIÓN:"
	@echo "  make build    - Construir imágenes de producción"
	@echo "  make up       - Iniciar servicios de producción"
	@echo "  make down     - Detener servicios de producción"
	@echo "  make restart  - Reiniciar servicios de producción"
	@echo ""
	@echo "🔧 DESARROLLO:"
	@echo "  make dev      - Iniciar servicios de desarrollo (hot-reload)"
	@echo "  make dev-down - Detener servicios de desarrollo"
	@echo ""
	@echo "📊 MONITOREO:"
	@echo "  make logs     - Ver logs de producción"
	@echo "  make status   - Ver estado de contenedores"
	@echo ""
	@echo "🧹 LIMPIEZA:"
	@echo "  make clean    - Limpiar contenedores, imágenes y volúmenes"
	@echo ""

# ========================================
# PRODUCCIÓN
# ========================================

build:
	@echo "🔨 Construyendo imágenes de producción..."
	docker-compose -f $(COMPOSE_PROD) build --no-cache

up:
	@echo "🚀 Iniciando servicios de producción..."
	docker-compose -f $(COMPOSE_PROD) up -d

down:
	@echo "🛑 Deteniendo servicios de producción..."
	docker-compose -f $(COMPOSE_PROD) down

restart:
	@echo "🔄 Reiniciando servicios de producción..."
	docker-compose -f $(COMPOSE_PROD) restart

# ========================================
# DESARROLLO
# ========================================

dev:
	@echo "🔧 Iniciando servicios de desarrollo..."
	docker-compose -f $(COMPOSE_DEV) up --build

dev-down:
	@echo "🛑 Deteniendo servicios de desarrollo..."
	docker-compose -f $(COMPOSE_DEV) down

# ========================================
# MONITOREO
# ========================================

logs:
	@echo "📊 Mostrando logs de producción..."
	docker-compose -f $(COMPOSE_PROD) logs -f

dev-logs:
	@echo "📊 Mostrando logs de desarrollo..."
	docker-compose -f $(COMPOSE_DEV) logs -f

status:
	@echo "📈 Estado de contenedores de producción:"
	docker-compose -f $(COMPOSE_PROD) ps
	@echo ""
	@echo "📈 Estado de contenedores de desarrollo:"
	docker-compose -f $(COMPOSE_DEV) ps

# ========================================
# LIMPIEZA
# ========================================

clean:
	@echo "🧹 Limpiando contenedores, imágenes y volúmenes..."
	docker-compose -f $(COMPOSE_PROD) down -v
	docker-compose -f $(COMPOSE_DEV) down -v
	docker system prune -a -f
	docker volume prune -f

# ========================================
# UTILIDADES
# ========================================

shell:
	@echo "🐚 Accediendo al shell del contenedor de la aplicación..."
	docker-compose -f $(COMPOSE_PROD) exec app sh

db-shell:
	@echo "🗄️ Accediendo al shell de la base de datos..."
	docker-compose -f $(COMPOSE_PROD) exec postgres psql -U postgres -d Tickets

backup:
	@echo "💾 Creando backup de la base de datos..."
	docker-compose -f $(COMPOSE_PROD) exec postgres pg_dump -U postgres Tickets > backup_$(shell date +%Y%m%d_%H%M%S).sql

restore:
	@echo "📥 Restaurando backup de la base de datos..."
	@read -p "Ingrese el nombre del archivo de backup: " file; \
	docker-compose -f $(COMPOSE_PROD) exec -T postgres psql -U postgres -d Tickets < $$file 