const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'database', 'autos_colombia.db');
const sqlSchemaPath = path.join(__dirname, '..', '..', 'database', 'modelo_fisico.sql');

const db = new DatabaseSync(dbPath);

// Inicializar esquema si no existen las tablas
function initializeDatabase() {
  const schemaSql = fs.readFileSync(sqlSchemaPath, 'utf-8');
  // Ejecutar el script SQL
  db.exec(schemaSql);
  console.log('[DB] Base de datos inicializada correctamente en:', dbPath);
}

module.exports = {
  db,
  initializeDatabase
};
