const db = require('../database/init');

class User {
  static create(userData, callback) {
    const { name, age, profileType, abilities, preferences } = userData;
    const sql = `INSERT INTO users (name, age, profileType, abilities, preferences) 
                 VALUES (?, ?, ?, ?, ?)`;
    
    db.run(sql, [
      name, 
      age, 
      profileType, 
      JSON.stringify(abilities), 
      JSON.stringify(preferences)
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