const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const { initializeDatabase } = require('./src/config/database');
const controller = require('./src/controllers/parqueaderoController');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// Tipos MIME
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

// Inicializar la base de datos
initializeDatabase();

// Servidor HTTP
const server = http.createServer((req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Rutas de API
  if (pathname.startsWith('/api/')) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      let parsedBody = {};
      if (body) {
        try {
          parsedBody = JSON.parse(body);
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'JSON inválido' }));
          return;
        }
      }

      // Enrutamiento de la API
      if (pathname === '/api/dashboard' && req.method === 'GET') {
        return controller.getDashboard(req, res);
      }
      if (pathname === '/api/vehiculo/consultar' && req.method === 'GET') {
        return controller.consultarPlaca(req, res, query);
      }
      if (pathname === '/api/celdas' && req.method === 'GET') {
        return controller.getCeldas(req, res);
      }
      if (pathname === '/api/celdas/disponibles' && req.method === 'GET') {
        return controller.getCeldasDisponibles(req, res, query);
      }
      if (pathname === '/api/celdas/estado' && req.method === 'POST') {
        return controller.cambiarEstadoCelda(req, res, parsedBody);
      }
      if (pathname === '/api/entrada' && req.method === 'POST') {
        return controller.registrarEntrada(req, res, parsedBody);
      }
      if (pathname === '/api/salida/liquidar' && req.method === 'GET') {
        return controller.liquidarSalida(req, res, query);
      }
      if (pathname === '/api/salida' && req.method === 'POST') {
        return controller.registrarSalida(req, res, parsedBody);
      }
      if (pathname === '/api/novedades' && req.method === 'GET') {
        return controller.getNovedades(req, res);
      }
      if (pathname === '/api/novedades' && req.method === 'POST') {
        return controller.registrarNovedad(req, res, parsedBody);
      }
      if (pathname === '/api/mensualidades' && req.method === 'GET') {
        return controller.getMensualidades(req, res);
      }

      // 404 para API no encontrada
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Ruta de API no encontrada' }));
    });
    return;
  }

  // Servir archivos estáticos del Frontend
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Fallback a index.html
        fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (errIndex, contentIndex) => {
          if (errIndex) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(contentIndex);
          }
        });
      } else {
        res.writeHead(500);
        res.end(`Error del servidor: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  SISTEMA DE INFORMACIÓN: PARQUEADERO AUTOS COLOMBIA`);
  console.log(`  Iteración 1: Gestión de Entrada y Salida`);
  console.log(`  Servidor activo en: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
