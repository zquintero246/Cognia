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

module.exports = router;