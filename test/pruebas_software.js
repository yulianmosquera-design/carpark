// ====================================================================
// PARQUEADERO AUTOS COLOMBIA - SUITE DE PRUEBAS DE SOFTWARE
// Fundamentado en la Unidad 1 (AA2) y Unidad 2 (AA5) de Ingeniería de Software
// Técnicas: Pruebas Dinámicas Automatizadas (Corrección, Rendimiento, Confiabilidad y Seguridad)
// ====================================================================

const repo = require('../src/repositories/parqueaderoRepository');
const service = require('../src/services/parqueaderoService');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(cond, desc) {
  totalTests++;
  if (cond) {
    passedTests++;
    console.log(`  [PASS] Test ${totalTests}: ${desc}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] Test ${totalTests}: ${desc}`);
  }
}

console.log('====================================================================');
console.log(' SUITE DE PRUEBAS DE SOFTWARE - PARQUEADERO AUTOS COLOMBIA');
console.log(' Basado en los estándares de Ingeniería de Software (IU Digital)');
console.log('====================================================================\n');

// --------------------------------------------------------------------
// 1. PRUEBAS DE CORRECCIÓN FUNCIONAL (Unitarias y Lógica de Negocio)
// --------------------------------------------------------------------
console.log('>>> 1. PRUEBAS DINÁMICAS DE CORRECCIÓN (LÓGICA FUNCIONAL) <<<');

// 1.1 Consulta de cliente abonado a mensualidad
const testMensualidad = service.consultarPlaca('KLT452');
assert(testMensualidad.tieneMensualidadActiva === true, 'Validar detección automática de vehículo con mensualidad activa');
assert(testMensualidad.mensualidad.nombres === 'Andrés Felipe', 'Validar asociación correcta del titular de la mensualidad');

// 1.2 Registro de Entrada de nuevo vehículo
const placaTest = 'TEST' + Math.floor(100 + Math.random() * 900);
const entradaRes = service.registrarEntrada({
  placa: placaTest,
  tipo_vehiculo_id: 1,
  celda_id: 3,
  marca: 'Renault',
  linea_modelo: 'Duster',
  color: 'Plata',
  novedad: { tipo: 'RAYON', descripcion: 'Rasguño leve en guardabarro', gravedad: 'LEVE' }
});
assert(entradaRes.success === true, 'Registrar entrada de vehículo exitosamente con generación de ticket');
assert(entradaRes.ticketCodigo.startsWith('TCK-'), 'Estructura correcta del código de ticket (TCK-YYYYMMDD-XXXX)');

// 1.3 Impedir duplicidad de ingreso para vehículo activo
let errorDuplicidad = false;
try {
  service.registrarEntrada({
    placa: placaTest,
    tipo_vehiculo_id: 1,
    celda_id: 4
  });
} catch (e) {
  errorDuplicidad = true;
}
assert(errorDuplicidad === true, 'Regla de negocio: Impedir ingreso duplicado de vehículo ya presente en parqueadero');

// 1.4 Liquidación de salida
const liqRes = service.liquidarSalida(placaTest);
assert(liqRes.totalMinutos >= 1, 'Cálculo dinámico de minutos transcurridos');
assert(liqRes.totalPagar >= 4500, 'Aplicación de tarifa horaria mínima oficial para Automóvil ($4.500)');

// 1.5 Confirmación de salida y liberación de celda
const salidaRes = service.registrarSalida({ criterio: placaTest, metodo_pago: 'EFECTIVO' });
assert(salidaRes.success === true, 'Confirmar salida, cobro y cierre de estadía');

const celdasPost = repo.getAllCeldas();
const celdaLiberada = celdasPost.find(c => c.id === 3);
assert(celdaLiberada.estado === 'DISPONIBLE', 'Verificar liberación atómica de la celda a estado DISPONIBLE');

// --------------------------------------------------------------------
// 2. PRUEBAS DE SEGURIDAD (Inyección SQL, Integridad Referencial)
// --------------------------------------------------------------------
console.log('\n>>> 2. PRUEBAS DE SEGURIDAD E INTEGRIDAD DE DATOS <<<');

// 2.1 Resistencia a SQL Injection en consultas
const sqlInjectionAttempt = "' OR '1'='1";
const resInjection = service.consultarPlaca(sqlInjectionAttempt);
assert(resInjection.existe === false, 'Resistencia a SQL Injection mediante sentencias preparadas');

// 2.2 Validación de parámetros obligatorios
let errorValidacion = false;
try {
  service.registrarEntrada({ placa: '', tipo_vehiculo_id: null, celda_id: null });
} catch (e) {
  errorValidacion = true;
}
assert(errorValidacion === true, 'Rechazo estricto de entradas con campos obligatorios vacíos o nulos');

// --------------------------------------------------------------------
// 3. PRUEBAS DE ITERACIÓN 2: GESTIÓN DE USUARIOS Y GESTIÓN DE CELDAS
// --------------------------------------------------------------------
console.log('\n>>> 3. PRUEBAS DINÁMICAS ITERACIÓN 2: USUARIOS Y CELDAS <<<');

// 3.1 Creación de nuevo usuario con rol asignado
const randUser = 'operador_' + Math.floor(100 + Math.random() * 900);
const randDoc = '987' + Math.floor(100000 + Math.random() * 900000);
const userRes = service.crearUsuario({
  documento: randDoc,
  nombre: 'Yulian',
  apellido: 'Mosquera',
  telefono: '3124567890',
  email: randUser + '@autoscolombia.com',
  username: randUser,
  password: 'Password123!',
  rol_id: 2, // Operador
  estado: 'ACTIVO'
});
assert(userRes.success === true && userRes.id > 0, 'Creación de nuevo usuario con rol asignado exitosamente');

// 3.2 Impedir duplicidad de username en creación de usuario
let errorUserDup = false;
try {
  service.crearUsuario({
    documento: '1112223334',
    nombre: 'Duplicado',
    apellido: 'Test',
    username: randUser, // Mismo username
    rol_id: 2
  });
} catch (e) {
  errorUserDup = true;
}
assert(errorUserDup === true, 'Regla de negocio: Rechazo estricto de username duplicado');

// 3.3 Cambio de estado de usuario (Activar / Inactivar)
const toggleRes = service.toggleEstadoUsuario(userRes.id);
assert(toggleRes.nuevoEstado === 'INACTIVO', 'Modificación de estado de usuario a INACTIVO');

// 3.4 Creación de nueva celda en el parqueadero
const randCode = 'X-' + Math.floor(10 + Math.random() * 90);
const celdaRes = service.crearCelda({
  codigo: randCode,
  piso_zona: 'Piso 2 - VIP',
  tipo_permitido_id: 1, // Automóvil
  estado: 'DISPONIBLE'
});
assert(celdaRes.success === true && celdaRes.id > 0, 'Creación y parametrización de nueva celda en el parqueadero');

// 3.5 Cambio de estado de celda a MANTENIMIENTO
const mantRes = service.cambiarEstadoCelda(celdaRes.id, 'MANTENIMIENTO');
assert(mantRes.success === true, 'Modificación de estado de celda a MANTENIMIENTO');

// 3.6 Reasignación operativa de celda de vehículo estacionado
// Creamos una estadía en celda A-04 (id: 4) y reasignamos a celda A-03 (id: 3)
const placaReasig = 'REA' + Math.floor(100 + Math.random() * 900);
service.registrarEntrada({
  placa: placaReasig,
  tipo_vehiculo_id: 1,
  celda_id: 4,
  marca: 'Nissan',
  color: 'Azul'
});
const reasigRes = service.reasignarCelda(4, 3);
assert(reasigRes.success === true, 'Reasignación atómica de vehículo activo entre celdas (Celda A-04 -> Celda A-03)');

const celdasReasig = repo.getAllCeldas();
const celdaOrig = celdasReasig.find(c => c.id === 4);
const celdaDest = celdasReasig.find(c => c.id === 3);
assert(celdaOrig.estado === 'DISPONIBLE' && celdaDest.estado === 'OCUPADA', 'Validación de estados consistentes tras reasignación de celdas');

// --------------------------------------------------------------------
// 4. PRUEBAS DE RENDIMIENTO Y VELOCIDAD DE RESPUESTA
// --------------------------------------------------------------------
console.log('\n>>> 3. PRUEBAS DE RENDIMIENTO Y TIEMPOS DE RESPUESTA <<<');

const tInicio = performance.now();
for (let i = 0; i < 50; i++) {
  repo.getEstadisticas();
}
const tFin = performance.now();
const tPromedio = (tFin - tInicio) / 50;
assert(tPromedio < 10.0, `Tiempo de consulta promedio del dashboard (${tPromedio.toFixed(2)} ms) muy por debajo del umbral RNF (800 ms)`);

// --------------------------------------------------------------------
// 4. PRUEBAS DE CONFIABILIDAD Y MANEJO DE ESTADOS
// --------------------------------------------------------------------
console.log('\n>>> 4. PRUEBAS DE CONFIABILIDAD (ESTADOS DE CELDA Y REPO) <<<');

const stats = repo.getEstadisticas();
assert(stats.totalCeldas >= 12, 'Confiabilidad en conteo total de celdas parametrizadas (al menos 12 celdas base)');
assert(stats.celdasDisponibles + stats.celdasOcupadas + stats.celdasMantenimiento === stats.totalCeldas, 'Coherencia matemática en balance de estados de celdas');

// --------------------------------------------------------------------
// RESUMEN FINAL DE LA EVALUACIÓN
// --------------------------------------------------------------------
console.log('\n====================================================================');
console.log(` RESULTADO FINAL DE LA SUITE DE PRUEBAS:`);
console.log(` Pruebas Totales Ejecutadas: ${totalTests}`);
console.log(` Pruebas Exitosas (PASSED): ${passedTests}`);
console.log(` Pruebas Fallidas (FAILED): ${failedTests}`);
console.log(` Tasa de Éxito: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
console.log('====================================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
