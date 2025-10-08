const express = require('express');
const User = require('../models/User');
const router = express.Router();

// GET todos los usuarios
router.get('/', (req, res) => {
  User.getAll((err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// POST crear usuario
router.post('/', express.json(), (req, res) => {
  User.create(req.body, function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ 
      id: this.lastID,
      message: 'Usuario creado exitosamente' 
    });
  });
});

// DELETE eliminar usuario
router.delete('/:id', (req, res) => {
  const db = require('../database/init');
  const userId = req.params.id;
  
  db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado exitosamente' });
  });
});

module.exports = router;