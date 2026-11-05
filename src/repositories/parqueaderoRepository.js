const { db } = require('../config/database');

class ParqueaderoRepository {
  // Vehículos
  findVehiculoByPlaca(placa) {
    const stmt = db.prepare(`
      SELECT v.*, tv.nombre AS tipo_nombre, tv.tarifa_hora, tv.tarifa_dia, tv.tarifa_mes,
             c.nombres AS cliente_nombres, c.apellidos AS cliente_apellidos, c.documento AS cliente_documento
      FROM vehiculos v
      JOIN tipos_vehiculo tv ON v.tipo_vehiculo_id = tv.id
      LEFT JOIN clientes c ON v.cliente_id = c.id
      WHERE UPPER(v.placa) = UPPER(?)
    `);
    return stmt.get(placa);
  }

  createVehiculo({ placa, tipo_vehiculo_id, marca, linea_modelo, color, cliente_id, observaciones }) {
    const stmt = db.prepare(`
      INSERT INTO vehiculos (placa, tipo_vehiculo_id, marca, linea_modelo, color, cliente_id, observaciones)
      VALUES (UPPER(?), ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(placa, tipo_vehiculo_id, marca || '', linea_modelo || '', color || '', cliente_id || null, observaciones || '');
    return info.lastInsertRowid;
  }

  // Mensualidades
  checkMensualidadActiva(vehiculoId) {
    const stmt = db.prepare(`
      SELECT m.*, c.nombres, c.apellidos, c.documento, c.telefono
      FROM mensualidades m
      JOIN clientes c ON m.cliente_id = c.id
      WHERE m.vehiculo_id = ? 
        AND m.estado = 'ACTIVA'
        AND date('now', 'localtime') BETWEEN m.fecha_inicio AND m.fecha_fin
    `);
    return stmt.get(vehiculoId);
  }

  // Celdas
  getAllCeldas() {
    const stmt = db.prepare(`
      SELECT c.*, tv.nombre AS tipo_permitido_nombre, v.placa AS placa_ocupante, v.marca AS marca_ocupante,
             re.ticket_codigo, re.fecha_hora_entrada
      FROM celdas c
      JOIN tipos_vehiculo tv ON c.tipo_permitido_id = tv.id
      LEFT JOIN vehiculos v ON c.vehiculo_actual_id = v.id
      LEFT JOIN registros_estadia re ON re.celda_id = c.id AND re.estado_estadia = 'EN_PARQUEADERO'
      ORDER BY c.piso_zona, c.codigo
    `);
    return stmt.all();
  }

  getCeldasDisponiblesPorTipo(tipoVehiculoId) {
    const stmt = db.prepare(`
      SELECT * FROM celdas 
      WHERE tipo_permitido_id = ? AND estado = 'DISPONIBLE'
      ORDER BY codigo ASC
    `);
    return stmt.all(tipoVehiculoId);
  }

  updateCeldaEstado(celdaId, estado, vehiculoId = null) {
    const stmt = db.prepare(`
      UPDATE celdas 
      SET estado = ?, vehiculo_actual_id = ?
      WHERE id = ?
    `);
    stmt.run(estado, vehiculoId, celdaId);
  }

  // Registros de Estadía (Entrada / Salida)
  createRegistroEntrada({ ticket_codigo, vehiculo_id, celda_id, tipo_servicio, usuario_entrada_id }) {
    const stmt = db.prepare(`
      INSERT INTO registros_estadia (
        ticket_codigo, vehiculo_id, celda_id, tipo_servicio, 
        fecha_hora_entrada, usuario_entrada_id, estado_estadia, estado_pago
      ) VALUES (?, ?, ?, ?, datetime('now', 'localtime'), ?, 'EN_PARQUEADERO', 
        CASE WHEN ? = 'MENSUALIDAD' THEN 'EXENTO_MENSUALIDAD' ELSE 'PENDIENTE' END
      )
    `);
    const info = stmt.run(ticket_codigo, vehiculo_id, celda_id, tipo_servicio, usuario_entrada_id, tipo_servicio);
    return info.lastInsertRowid;
  }

  findEstadiaActivaByPlaca(placa) {
    const stmt = db.prepare(`
      SELECT re.*, v.placa, v.marca, v.linea_modelo, v.color, 
             tv.nombre AS tipo_nombre, tv.tarifa_hora, tv.tarifa_dia,
             c.codigo AS celda_codigo, c.piso_zona,
             u.nombre || ' ' || u.apellido AS operador_entrada
      FROM registros_estadia re
      JOIN vehiculos v ON re.vehiculo_id = v.id
      JOIN tipos_vehiculo tv ON v.tipo_vehiculo_id = tv.id
      JOIN celdas c ON re.celda_id = c.id
      JOIN usuarios u ON re.usuario_entrada_id = u.id
      WHERE UPPER(v.placa) = UPPER(?) AND re.estado_estadia = 'EN_PARQUEADERO'
    `);
    return stmt.get(placa);
  }

  findEstadiaActivaByTicket(ticketCodigo) {
    const stmt = db.prepare(`
      SELECT re.*, v.placa, v.marca, v.linea_modelo, v.color, 
             tv.nombre AS tipo_nombre, tv.tarifa_hora, tv.tarifa_dia,
             c.codigo AS celda_codigo, c.piso_zona,
             u.nombre || ' ' || u.apellido AS operador_entrada
      FROM registros_estadia re
      JOIN vehiculos v ON re.vehiculo_id = v.id
      JOIN tipos_vehiculo tv ON v.tipo_vehiculo_id = tv.id
      JOIN celdas c ON re.celda_id = c.id
      JOIN usuarios u ON re.usuario_entrada_id = u.id
      WHERE re.ticket_codigo = ? AND re.estado_estadia = 'EN_PARQUEADERO'
    `);
    return stmt.get(ticketCodigo);
  }

  registrarSalida({ id, minutos, subtotal, descuento, total, metodo_pago, usuario_salida_id, estado_pago }) {
    const stmt = db.prepare(`
      UPDATE registros_estadia
      SET fecha_hora_salida = datetime('now', 'localtime'),
          usuario_salida_id = ?,
          estado_estadia = 'FINALIZADO',
          total_minutos = ?,
          subtotal = ?,
          descuento = ?,
          total_pagar = ?,
          estado_pago = ?,
          metodo_pago = ?
      WHERE id = ?
    `);
    stmt.run(usuario_salida_id, minutos, subtotal, descuento, total, estado_pago, metodo_pago, id);
  }

  // Novedades
  createNovedad({ registro_estadia_id, vehiculo_id, tipo_novedad, descripcion, gravedad, ubicacion_dano, usuario_reporta_id }) {
    const stmt = db.prepare(`
      INSERT INTO novedades_vehiculo (
        registro_estadia_id, vehiculo_id, tipo_novedad, descripcion, gravedad, ubicacion_dano, usuario_reporta_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(registro_estadia_id, vehiculo_id, tipo_novedad, descripcion, gravedad || 'LEVE', ubicacion_dano || '', usuario_reporta_id);
    return info.lastInsertRowid;
  }

  getNovedadesRecientes() {
    const stmt = db.prepare(`
      SELECT n.*, v.placa, v.marca, re.ticket_codigo, u.nombre || ' ' || u.apellido AS operador
      FROM novedades_vehiculo n
      JOIN vehiculos v ON n.vehiculo_id = v.id
      JOIN registros_estadia re ON n.registro_estadia_id = re.id
      JOIN usuarios u ON n.usuario_reporta_id = u.id
      ORDER BY n.fecha_hora DESC
      LIMIT 20
    `);
    return stmt.all();
  }

  // Dashboard / Reportes
  getEstadisticas() {
    const totalCeldas = db.prepare(`SELECT COUNT(*) AS total FROM celdas`).get().total;
    const celdasOcupadas = db.prepare(`SELECT COUNT(*) AS ocupadas FROM celdas WHERE estado = 'OCUPADA'`).get().ocupadas;
    const celdasDisponibles = db.prepare(`SELECT COUNT(*) AS disponibles FROM celdas WHERE estado = 'DISPONIBLE'`).get().disponibles;
    const celdasMantenimiento = db.prepare(`SELECT COUNT(*) AS mant FROM celdas WHERE estado = 'MANTENIMIENTO'`).get().mant;

    const entradasHoy = db.prepare(`
      SELECT COUNT(*) AS total FROM registros_estadia 
      WHERE date(fecha_hora_entrada) = date('now', 'localtime')
    `).get().total;

    const salidasHoy = db.prepare(`
      SELECT COUNT(*) AS total, COALESCE(SUM(total_pagar), 0) AS recaudado FROM registros_estadia 
      WHERE date(fecha_hora_salida) = date('now', 'localtime') AND estado_estadia = 'FINALIZADO'
    `).get();

    const vehiculosEnParqueadero = db.prepare(`
      SELECT COUNT(*) AS total FROM registros_estadia WHERE estado_estadia = 'EN_PARQUEADERO'
    `).get().total;

    return {
      totalCeldas,
      celdasOcupadas,
      celdasDisponibles,
      celdasMantenimiento,
      entradasHoy,
      salidasHoy: salidasHoy.total,
      recaudadoHoy: salidasHoy.recaudado,
      vehiculosEnParqueadero
    };
  }

  getVehiculosActualmenteEstacionados() {
    const stmt = db.prepare(`
      SELECT re.id AS registro_id, re.ticket_codigo, re.fecha_hora_entrada, re.tipo_servicio,
             v.placa, v.marca, v.color, tv.nombre AS tipo_vehiculo, tv.tarifa_hora,
             c.codigo AS celda_codigo, c.piso_zona,
             (SELECT COUNT(*) FROM novedades_vehiculo WHERE registro_estadia_id = re.id) AS total_novedades
      FROM registros_estadia re
      JOIN vehiculos v ON re.vehiculo_id = v.id
      JOIN tipos_vehiculo tv ON v.tipo_vehiculo_id = tv.id
      JOIN celdas c ON re.celda_id = c.id
      WHERE re.estado_estadia = 'EN_PARQUEADERO'
      ORDER BY re.fecha_hora_entrada DESC
    `);
    return stmt.all();
  }

  getTiposVehiculo() {
    return db.prepare(`SELECT * FROM tipos_vehiculo`).all();
  }

  getClientesMensualidad() {
    const stmt = db.prepare(`
      SELECT c.*, v.placa, v.marca, m.fecha_inicio, m.fecha_fin, m.estado AS estado_mensualidad
      FROM clientes c
      LEFT JOIN vehiculos v ON v.cliente_id = c.id
      LEFT JOIN mensualidades m ON m.vehiculo_id = v.id
      ORDER BY c.nombres ASC
    `);
    return stmt.all();
  }

  // ====================================================================
  // ITERACIÓN 2: MÉTODOS PARA GESTIÓN DE USUARIOS
  // ====================================================================
  getAllRoles() {
    return db.prepare(`SELECT * FROM roles ORDER BY id ASC`).all();
  }

  getAllUsuarios() {
    const stmt = db.prepare(`
      SELECT u.id, u.documento, u.nombre, u.apellido, u.telefono, u.email, u.username,
             u.rol_id, r.nombre AS rol_nombre, u.estado, u.fecha_creacion
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      ORDER BY u.id ASC
    `);
    return stmt.all();
  }

  findUsuarioById(id) {
    const stmt = db.prepare(`
      SELECT u.*, r.nombre AS rol_nombre
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      WHERE u.id = ?
    `);
    return stmt.get(id);
  }

  findUsuarioByUsername(username) {
    const stmt = db.prepare(`SELECT * FROM usuarios WHERE LOWER(username) = LOWER(?)`);
    return stmt.get(username);
  }

  findUsuarioByDocumento(doc) {
    const stmt = db.prepare(`SELECT * FROM usuarios WHERE documento = ?`);
    return stmt.get(doc);
  }

  createUsuario({ documento, nombre, apellido, telefono, email, username, password_hash, rol_id, estado = 'ACTIVO' }) {
    const stmt = db.prepare(`
      INSERT INTO usuarios (documento, nombre, apellido, telefono, email, username, password_hash, rol_id, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(documento, nombre, apellido, telefono || '', email || '', username, password_hash || '123456', rol_id, estado);
    return info.lastInsertRowid;
  }

  updateUsuario(id, { nombre, apellido, telefono, email, rol_id, estado, password_hash }) {
    if (password_hash) {
      const stmt = db.prepare(`
        UPDATE usuarios
        SET nombre = ?, apellido = ?, telefono = ?, email = ?, rol_id = ?, estado = ?, password_hash = ?
        WHERE id = ?
      `);
      stmt.run(nombre, apellido, telefono || '', email || '', rol_id, estado, password_hash, id);
    } else {
      const stmt = db.prepare(`
        UPDATE usuarios
        SET nombre = ?, apellido = ?, telefono = ?, email = ?, rol_id = ?, estado = ?
        WHERE id = ?
      `);
      stmt.run(nombre, apellido, telefono || '', email || '', rol_id, estado, id);
    }
  }

  toggleEstadoUsuario(id, nuevoEstado) {
    const stmt = db.prepare(`UPDATE usuarios SET estado = ? WHERE id = ?`);
    stmt.run(nuevoEstado, id);
  }

  // ====================================================================
  // ITERACIÓN 2: MÉTODOS AVANZADOS PARA GESTIÓN DE CELDAS
  // ====================================================================
  findCeldaByCodigo(codigo) {
    const stmt = db.prepare(`SELECT * FROM celdas WHERE UPPER(codigo) = UPPER(?)`);
    return stmt.get(codigo);
  }

  findCeldaById(id) {
    const stmt = db.prepare(`
      SELECT c.*, tv.nombre AS tipo_permitido_nombre, v.placa AS placa_ocupante
      FROM celdas c
      JOIN tipos_vehiculo tv ON c.tipo_permitido_id = tv.id
      LEFT JOIN vehiculos v ON c.vehiculo_actual_id = v.id
      WHERE c.id = ?
    `);
    return stmt.get(id);
  }

  createCelda({ codigo, piso_zona, tipo_permitido_id, estado = 'DISPONIBLE' }) {
    const stmt = db.prepare(`
      INSERT INTO celdas (codigo, piso_zona, tipo_permitido_id, estado, vehiculo_actual_id)
      VALUES (UPPER(?), ?, ?, ?, NULL)
    `);
    const info = stmt.run(codigo, piso_zona, tipo_permitido_id, estado);
    return info.lastInsertRowid;
  }

  updateCelda(id, { codigo, piso_zona, tipo_permitido_id, estado }) {
    const stmt = db.prepare(`
      UPDATE celdas
      SET codigo = UPPER(?), piso_zona = ?, tipo_permitido_id = ?, estado = ?
      WHERE id = ?
    `);
    stmt.run(codigo, piso_zona, tipo_permitido_id, estado, id);
  }

  // Reasignación operativa de celda: pasa vehículo de Celda A a Celda B
  reasignarCelda(celdaOrigenId, celdaDestinoId) {
    const celdaOrigen = this.findCeldaById(celdaOrigenId);
    if (!celdaOrigen || !celdaOrigen.vehiculo_actual_id) {
      throw new Error('La celda origen no tiene ningún vehículo para reasignar');
    }
    const celdaDestino = this.findCeldaById(celdaDestinoId);
    if (!celdaDestino) {
      throw new Error('La celda de destino no existe');
    }
    if (celdaDestino.estado !== 'DISPONIBLE') {
      throw new Error(`La celda destino ${celdaDestino.codigo} no está disponible (Estado actual: ${celdaDestino.estado})`);
    }

    const vehiculoId = celdaOrigen.vehiculo_actual_id;

    // 1. Liberar celda origen
    this.updateCeldaEstado(celdaOrigenId, 'DISPONIBLE', null);

    // 2. Ocupar celda destino
    this.updateCeldaEstado(celdaDestinoId, 'OCUPADA', vehiculoId);

    // 3. Actualizar registro de estadía activo
    const stmt = db.prepare(`
      UPDATE registros_estadia
      SET celda_id = ?
      WHERE vehiculo_id = ? AND estado_estadia = 'EN_PARQUEADERO'
    `);
    stmt.run(celdaDestinoId, vehiculoId);

    return {
      vehiculoId,
      celdaOrigen: celdaOrigen.codigo,
      celdaDestino: celdaDestino.codigo
    };
  }
}

module.exports = new ParqueaderoRepository();
