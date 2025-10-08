const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

// Inicializar tablas
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    profileType TEXT CHECK(profileType IN ('autism', 'intellectual', 'educator', 'parent')),
    abilities TEXT,
    preferences TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

console.log('✅ Base de datos inicializada');
module.exports = db;