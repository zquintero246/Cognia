const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

// Inicializar tablas
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT,
    age INTEGER,
    profileType TEXT CHECK(profileType IN ('autism', 'intellectual', 'educator', 'parent')),
    password TEXT,
    abilities TEXT,
    preferences TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
// Tabla de registro de actividades realizadas por los usuarios
  db.run(`CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  module TEXT,
  activity_name TEXT,
  success BOOLEAN,
  difficulty INTEGER,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
)`);
});

console.log('✅ Base de datos inicializada');
module.exports = db;