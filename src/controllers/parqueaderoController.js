const service = require('../services/parqueaderoService');
const repo = require('../repositories/parqueaderoRepository');

class ParqueaderoController {
  getDashboard(req, res) {
    try {
      const stats = repo.getEstadisticas();
      const vehiculosEstacionados = repo.getVehiculosActualmenteEstacionados();
      const tiposVehiculo = repo.getTiposVehiculo();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, stats, vehiculosEstacionados, tiposVehiculo }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
  }

  consultarPlaca(req, res, query) {
    try {
      const result = service.consultarPlaca(query.placa);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: result }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
  }

  getCeldas(req, res) {
    try {
      const celdas = repo.getAllCeldas();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: celdas }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
  }

  getCeldasDisponibles(req, res, query) {
    try {
      const tipoId = query.tipo || 1;
      const celdas = repo.getCeldasDisponiblesPorTipo(tipoId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: celdas }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
  }

  registrarEntrada(req, res, body) {
    try {
      const result = service.registrarEntrada(body);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
  }

  liquidarSalida(req, res, query) {
    try {
      const result = service.liquidarSalida(query.criterio);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: result }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
  }

  registrarSalida(req, res, body) {
    try {
      const result = service.registrarSalida(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
  }

  getNovedades(req, res) {
    try {
      const novedades = repo.getNovedadesRecientes();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: novedades }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
  }

  registrarNovedad(req, res, body) {
    try {
      const result = service.registrarNovedad(body);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
  }

  getMensualidades(req, res) {
    try {
      const mensualidades = repo.getClientesMensualidad();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: mensualidades }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
  }

  cambiarEstadoCelda(req, res, body) {
    try {
      const result = service.cambiarEstadoCelda(body.celda_id, body.estado);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
  }
}

module.exports = new ParqueaderoController();
