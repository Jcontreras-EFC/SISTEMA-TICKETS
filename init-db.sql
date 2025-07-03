-- Script de inicialización de la base de datos
-- Este archivo se ejecuta automáticamente cuando se crea el contenedor de PostgreSQL

-- Crear tabla de tickets
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    sede VARCHAR(100) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    usuario VARCHAR(100) NOT NULL,
    asunto VARCHAR(200) NOT NULL,
    agente VARCHAR(100) NOT NULL,
    descripcion TEXT,
    prioridad VARCHAR(50) DEFAULT 'media',
    estado VARCHAR(50) DEFAULT 'abierto',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(100) UNIQUE NOT NULL,
    clave VARCHAR(255) NOT NULL,
    permisos TEXT NOT NULL, -- JSON.stringify de array de permisos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_tickets_fecha ON tickets(fecha);
CREATE INDEX IF NOT EXISTS idx_tickets_estado ON tickets(estado);
CREATE INDEX IF NOT EXISTS idx_tickets_usuario ON tickets(usuario);
CREATE INDEX IF NOT EXISTS idx_tickets_agente ON tickets(agente);
CREATE INDEX IF NOT EXISTS idx_usuarios_usuario ON usuarios(usuario);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar updated_at
CREATE TRIGGER update_tickets_updated_at 
    BEFORE UPDATE ON tickets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuarios_updated_at 
    BEFORE UPDATE ON usuarios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar usuario administrador por defecto si no existe
INSERT INTO usuarios (usuario, clave, permisos) 
VALUES ('admin', 'admin123', '["tickets", "usuarios", "reportes"]')
ON CONFLICT (usuario) DO NOTHING;

-- Comentarios sobre la estructura
COMMENT ON TABLE tickets IS 'Tabla principal para almacenar los tickets del sistema';
COMMENT ON TABLE usuarios IS 'Tabla para almacenar usuarios y sus permisos';
COMMENT ON COLUMN usuarios.permisos IS 'Array JSON con los permisos del usuario'; 