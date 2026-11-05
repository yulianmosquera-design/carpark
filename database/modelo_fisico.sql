-- ====================================================================
-- SISTEMA DE INFORMACIÓN: PARQUEADERO "AUTOS COLOMBIA"
-- ITERACIÓN 1: GESTIÓN DE ENTRADA Y SALIDA DE VEHÍCULOS
-- MODELO FÍSICO DE BASE DE DATOS (DDL & DML)
-- Compatible con SQLite, PostgreSQL y MySQL (ANSI SQL Estándar)
-- ====================================================================

-- 1. TABLA: ROLES DE SISTEMA
CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA: USUARIOS DEL SISTEMA (OPERADORES Y ADMINISTRADORES)
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    documento VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(120) UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol_id INTEGER NOT NULL,
    estado VARCHAR(20) DEFAULT 'ACTIVO' CHECK(estado IN ('ACTIVO', 'INACTIVO')),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- 3. TABLA: TIPOS DE VEHÍCULOS
CREATE TABLE IF NOT EXISTS tipos_vehiculo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE, -- Automóvil, Motocicleta, Camioneta
    tarifa_hora DECIMAL(10,2) NOT NULL DEFAULT 3500.00,
    tarifa_dia DECIMAL(10,2) NOT NULL DEFAULT 25000.00,
    tarifa_mes DECIMAL(10,2) NOT NULL DEFAULT 160000.00,
    descripcion TEXT
);

-- 4. TABLA: CLIENTES AFILIADOS / MENSUALIDAD
CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo_documento VARCHAR(10) DEFAULT 'CC',
    documento VARCHAR(20) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(120),
    direccion VARCHAR(150),
    estado VARCHAR(20) DEFAULT 'ACTIVO' CHECK(estado IN ('ACTIVO', 'INACTIVO')),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABLA: VEHÍCULOS
CREATE TABLE IF NOT EXISTS vehiculos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    placa VARCHAR(10) NOT NULL UNIQUE,
    tipo_vehiculo_id INTEGER NOT NULL,
    marca VARCHAR(50),
    linea_modelo VARCHAR(50),
    color VARCHAR(30),
    cliente_id INTEGER NULL, -- Opcional, si está asociado a un titular de mensualidad
    observaciones TEXT,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tipo_vehiculo_id) REFERENCES tipos_vehiculo(id) ON DELETE RESTRICT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL
);

-- 6. TABLA: PLANES DE MENSUALIDAD
CREATE TABLE IF NOT EXISTS mensualidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    vehiculo_id INTEGER NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    valor_mensualidad DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'ACTIVA' CHECK(estado IN ('ACTIVA', 'VENCIDA', 'SUSPENDIDA', 'CANCELADA')),
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT,
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE RESTRICT
);

-- 7. TABLA: CELDAS DE PARQUEADERO
CREATE TABLE IF NOT EXISTS celdas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo VARCHAR(10) NOT NULL UNIQUE, -- Ej: A-01, B-05, M-01
    piso_zona VARCHAR(20) NOT NULL DEFAULT 'Piso 1',
    tipo_permitido_id INTEGER NOT NULL,
    estado VARCHAR(20) DEFAULT 'DISPONIBLE' CHECK(estado IN ('DISPONIBLE', 'OCUPADA', 'RESERVADA', 'MANTENIMIENTO')),
    vehiculo_actual_id INTEGER NULL,
    FOREIGN KEY (tipo_permitido_id) REFERENCES tipos_vehiculo(id) ON DELETE RESTRICT,
    FOREIGN KEY (vehiculo_actual_id) REFERENCES vehiculos(id) ON DELETE SET NULL
);

-- 8. TABLA PRINCIPAL ITERACIÓN 1: REGISTRO DE ESTADÍA (ENTRADAS Y SALIDAS)
CREATE TABLE IF NOT EXISTS registros_estadia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_codigo VARCHAR(30) NOT NULL UNIQUE,
    vehiculo_id INTEGER NOT NULL,
    celda_id INTEGER NOT NULL,
    tipo_servicio VARCHAR(20) NOT NULL CHECK(tipo_servicio IN ('MENSUALIDAD', 'POR_HORAS')),
    fecha_hora_entrada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usuario_entrada_id INTEGER NOT NULL,
    fecha_hora_salida DATETIME NULL,
    usuario_salida_id INTEGER NULL,
    estado_estadia VARCHAR(20) DEFAULT 'EN_PARQUEADERO' CHECK(estado_estadia IN ('EN_PARQUEADERO', 'FINALIZADO', 'ANULADO')),
    total_minutos INTEGER DEFAULT 0,
    subtotal DECIMAL(10,2) DEFAULT 0.00,
    descuento DECIMAL(10,2) DEFAULT 0.00,
    total_pagar DECIMAL(10,2) DEFAULT 0.00,
    estado_pago VARCHAR(20) DEFAULT 'PENDIENTE' CHECK(estado_pago IN ('PENDIENTE', 'PAGADO', 'EXENTO_MENSUALIDAD')),
    metodo_pago VARCHAR(30) NULL,
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE RESTRICT,
    FOREIGN KEY (celda_id) REFERENCES celdas(id) ON DELETE RESTRICT,
    FOREIGN KEY (usuario_entrada_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    FOREIGN KEY (usuario_salida_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- 9. TABLA: NOVEDADES REGISTRADAS SOBRE EL VEHÍCULO
CREATE TABLE IF NOT EXISTS novedades_vehiculo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    registro_estadia_id INTEGER NOT NULL,
    vehiculo_id INTEGER NOT NULL,
    tipo_novedad VARCHAR(30) NOT NULL CHECK(tipo_novedad IN ('RAYON', 'GOLPE', 'OBJETO_VALOR', 'FALLA_MECANICA', 'SIN_RETROVISOR', 'OTRA')),
    descripcion TEXT NOT NULL,
    gravedad VARCHAR(20) DEFAULT 'LEVE' CHECK(gravedad IN ('LEVE', 'MEDIA', 'ALTA')),
    ubicacion_dano VARCHAR(100), -- Frontal, Lateral Derecho, Trasero, etc.
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    usuario_reporta_id INTEGER NOT NULL,
    FOREIGN KEY (registro_estadia_id) REFERENCES registros_estadia(id) ON DELETE CASCADE,
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE RESTRICT,
    FOREIGN KEY (usuario_reporta_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);

-- ====================================================================
-- ÍNDICES PARA OPTIMIZACIÓN DE BÚSQUEDA Y RENDIMIENTO
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_vehiculos_placa ON vehiculos(placa);
CREATE INDEX IF NOT EXISTS idx_estadia_ticket ON registros_estadia(ticket_codigo);
CREATE INDEX IF NOT EXISTS idx_estadia_estado ON registros_estadia(estado_estadia);
CREATE INDEX IF NOT EXISTS idx_celdas_estado ON celdas(estado);
CREATE INDEX IF NOT EXISTS idx_mensualidades_vehiculo ON mensualidades(vehiculo_id, estado);

-- ====================================================================
-- INSERCIÓN DE DATOS INICIALES (SEMILLA / SEED DATA)
-- ====================================================================

-- Roles
INSERT OR IGNORE INTO roles (id, nombre, descripcion) VALUES 
(1, 'Administrador', 'Control total de configuración, tarifas y reportes'),
(2, 'Operador', 'Gestión de entradas, salidas, celdas y novedades'),
(3, 'Auditor / Supervisor', 'Auditoría de celdas, reportes y revisión de novedades');

-- Usuarios
INSERT OR IGNORE INTO usuarios (id, documento, nombre, apellido, telefono, email, username, password_hash, rol_id, estado) VALUES
(1, '1020304050', 'Carlos', 'Gómez', '3001234567', 'admin@autoscolombia.com', 'admin', 'admin123', 1, 'ACTIVO'),
(2, '1098765432', 'Laura', 'Martínez', '3109876543', 'operador@autoscolombia.com', 'laura_op', 'operador123', 2, 'ACTIVO');

-- Tipos de Vehículo
INSERT OR IGNORE INTO tipos_vehiculo (id, nombre, tarifa_hora, tarifa_dia, tarifa_mes, descripcion) VALUES
(1, 'Automóvil', 4500.00, 30000.00, 180000.00, 'Vehículos particulares convencionales tipo sedán o hatchback'),
(2, 'Motocicleta', 2500.00, 16000.00, 95000.00, 'Motos de dos y tres ruedas'),
(3, 'Camioneta / SUV', 6000.00, 40000.00, 230000.00, 'Camionetas grandes, camperos y vans');

-- Clientes de Mensualidad
INSERT OR IGNORE INTO clientes (id, documento, nombres, apellidos, telefono, email, direccion) VALUES
(1, '71234567', 'Andrés Felipe', 'Restrepo Jaramillo', '3157894561', 'andres.restrepo@email.com', 'Calle 45 # 28-15'),
(2, '43567890', 'María Camila', 'Zapata Ospina', '3184561234', 'maria.zapata@email.com', 'Carrera 70 # 52-40');

-- Vehículos Registrados
INSERT OR IGNORE INTO vehiculos (id, placa, tipo_vehiculo_id, marca, linea_modelo, color, cliente_id, observaciones) VALUES
(1, 'KLT452', 1, 'Mazda', 'Mazda 3 2022', 'Rojo Diamante', 1, 'Vehículo con mensualidad activa'),
(2, 'ZXY89D', 2, 'Yamaha', 'NMAX 155 2023', 'Negro Mate', 2, 'Moto afiliada a mensualidad'),
(3, 'HQW103', 3, 'Toyota', 'Prado TXL 2021', 'Blanco Perlado', NULL, 'Cliente por horas');

-- Mensualidades Vigentes
INSERT OR IGNORE INTO mensualidades (id, cliente_id, vehiculo_id, fecha_inicio, fecha_fin, valor_mensualidad, estado) VALUES
(1, 1, 1, '2026-10-01', '2026-12-31', 180000.00, 'ACTIVA'),
(2, 2, 2, '2026-10-15', '2026-12-31', 95000.00, 'ACTIVA');

-- Celdas del Parqueadero
INSERT OR IGNORE INTO celdas (id, codigo, piso_zona, tipo_permitido_id, estado, vehiculo_actual_id) VALUES
-- Autos
(1, 'A-01', 'Piso 1 - Autos', 1, 'OCUPADA', 1),
(2, 'A-02', 'Piso 1 - Autos', 1, 'DISPONIBLE', NULL),
(3, 'A-03', 'Piso 1 - Autos', 1, 'DISPONIBLE', NULL),
(4, 'A-04', 'Piso 1 - Autos', 1, 'DISPONIBLE', NULL),
(5, 'A-05', 'Piso 1 - Autos', 1, 'MANTENIMIENTO', NULL),
-- Camionetas
(6, 'C-01', 'Piso 1 - Camionetas', 3, 'OCUPADA', 3),
(7, 'C-02', 'Piso 1 - Camionetas', 3, 'DISPONIBLE', NULL),
(8, 'C-03', 'Piso 1 - Camionetas', 3, 'DISPONIBLE', NULL),
-- Motos
(9, 'M-01', 'Zona Motos', 2, 'OCUPADA', 2),
(10, 'M-02', 'Zona Motos', 2, 'DISPONIBLE', NULL),
(11, 'M-03', 'Zona Motos', 2, 'DISPONIBLE', NULL),
(12, 'M-04', 'Zona Motos', 2, 'DISPONIBLE', NULL);

-- Registros de Estadía Iniciales
INSERT OR IGNORE INTO registros_estadia (id, ticket_codigo, vehiculo_id, celda_id, tipo_servicio, fecha_hora_entrada, usuario_entrada_id, estado_estadia, total_minutos, total_pagar, estado_pago) VALUES
(1, 'TCK-20261030-001', 1, 1, 'MENSUALIDAD', '2026-10-30 07:30:00', 2, 'EN_PARQUEADERO', 0, 0.00, 'EXENTO_MENSUALIDAD'),
(2, 'TCK-20261030-002', 2, 9, 'MENSUALIDAD', '2026-10-30 08:15:00', 2, 'EN_PARQUEADERO', 0, 0.00, 'EXENTO_MENSUALIDAD'),
(3, 'TCK-20261030-003', 3, 6, 'POR_HORAS', '2026-10-30 09:45:00', 2, 'EN_PARQUEADERO', 0, 0.00, 'PENDIENTE');

-- Novedades Registradas
INSERT OR IGNORE INTO novedades_vehiculo (id, registro_estadia_id, vehiculo_id, tipo_novedad, descripcion, gravedad, ubicacion_dano, usuario_reporta_id) VALUES
(1, 1, 1, 'RAYON', 'Rayón superficial de 10 cm en puerta trasera derecha preexistente', 'LEVE', 'Lateral Derecho', 2),
(2, 3, 3, 'OBJETO_VALOR', 'Maletín negro visible en asiento trasero, cliente notificado y registrado', 'MEDIA', 'Interior / Asiento Trasero', 2);
