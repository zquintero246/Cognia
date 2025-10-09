const db = require('../database/init');

class User {
  static create(userData, callback) {
    const { name, username, age, profileType, password, abilities, preferences } = userData;
    const sql = `INSERT INTO users (name, username, age, profileType, password, abilities, preferences) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`; // ★ AGREGAR USERNAME
    
    db.run(sql, [
      name, 
      username, // ★ INCLUIR USERNAME
      age, 
      profileType, 
      password,
      abilities,
      preferences
    ], callback);
  }

  static getAll(callback) {
    db.all('SELECT * FROM users', callback);
  }

  static getById(id, callback) {
    db.get('SELECT * FROM users WHERE id = ?', [id], callback);
  }
}

module.exports = User;