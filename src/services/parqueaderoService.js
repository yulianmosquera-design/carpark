const repo = require('../repositories/parqueaderoRepository');

class ParqueaderoService {
  // Consultar placa antes de ingresar para saber si existe y si tiene mensualidad
  consultarPlaca(placa) {
    if (!placa) throw new Error('Debe especificar una placa');
    const vehiculo = repo.findVehiculoByPlaca(placa);
    let mensualidad = null;
    let tieneEstadiaActiva = false;

    if (vehiculo) {
      mensualidad = repo.checkMensualidadActiva(vehiculo.id);
      const estadia = repo.findEstadiaActivaByPlaca(placa);
      if (estadia) {
        tieneEstadiaActiva = true;
      }
    }

    return {
      existe: !!vehiculo,
      vehiculo: vehiculo || null,
      tieneMensualidadActiva: !!mensualidad,
      mensualidad: mensualidad || null,
      tieneEstadiaActiva
    };
  }

  // Registrar Entrada
  registrarEntrada({ placa, tipo_vehiculo_id, marca, linea_modelo, color, celda_id, observaciones, novedad }) {
    if (!placa || !tipo_vehiculo_id || !celda_id) {
      throw new Error('Placa, tipo de vehículo y celda son obligatorios');
    }

    const placaLimpia = placa.trim().toUpperCase();

    // 1. Verificar si ya está adentro
    const estadiaExistente = repo.findEstadiaActivaByPlaca(placaLimpia);
    if (estadiaExistente) {
      throw new Error(`El vehículo con placa ${placaLimpia} ya se encuentra dentro del parqueadero (Celda: ${estadiaExistente.celda_codigo})`);
    }

    // 2. Buscar o crear vehículo
    let vehiculo = repo.findVehiculoByPlaca(placaLimpia);
    let vehiculoId;
    if (!vehiculo) {
      vehiculoId = repo.createVehiculo({
        placa: placaLimpia,
        tipo_vehiculo_id: Number(tipo_vehiculo_id),
        marca: marca || 'Genérico',
        linea_modelo: linea_modelo || '',
        color: color || '',
        observaciones: observaciones || ''
      });
      vehiculo = repo.findVehiculoByPlaca(placaLimpia);
    } else {
      vehiculoId = vehiculo.id;
    }

    // 3. Validar si tiene mensualidad activa
    const mensualidad = repo.checkMensualidadActiva(vehiculoId);
    const tipoServicio = mensualidad ? 'MENSUALIDAD' : 'POR_HORAS';

    // 4. Generar número de ticket
    const fechaStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    const ticketCodigo = `TCK-${fechaStr}-${rand}`;

    // 5. Registrar estadía (Usuario operador id = 2 por defecto en sesión)
    const registroId = repo.createRegistroEntrada({
      ticket_codigo: ticketCodigo,
      vehiculo_id: vehiculoId,
      celda_id: Number(celda_id),
      tipo_servicio: tipoServicio,
      usuario_entrada_id: 2
    });

    // 6. Actualizar celda a OCUPADA
    repo.updateCeldaEstado(Number(celda_id), 'OCUPADA', vehiculoId);

    // 7. Si hay novedad reportada en la entrada, guardarla
    if (novedad && novedad.descripcion && novedad.descripcion.trim().length > 0) {
      repo.createNovedad({
        registro_estadia_id: registroId,
        vehiculo_id: vehiculoId,
        tipo_novedad: novedad.tipo || 'RAYON',
        descripcion: novedad.descripcion.trim(),
        gravedad: novedad.gravedad || 'LEVE',
        ubicacion_dano: novedad.ubicacion || 'General',
        usuario_reporta_id: 2
      });
    }

    return {
      success: true,
      ticketCodigo,
      registroId,
      placa: placaLimpia,
      celdaId: celda_id,
      tipoServicio,
      esMensualidad: !!mensualidad,
      mensaje: `Entrada registrada exitosamente. Ticket: ${ticketCodigo}`
    };
  }

  // Pre-calcular liquidación de salida
  liquidarSalida(criterio) {
    if (!criterio) throw new Error('Ingrese placa o número de ticket');
    const valor = criterio.trim().toUpperCase();

    let estadia = null;
    if (valor.startsWith('TCK-')) {
      estadia = repo.findEstadiaActivaByTicket(valor);
    } else {
      estadia = repo.findEstadiaActivaByPlaca(valor);
    }

    if (!estadia) {
      throw new Error(`No se encontró vehículo activo en parqueadero con el criterio: ${criterio}`);
    }

    // Calcular tiempos
    const entrada = new Date(estadia.fecha_hora_entrada.replace(' ', 'T'));
    const ahora = new Date();
    const diffMs = Math.max(0, ahora - entrada);
    const totalMinutos = Math.max(1, Math.ceil(diffMs / (1000 * 60)));

    // Cobro
    let totalPagar = 0;
    let horasACobrar = 0;
    let tarifaHora = Number(estadia.tarifa_hora) || 4500;

    if (estadia.tipo_servicio === 'MENSUALIDAD') {
      totalPagar = 0;
    } else {
      // Regla de negocio: Fracción de hora se cobra como hora completa o proporcional (mínimo 1 hora)
      horasACobrar = Math.ceil(totalMinutos / 60);
      totalPagar = horasACobrar * tarifaHora;
    }

    return {
      estadia,
      fechaHoraEntrada: estadia.fecha_hora_entrada,
      fechaHoraSalida: ahora.toISOString().replace('T', ' ').slice(0, 19),
      totalMinutos,
      horasACobrar,
      tarifaHora,
      subtotal: totalPagar,
      descuento: 0,
      totalPagar,
      esMensualidad: estadia.tipo_servicio === 'MENSUALIDAD'
    };
  }

  // Confirmar y registrar salida
  registrarSalida({ criterio, metodo_pago = 'EFECTIVO' }) {
    const liquidacion = this.liquidarSalida(criterio);
    const estadia = liquidacion.estadia;

    const estadoPago = liquidacion.esMensualidad ? 'EXENTO_MENSUALIDAD' : 'PAGADO';

    repo.registrarSalida({
      id: estadia.id,
      minutos: liquidacion.totalMinutos,
      subtotal: liquidacion.subtotal,
      descuento: liquidacion.descuento,
      total: liquidacion.totalPagar,
      metodo_pago,
      usuario_salida_id: 2,
      estado_pago: estadoPago
    });

    // Liberar celda
    repo.updateCeldaEstado(estadia.celda_id, 'DISPONIBLE', null);

    return {
      success: true,
      ticketCodigo: estadia.ticket_codigo,
      placa: estadia.placa,
      celdaLiberada: estadia.celda_codigo,
      totalMinutos: liquidacion.totalMinutos,
      totalPagar: liquidacion.totalPagar,
      metodoPago: metodo_pago,
      mensaje: `Salida registrada exitosamente. Celda ${estadia.celda_codigo} liberada.`
    };
  }

  // Novedades
  registrarNovedad({ registro_estadia_id, vehiculo_id, tipo_novedad, descripcion, gravedad, ubicacion_dano }) {
    if (!registro_estadia_id || !vehiculo_id || !descripcion) {
      throw new Error('Faltan campos obligatorios para registrar la novedad');
    }
    const id = repo.createNovedad({
      registro_estadia_id: Number(registro_estadia_id),
      vehiculo_id: Number(vehiculo_id),
      tipo_novedad,
      descripcion,
      gravedad,
      ubicacion_dano,
      usuario_reporta_id: 2
    });
    return { success: true, id, mensaje: 'Novedad registrada correctamente' };
  }

  // Celdas
  cambiarEstadoCelda(celdaId, nuevoEstado) {
    const celda = repo.findCeldaById(celdaId);
    if (!celda) throw new Error('Celda no encontrada');
    if (celda.vehiculo_actual_id && nuevoEstado === 'DISPONIBLE') {
      throw new Error(`No puede marcarse como DISPONIBLE una celda que contiene el vehículo con placa ${celda.placa_ocupante}. Primero registre su salida o reasígnelo.`);
    }
    repo.updateCeldaEstado(Number(celdaId), nuevoEstado, celda.vehiculo_actual_id);
    return { success: true, mensaje: `Celda ${celda.codigo} actualizada a estado ${nuevoEstado}` };
  }

  // ====================================================================
  // ITERACIÓN 2: LÓGICA DE NEGOCIO PARA GESTIÓN DE USUARIOS
  // ====================================================================
  listarUsuarios() {
    return repo.getAllUsuarios();
  }

  listarRoles() {
    return repo.getAllRoles();
  }

  crearUsuario({ documento, nombre, apellido, telefono, email, username, password, rol_id, estado }) {
    if (!documento || !nombre || !apellido || !username || !rol_id) {
      throw new Error('Documento, nombres, apellidos, usuario y rol son obligatorios');
    }
    const cleanDoc = documento.trim();
    const cleanUser = username.trim().toLowerCase();

    // Validar unicidad
    if (repo.findUsuarioByDocumento(cleanDoc)) {
      throw new Error(`Ya existe un usuario registrado con el documento ${cleanDoc}`);
    }
    if (repo.findUsuarioByUsername(cleanUser)) {
      throw new Error(`El nombre de usuario "${cleanUser}" ya está en uso`);
    }

    const id = repo.createUsuario({
      documento: cleanDoc,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      telefono: telefono ? telefono.trim() : '',
      email: email ? email.trim() : '',
      username: cleanUser,
      password_hash: password || '123456',
      rol_id: Number(rol_id),
      estado: estado || 'ACTIVO'
    });

    return { success: true, id, mensaje: `Usuario ${cleanUser} creado exitosamente` };
  }

  actualizarUsuario(id, { nombre, apellido, telefono, email, rol_id, estado, password }) {
    const usuario = repo.findUsuarioById(id);
    if (!usuario) throw new Error('Usuario no encontrado');

    repo.updateUsuario(Number(id), {
      nombre: nombre ? nombre.trim() : usuario.nombre,
      apellido: apellido ? apellido.trim() : usuario.apellido,
      telefono: telefono !== undefined ? telefono.trim() : usuario.telefono,
      email: email !== undefined ? email.trim() : usuario.email,
      rol_id: rol_id ? Number(rol_id) : usuario.rol_id,
      estado: estado || usuario.estado,
      password_hash: password && password.trim() ? password.trim() : null
    });

    return { success: true, mensaje: `Usuario actualizado correctamente` };
  }

  toggleEstadoUsuario(id) {
    const usuario = repo.findUsuarioById(id);
    if (!usuario) throw new Error('Usuario no encontrado');

    const nuevoEstado = usuario.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    repo.toggleEstadoUsuario(Number(id), nuevoEstado);
    return { success: true, nuevoEstado, mensaje: `Usuario ${usuario.username} marcado como ${nuevoEstado}` };
  }

  // ====================================================================
  // ITERACIÓN 2: LÓGICA DE NEGOCIO PARA GESTIÓN AVANZADA DE CELDAS
  // ====================================================================
  crearCelda({ codigo, piso_zona, tipo_permitido_id, estado = 'DISPONIBLE' }) {
    if (!codigo || !piso_zona || !tipo_permitido_id) {
      throw new Error('Código, piso/zona y tipo permitido son obligatorios');
    }
    const cleanCode = codigo.trim().toUpperCase();
    if (repo.findCeldaByCodigo(cleanCode)) {
      throw new Error(`Ya existe una celda con el código ${cleanCode}`);
    }

    const id = repo.createCelda({
      codigo: cleanCode,
      piso_zona: piso_zona.trim(),
      tipo_permitido_id: Number(tipo_permitido_id),
      estado
    });

    return { success: true, id, codigo: cleanCode, mensaje: `Celda ${cleanCode} creada exitosamente` };
  }

  actualizarCelda(id, { codigo, piso_zona, tipo_permitido_id, estado }) {
    const celda = repo.findCeldaById(id);
    if (!celda) throw new Error('Celda no encontrada');

    const cleanCode = codigo ? codigo.trim().toUpperCase() : celda.codigo;
    if (cleanCode !== celda.codigo && repo.findCeldaByCodigo(cleanCode)) {
      throw new Error(`Ya existe otra celda con el código ${cleanCode}`);
    }

    repo.updateCelda(Number(id), {
      codigo: cleanCode,
      piso_zona: piso_zona ? piso_zona.trim() : celda.piso_zona,
      tipo_permitido_id: tipo_permitido_id ? Number(tipo_permitido_id) : celda.tipo_permitido_id,
      estado: estado || celda.estado
    });

    return { success: true, mensaje: `Celda ${cleanCode} actualizada correctamente` };
  }

  reasignarCelda(celdaOrigenId, celdaDestinoId) {
    if (!celdaOrigenId || !celdaDestinoId) {
      throw new Error('Debe especificar la celda de origen y la celda de destino');
    }
    if (Number(celdaOrigenId) === Number(celdaDestinoId)) {
      throw new Error('La celda de origen y de destino no pueden ser iguales');
    }

    const result = repo.reasignarCelda(Number(celdaOrigenId), Number(celdaDestinoId));
    return {
      success: true,
      mensaje: `Vehículo reasignado exitosamente de la celda ${result.celdaOrigen} a la celda ${result.celdaDestino}`
    };
  }
}

module.exports = new ParqueaderoService();
